'use client';

import { useMemo, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import { createEntryFormSchema, type EntryFormData } from '@/features/entries/entries.schema';
import type { Entry, FoodSuggestion } from '@/features/entries/entries.types';
import { useForm } from '@/hooks/useForm';
import { nowDatetimeLocal, toDatetimeLocal } from '@/utils/date.util';
import { FoodAutocomplete } from '@/components/FormAutocomplete';

interface EntryFormProps {
  /** Present when editing. */
  entry?: Entry;
  /** Present on the admin "add entry" form: lets the admin pick whose entry it is. */
  users?: Array<{ id: string; name: string; email: string }>;
  onSubmit: (data: EntryFormData) => Promise<void>;
  onCancel: () => void;
}

/**
 * Add/edit form. Picking a food suggestion fills the name and calories (per 100 g, scaled by the
 * amount); everything stays editable, and without a suggestion the user simply types the values.
 */
export function EntryForm({ entry, users, onSubmit, onCancel }: EntryFormProps) {
  const schema = useMemo(() => createEntryFormSchema(Boolean(users) && !entry), [users, entry]);
  const form = useForm(schema, {
    userId: '',
    name: entry?.name ?? '',
    calories: entry ? String(entry.calories) : '',
    quantityGrams: entry?.quantityGrams ? String(entry.quantityGrams) : '',
    consumedAt: entry ? toDatetimeLocal(entry.consumedAt) : nowDatetimeLocal(),
    fdcId: entry?.fdcId ? String(entry.fdcId) : '',
    brand: entry?.brand ?? '',
  });
  const [per100g, setPer100g] = useState<number | null>(null);
  const [caloriesEdited, setCaloriesEdited] = useState(false);

  const name = form.field('name');
  const calories = form.field('calories');
  const quantity = form.field('quantityGrams');

  const clearFoodLink = () => {
    form.setValue('fdcId', '');
    form.setValue('brand', '');
    setPer100g(null);
  };

  const selectSuggestion = (food: FoodSuggestion) => {
    form.setValue('name', food.name);
    form.setValue('fdcId', String(food.fdcId));
    form.setValue('brand', food.brand ?? '');
    setPer100g(food.caloriesPer100g);
    if (food.caloriesPer100g !== null) {
      form.setValue('quantityGrams', '100');
      form.setValue('calories', String(food.caloriesPer100g));
      setCaloriesEdited(false);
    }
  };

  const submit = form.handleSubmit(onSubmit);

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {form.formError && <Alert tone="error">{form.formError}</Alert>}

      {users && !entry && (
        <SelectField
          label="User"
          placeholder="Choose a user"
          options={users.map((u) => ({ value: u.id, label: `${u.name} (${u.email})` }))}
          error={form.errors.userId}
          value={form.values.userId}
          onChange={(e) => form.setValue('userId', e.target.value)}
        />
      )}

      <FoodAutocomplete
        label="Food or product"
        name="name"
        value={name.value}
        error={name.error}
        onBlur={name.onBlur}
        onTextChange={(text) => {
          form.setValue('name', text);
          if (form.values.fdcId) clearFoodLink(); // the text no longer matches the chosen food
        }}
        onSelect={selectSuggestion}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Amount (g)"
          inputMode="numeric"
          placeholder="optional"
          {...quantity}
          onChange={(event) => {
            quantity.onChange(event);
            const grams = event.target.value;
            if (per100g !== null && !caloriesEdited && /^\d+$/.test(grams)) {
              form.setValue('calories', String(Math.round((per100g * Number(grams)) / 100)));
            }
          }}
        />
        <TextField
          label="Calories (kcal)"
          inputMode="numeric"
          required
          hint={per100g !== null ? `Based on ${per100g} kcal per 100 g` : undefined}
          {...calories}
          onChange={(event) => {
            calories.onChange(event);
            setCaloriesEdited(true);
          }}
        />
      </div>

      <TextField label="Date and time eaten" type="datetime-local" required {...form.field('consumedAt')} />

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={form.isSubmitting}>{entry ? 'Save changes' : 'Add entry'}</Button>
      </div>
    </form>
  );
}