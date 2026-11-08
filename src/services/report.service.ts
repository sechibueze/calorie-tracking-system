import { addDays } from '@/utils/date.util';
import { getUsersByIds } from '@/repositories/user.repository';
import * as reportRepository from '@/repositories/report.repository';

const DAY_MS = 86_400_000;

/**
 * Two consecutive 7-day windows on UTC days. The current window ends tomorrow 00:00 so it includes
 * all of today: [today-6d, tomorrow). The previous window is the 7 days before it.
 */
export function reportWindows(now: Date) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const currentFrom = new Date(today - 6 * DAY_MS);
  const currentTo = new Date(today + DAY_MS);
  const previousFrom = new Date(currentFrom.getTime() - 7 * DAY_MS);
  return {
    current: { gte: currentFrom, lt: currentTo },
    previous: { gte: previousFrom, lt: currentFrom },
    today: new Date(today).toISOString().slice(0, 10),
  };
}

const range = (w: { gte: Date; lt: Date }) => ({ from: w.gte.toISOString(), to: w.lt.toISOString() });

/**
 * Admin report: entries added in the last 7 days (today included) vs the 7 days before, and the
 * average calories added per user over the last 7 days. "Per user" averages over the users who
 * added at least one entry in that window.
 */
export async function getWeeklyReport(now: Date = new Date()) {
  const windows = reportWindows(now);
  const [currentCount, previousCount, perUser] = await Promise.all([
    reportRepository.countEntriesAdded(windows.current),
    reportRepository.countEntriesAdded(windows.previous),
    reportRepository.caloriesAddedByUser(windows.current),
  ]);
  const users = new Map((await getUsersByIds(perUser.map((p) => p.userId))).map((u) => [u.id, u]));
  const totalCalories = perUser.reduce((sum, p) => sum + p.totalCalories, 0);

  return {
    windows: {
      currentWeek: range(windows.current),
      previousWeek: range(windows.previous),
      note: `Current week = ${addDays(windows.today, -6)} to ${windows.today} (UTC), today included`,
    },
    entriesAdded: {
      currentWeek: currentCount,
      previousWeek: previousCount,
      change: currentCount - previousCount,
      changePercent:
        previousCount === 0 ? null : Math.round(((currentCount - previousCount) / previousCount) * 1000) / 10,
    },
    caloriesAdded: {
      totalCurrentWeek: totalCalories,
      activeUsers: perUser.length,
      averagePerUser: perUser.length === 0 ? 0 : Math.round(totalCalories / perUser.length),
      perUser: perUser
        .map((p) => ({ ...p, email: users.get(p.userId)?.email ?? null, name: users.get(p.userId)?.name ?? null }))
        .sort((a, b) => b.totalCalories - a.totalCalories),
    },
  };
}