'use client';

import { Alert } from '@/components/ui/Alert';
import { SectionCard } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { StatCard } from '@/components/ui/StatCard';
import { adminApi } from '@/features/admin/admin.api';
import type { WeeklyReport } from '@/features/admin/admin.types';
import { useQuery } from '@/hooks/useQuery';
import { ApiError } from '@/lib/api-error';
import { formatKcal } from '@/utils/format.util';
import { WeeklyComparison } from '@/components/WeeklyComparison';

type PerUserRow = WeeklyReport['caloriesAdded']['perUser'][number] & { id: string };

const columns: Column<PerUserRow>[] = [
  {
    header: 'User',
    cell: (r) => (
      <>
        <p className="font-medium">{r.name ?? 'Unknown user'}</p>
        <p className="text-xs text-neutral-500">{r.email}</p>
      </>
    ),
  },
  { header: 'Entries added', cell: (r) => r.entryCount },
  { header: 'Calories added', cell: (r) => <span className="font-semibold text-primary-700">{formatKcal(r.totalCalories)}</span> },
];

/** Admin report: entries added this week vs last week, and calories added per user. */
export function AdminReportView() {
  const report = useQuery('admin-weekly-report', (signal) => adminApi.weeklyReport(signal));

  if (report.error) {
    return <Alert tone="error">{report.error instanceof ApiError ? report.error.message : 'Could not load the report.'}</Alert>;
  }
  if (!report.data) {
    return <div className="flex justify-center p-16"><Spinner className="size-8 text-primary" /></div>;
  }

  const { entriesAdded, caloriesAdded, windows } = report.data;
  const rows: PerUserRow[] = caloriesAdded.perUser.map((p) => ({ ...p, id: p.userId }));

  return (
    <>
      <PageHeader title="Reports" description={windows.note} />
      <div className="grid gap-4 lg:grid-cols-2">
        <WeeklyComparison current={entriesAdded.currentWeek} previous={entriesAdded.previousWeek} change={entriesAdded.change} changePercent={entriesAdded.changePercent} />
        <StatCard
          label="Average calories added per user (last 7 days)"
          value={formatKcal(caloriesAdded.averagePerUser)}
          hint={`${formatKcal(caloriesAdded.totalCurrentWeek)} across ${caloriesAdded.activeUsers} active ${caloriesAdded.activeUsers === 1 ? 'user' : 'users'}`}
        />
      </div>
      <SectionCard title="Calories added per user" className="mt-6">
        {rows.length === 0 ? (
          <EmptyState title="No entries in the last 7 days" description="Per-user totals appear once users log food." />
        ) : (
          <DataTable caption="Calories added per user in the last 7 days" columns={columns} rows={rows} />
        )}
      </SectionCard>
    </>
  );
}