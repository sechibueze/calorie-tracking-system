'use client';

import { type KeyboardEvent, useId, useRef, useState } from 'react';
import { TextField } from '@/components/ui/TextField';
import { entriesApi } from '@/features/entries/entries.api';
import type { FoodSuggestion } from '@/features/entries/entries.types';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useQuery } from '@/hooks/useQuery';
import { cn } from '@/utils/cn';

interface FoodAutocompleteProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  onTextChange: (text: string) => void;
  onSelect: (suggestion: FoodSuggestion) => void;
  onBlur?: () => void;
}

/**
 * Food name input that suggests products from the USDA FoodData Central database as you type.
 * It never blocks the user: with no matches, or when the database is unreachable, they just type.
 */
export function FoodAutocomplete({ label, name, value, error, onTextChange, onSelect, onBlur }: FoodAutocompleteProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const query = useDebouncedValue(value.trim(), 300);
  const enabled = open && query.length >= 2;
  const { data, isLoading } = useQuery(`suggest:${query}`, (signal) => entriesApi.suggestFoods(query, signal), { enabled });
  useClickOutside(containerRef, () => setOpen(false), open);

  const ready = enabled && !isLoading && data !== undefined;
  const suggestions = ready ? data.suggestions : [];

  const choose = (suggestion: FoodSuggestion) => {
    onSelect(suggestion);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => Math.min(suggestions.length - 1, i + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (event.key === 'Enter' && open && active >= 0 && suggestions[active]) {
      event.preventDefault(); // pick the suggestion instead of submitting the form
      choose(suggestions[active]);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <TextField
        label={label}
        name={name}
        value={value}
        error={error}
        autoComplete="off"
        placeholder="e.g. banana"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        onChange={(event) => {
          onTextChange(event.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />

      {ready && suggestions.length > 0 && (
        <ul id={listId} role="listbox" aria-label="Food suggestions" className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
          {suggestions.map((s, index) => (
            <li
              key={s.fdcId}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              onMouseDown={(event) => {
                event.preventDefault();
                choose(s);
              }}
              className={cn('flex cursor-pointer items-center justify-between gap-3 px-3.5 py-2 text-sm', index === active ? 'bg-primary-50' : 'hover:bg-neutral-50')}
            >
              <span className="min-w-0">
                <span className="block truncate font-medium">{s.name}</span>
                {s.brand && <span className="block truncate text-xs text-neutral-500">{s.brand}</span>}
              </span>
              <span className="shrink-0 text-xs text-primary-700">
                {s.caloriesPer100g === null ? 'no kcal data' : `${s.caloriesPer100g} kcal / 100 g`}
              </span>
            </li>
          ))}
        </ul>
      )}

      {ready && suggestions.length === 0 && (
        <p role="status" className="mt-1 text-xs text-neutral-500">
          {data.degraded ? 'Food search is unavailable right now. Enter the details manually.' : 'No matches. Enter the calories manually.'}
        </p>
      )}
    </div>
  );
}