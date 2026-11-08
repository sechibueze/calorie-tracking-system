import { z } from 'zod';
import {
  dateRangeFields,
  entryFields,
  pageFields,
  rangeError,
  rangeIsOrdered,
} from './entry.schema';

export const adminListEntriesQuery = z
  .object({ userId: z.uuid('userId must be a valid UUID').optional(), ...dateRangeFields, ...pageFields })
  .refine(rangeIsOrdered, rangeError);

export const adminCreateEntryBody = z.strictObject({
  userId: z.uuid('userId must be a valid UUID'),
  ...entryFields,
});

export type AdminListEntriesQuery = z.output<typeof adminListEntriesQuery>;
export type AdminCreateEntryBody = z.output<typeof adminCreateEntryBody>;