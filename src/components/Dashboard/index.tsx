'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { StatCard } from '@/components/ui/StatCard';
import { useAuthStore } from '@/features/auth/auth.store';
import { entriesApi } from '@/features/entries/entries.api';
import { useQuery } from '@/hooks/useQuery';
import { addDays, browserTimeZone, dayOf, formatDay, formatTime, toLocalDate } from '@/utils/date.util';
import { formatKcal } from '@/utils/format.util';


/** Overview: today against the daily limit, the last two weeks, and the latest entries. */
export function DashboardView() {
  const user = useAuthStore((s) => s.user);
  const timezone = useMemo(() => browserTimeZone(), []);
  const today = toLocalDate(new Date());
  const limit = user?.dailyCalorieLimit ?? 2100;

  const summary = useQuery(`dashboard-summary:${today}`, (signal) =>
    entriesApi.summary({ dateFrom: addDays(today, -13), dateTo: today, timezone }, signal),
  );
  const recent = useQuery(`dashboard-recent:${today}`, (signal) => entriesApi.list({ limit: 5, timezone }, signal));

  const days = summary.data ?? [];
  const todayTotal = days.find((d) => d.date === today)?.totalCalories ?? 0;
  const weekStart = addDays(today, -6);
  const weekTotal = days.filter((d) => d.date >= weekStart).reduce((sum, d) => sum + d.totalCalories, 0);
  const daysOver = days.filter((d) => d.limitReached);

  return (
    <>
      <PageHeader title="Dashboard" description="Where you stand today and over the last two weeks." actions={<ButtonLink href="/entries">Add or manage entries</ButtonLink>} />

      {todayTotal >= limit && (
        <Alert tone="error" className="mb-6">
          You have reached your daily limit of {formatKcal(limit)} today ({formatKcal(todayTotal)} so far).
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today" value={formatKcal(todayTotal)} hint={`of ${formatKcal(limit)}`}>
          <ProgressBar value={todayTotal} max={limit} label="Calories today" />
        </StatCard>
        <StatCard label="Daily average (7 days)" value={formatKcal(Math.round(weekTotal / 7))} hint="Total of the last 7 days divided by 7" />
        <StatCard label="Days over limit (14 days)" value={daysOver.length} hint={daysOver.length ? 'See the list below' : 'Nicely done'} />
        <StatCard label="Daily limit" value={formatKcal(limit)} hint="Set by an administrator" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Daily limit, last 14 days">
          {!summary.data ? (
            <div className="flex justify-center p-10"><Spinner className="size-6 text-primary" /></div>
          ) : days.length === 0 ? (
            <EmptyState title="Nothing logged yet" description="Your daily totals will show up here." />
          ) : (
            <ul className="divide-y divide-neutral-100">
              {days.map((d) => (
                <li key={d.date} className="space-y-2 px-5 py-3">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium">{formatDay(d.date)}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-neutral-600">{d.totalCalories.toLocaleString()} kcal</span>
                      {d.limitReached ? <Badge tone="danger">Limit reached</Badge> : <Badge tone="success">Within limit</Badge>}
                    </span>
                  </div>
                  <ProgressBar value={d.totalCalories} max={d.dailyLimit} label={`Calories on ${formatDay(d.date)}`} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Latest entries" action={<Link href="/entries" className="text-sm font-medium text-primary hover:underline">View all</Link>}>
          {!recent.data ? (
            <div className="flex justify-center p-10"><Spinner className="size-6 text-primary" /></div>
          ) : recent.data.items.length === 0 ? (
            <EmptyState title="No entries yet" description="Add your first meal to get started." action={<ButtonLink href="/entries">Add entry</ButtonLink>} />
          ) : (
            <ul className="divide-y divide-neutral-100">
              {recent.data.items.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{e.name}</p>
                    <p className="text-xs text-neutral-500">{formatDay(dayOf(e.consumedAt))}, {formatTime(e.consumedAt)}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary-700">{formatKcal(e.calories)}</span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </>
  );
}