import { z } from 'zod';
import type { EntryPayload, EntryUpdatePayload } from './entries.types';

const MAX_CALORIES = 2_100;
const FUTURE_TOLERANCE_MS = 5 * 60_000;

const rangeMessage = (label: string, min: number, max: number) =>
  min === 0 ? `${label} cannot be negative` : `${label} must be between ${min} and ${max.toLocaleString()}`;

const wholeNumber = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .regex(/^-?\d+$/, `${label} must be a whole number`)
    .transform(Number)
    .pipe(z.number().min(min, rangeMessage(label, min, max)).max(max, `${label} cannot exceed ${max.toLocaleString()}`));

const optionalWholeNumber = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .refine((v) => v === '' || /^-?\d+$/.test(v), `${label} must be a whole number`)
    .refine((v) => v === '' || (Number(v) >= min && Number(v) <= max), rangeMessage(label, min, max))
    .transform((v) => (v === '' ? undefined : Number(v)));

const consumedAt = z
  .string()
  .min(1, 'Date and time are required')
  .refine((v) => !Number.isNaN(Date.parse(v)), 'Enter a valid date and time')
  .refine((v) => Date.parse(v) <= Date.now() + FUTURE_TOLERANCE_MS, 'Time cannot be in the future')
  .transform((v) => new Date(v).toISOString());

export const createEntryFormSchema = (requireUser = false) =>
  z
    .object({
      userId: requireUser ? z.string().min(1, 'Choose a user') : z.string(),
      name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
      calories: wholeNumber('Calories', 0, MAX_CALORIES),
      quantityGrams: optionalWholeNumber('Amount', 1, 10_000),
      consumedAt,
      // Set by the food autocomplete, not typed by the user.
      fdcId: z.string(),
      brand: z.string(),
    })
    .transform(({ userId, fdcId, brand, ...rest }) => ({
      ...rest,
      userId: userId || undefined,
      fdcId: fdcId ? Number(fdcId) : undefined,
      brand: brand || undefined,
    }));

export type EntryFormData = z.output<ReturnType<typeof createEntryFormSchema>>;

export const toCreatePayload = (d: EntryFormData): EntryPayload => ({
  name: d.name,
  calories: d.calories,
  consumedAt: d.consumedAt,
  ...(d.fdcId !== undefined ? { fdcId: d.fdcId } : {}),
  ...(d.brand ? { brand: d.brand } : {}),
  ...(d.quantityGrams !== undefined ? { quantityGrams: d.quantityGrams } : {}),
});

/** Cleared optional details are sent as null so the API removes them. */
export const toUpdatePayload = (d: EntryFormData): EntryUpdatePayload => ({
  name: d.name,
  calories: d.calories,
  consumedAt: d.consumedAt,
  fdcId: d.fdcId ?? null,
  brand: d.brand ?? null,
  quantityGrams: d.quantityGrams ?? null,
});