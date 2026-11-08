import { db } from '@/database/db';

export interface Window {
  gte: Date;
  lt: Date;
}

/** Entries are counted by when they were *added* (createdAt), not when the food was eaten. */
export const countEntriesAdded = (window: Window): Promise<number> =>
  db.foodEntry.count({ where: { deletedAt: null, createdAt: window } });

export async function caloriesAddedByUser(window: Window) {
  const groups = await db.foodEntry.groupBy({
    by: ['userId'],
    where: { deletedAt: null, createdAt: window },
    _sum: { calories: true },
    _count: { _all: true },
  });
  return groups.map((g) => ({
    userId: g.userId,
    totalCalories: g._sum.calories ?? 0,
    entryCount: g._count._all,
  }));
}