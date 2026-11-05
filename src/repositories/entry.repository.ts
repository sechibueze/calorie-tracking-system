import { db } from '@/database/db';
import { Prisma, type FoodEntry } from '@/database/generated/prisma/client';
import type { DateRange } from '@/utils/date.util';

export interface ScopeOptions {
  userId?: string;
}

const scope = (userId?: string): Prisma.FoodEntryWhereInput => ({
  deletedAt: null,
  ...(userId ? { userId } : {}),
});

export interface DailyTotal {
  day: string;
  totalCalories: number;
  entryCount: number;
}

export const createEntry = (data: {
  userId: string;
  name: string;
  calories: number;
  consumedAt: Date;
}): Promise<FoodEntry> => db.foodEntry.create({ data });

export const findEntry = (id: string, userId?: string): Promise<FoodEntry | null> =>
  db.foodEntry.findFirst({ where: { id, ...scope(userId) } });

export async function listEntries(
  options: ScopeOptions & { range: DateRange; skip: number; take: number },
): Promise<{ items: FoodEntry[]; total: number }> {
  const where: Prisma.FoodEntryWhereInput = {
    ...scope(options.userId),
    ...(options.range.gte || options.range.lt ? { consumedAt: options.range } : {}),
  };
  const [items, total] = await db.$transaction([
    db.foodEntry.findMany({
      where,
      orderBy: [{ consumedAt: 'desc' }, { id: 'desc' }],
      skip: options.skip,
      take: options.take,
    }),
    db.foodEntry.count({ where }),
  ]);
  return { items, total };
}

export async function updateEntry(
  id: string,
  data: Partial<{ name: string; calories: number; consumedAt: Date }>,
  userId?: string,
): Promise<FoodEntry | null> {
  try {
    return await db.foodEntry.update({
      where: { id, deletedAt: null, ...(userId ? { userId } : {}) },
      data,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return null;
    throw err;
  }
}

export async function softDeleteEntry(id: string, userId?: string): Promise<boolean> {
  const { count } = await db.foodEntry.updateMany({
    where: { id, ...scope(userId) },
    data: { deletedAt: new Date() },
  });
  return count > 0;
}

/** Calories per calendar day in the caller's time zone, newest day first. */
export function getDailyTotals(userId: string, range: DateRange, timeZone: string): Promise<DailyTotal[]> {
  const from = (range.gte ?? new Date('1970-01-01T00:00:00Z')).toISOString();
  const to = (range.lt ?? new Date('9999-01-01T00:00:00Z')).toISOString();
  return db.$queryRaw<DailyTotal[]>`
    SELECT to_char(("consumedAt" AT TIME ZONE 'UTC') AT TIME ZONE ${timeZone}, 'YYYY-MM-DD') AS "day",
           SUM("calories")::int AS "totalCalories",
           COUNT(*)::int AS "entryCount"
    FROM "food_entries"
    WHERE "userId" = ${userId}::uuid
      AND "deletedAt" IS NULL
      AND "consumedAt" >= ${from}::timestamp
      AND "consumedAt" < ${to}::timestamp
    GROUP BY 1
    ORDER BY 1 DESC`;
}