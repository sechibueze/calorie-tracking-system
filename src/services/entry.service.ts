import type { FoodEntry } from '@/database/generated/prisma/client';
import { dayRangeToUtc } from '@/utils/date.util';
import type { AuthContext } from '@/schema/auth.schema';
import type { CreateEntryBody, ListEntriesQuery, SummaryQuery, UpdateEntryBody } from '@/schema/entry.schema';
import * as repo from '@/repositories/entry.repository';
import { NotFoundError } from '@/utils/http-error.util';

export const toEntryDto = (e: FoodEntry) => ({
  id: e.id,
  name: e.name,
  calories: e.calories,
  consumedAt: e.consumedAt,
  createdAt: e.createdAt,
  updatedAt: e.updatedAt,
});

const notFound = () => new NotFoundError('Food entry not found');

export async function createEntry(auth: AuthContext, input: CreateEntryBody) {
  const entry = await repo.createEntry({
    userId: auth.user.id,
    name: input.name,
    calories: input.calories,
    consumedAt: input.consumedAt ?? new Date(),
  });
  return toEntryDto(entry);
}

export async function listEntries(auth: AuthContext, query: ListEntriesQuery) {
  const { items, total } = await repo.listEntries({
    userId: auth.user.id,
    range: dayRangeToUtc(query.dateFrom, query.dateTo, query.timezone),
    skip: (query.page - 1) * query.limit,
    take: query.limit,
  });
  return {
    items: items.map(toEntryDto),
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
      dailyLimit: auth.user.dailyCalorieLimit,
    },
  };
}

export async function getEntry(auth: AuthContext, id: string) {
  const entry = await repo.findEntry(id, auth.user.id);
  if (!entry) throw notFound();
  return toEntryDto(entry);
}

export async function updateEntry(auth: AuthContext, id: string, input: UpdateEntryBody) {
  const entry = await repo.updateEntry(id, input, auth.user.id);
  if (!entry) throw notFound();
  return toEntryDto(entry);
}

export async function deleteEntry(auth: AuthContext, id: string): Promise<void> {
  if (!(await repo.softDeleteEntry(id, auth.user.id))) throw notFound();
}

/** Per-day totals with a flag for every day the user reached their daily calorie limit. */
export async function getDailySummary(auth: AuthContext, query: SummaryQuery) {
  const limit = auth.user.dailyCalorieLimit;
  const totals = await repo.getDailyTotals(
    auth.user.id,
    dayRangeToUtc(query.dateFrom, query.dateTo, query.timezone),
    query.timezone,
  );
  return totals.map((t) => ({
    date: t.day,
    totalCalories: t.totalCalories,
    entryCount: t.entryCount,
    dailyLimit: limit,
    limitReached: t.totalCalories >= limit,
    overBy: Math.max(0, t.totalCalories - limit),
  }));
}