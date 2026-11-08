import { z } from 'zod';
import { isValidTimeZone } from '@/utils/date.util';
import { env } from '@/config/env';

export const MAX_CALORIES = 10_000;
const FUTURE_TOLERANCE_MS = 5 * 60_000;

const name = z.string().min(1, 'name is required').max(100, 'name must be at most 100 characters');
const calories = z
  .number()
  .int('calories must be a whole number')
  .min(0, 'calories cannot be negative')
  .max(env.DEFAULT_DAILY_CALORIE_LIMIT, `calories cannot exceed ${MAX_CALORIES}`);
const consumedAt = z.iso
  .datetime({ offset: true, message: 'consumedAt must be an ISO 8601 date-time' })
  .transform((value) => new Date(value))
  .refine((date) => date.getTime() <= Date.now() + FUTURE_TOLERANCE_MS, {
    message: 'consumedAt cannot be in the future',
  });

const fdcId = z.number().int().positive();
const brand = z.string().min(1).max(100);
const quantityGrams = z
  .number()
  .int('quantityGrams must be a whole number')
  .min(1, 'quantityGrams must be at least 1')
  .max(10_000, 'quantityGrams cannot exceed 10000');

export const entryFields = {
  name,
  calories,
  consumedAt: consumedAt.optional(),
  fdcId: fdcId.optional(),
  brand: brand.optional(),
  quantityGrams: quantityGrams.optional(),
};

export const createEntryBody = z.strictObject(entryFields);
// export const createEntryBody = z.strictObject({ name, calories, consumedAt: consumedAt.optional(),  fdcId: fdcId.optional(),
//   brand: brand.optional(),
//   quantityGrams: quantityGrams.optional(), });

export const updateEntryBody = z
  .strictObject({ name: name.optional(), calories: calories.optional(), consumedAt: consumedAt.optional(), fdcId: fdcId.nullable().optional(),
    brand: brand.nullable().optional(),
    quantityGrams: quantityGrams.nullable().optional(),})
  .refine((body) => Object.keys(body).length > 0, { message: 'Provide at least one field to update' });

export const entryIdParams = z.object({ id: z.uuid('id must be a valid UUID') });

// const day = z.iso.date('must be a date in YYYY-MM-DD format');
// const timezone = z
//   .string()
//   .refine(isValidTimeZone, 'must be a valid IANA time zone, e.g. Africa/Lagos')
//   .default('UTC');

// const rangeIsOrdered = (q: { dateFrom?: string; dateTo?: string }): boolean =>
//   !q.dateFrom || !q.dateTo || q.dateFrom <= q.dateTo;
// const rangeError = { message: 'dateFrom must not be after dateTo', path: ['dateFrom'] };

// export const listEntriesQuery = z
//   .object({
//     dateFrom: day.optional(),
//     dateTo: day.optional(),
//     timezone,
//     page: z.coerce.number().int().min(1).default(1),
//     limit: z.coerce.number().int().min(1).max(100).default(20),
//   })
//   .refine(rangeIsOrdered, rangeError);

// export const summaryQuery = z
//   .object({ dateFrom: day.optional(), dateTo: day.optional(), timezone })
//   .refine(rangeIsOrdered, rangeError);

export const suggestQuery = z.object({
  q: z.string().min(2, 'q must be at least 2 characters').max(100, 'q must be at most 100 characters'),
});

const day = z.iso.date('must be a date in YYYY-MM-DD format');
const timezone = z
  .string()
  .refine(isValidTimeZone, 'must be a valid IANA time zone, e.g. Africa/Lagos')
  .default('UTC');

/** Inclusive day range, interpreted in `timezone`. Shared by user and admin queries. */
export const dateRangeFields = { dateFrom: day.optional(), dateTo: day.optional(), timezone };
export const pageFields = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
};

export const rangeIsOrdered = (q: { dateFrom?: string; dateTo?: string }): boolean =>
  !q.dateFrom || !q.dateTo || q.dateFrom <= q.dateTo;
export const rangeError = { message: 'dateFrom must not be after dateTo', path: ['dateFrom'] };

export const listEntriesQuery = z.object({ ...dateRangeFields, ...pageFields }).refine(rangeIsOrdered, rangeError);

export const summaryQuery = z.object({ ...dateRangeFields }).refine(rangeIsOrdered, rangeError);

export type SuggestQuery = z.output<typeof suggestQuery>;
export type CreateEntryBody = z.output<typeof createEntryBody>;
export type UpdateEntryBody = z.output<typeof updateEntryBody>;
export type ListEntriesQuery = z.output<typeof listEntriesQuery>;
export type SummaryQuery = z.output<typeof summaryQuery>;