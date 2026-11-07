'use client';
import { useMemo, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DateRangeFilter } from '@/components/ui/DateRangeFilter';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { SectionCard } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/features/auth/auth.store';
import { entriesApi } from '@/features/entries/entries.api';
import { toCreatePayload, toUpdatePayload } from '@/features/entries/entries.schema';
import type { Entry } from '@/features/entries/entries.types';
import { useQuery } from '@/hooks/useQuery';
import { ApiError } from '@/lib/api-error';
import { browserTimeZone } from '@/utils/date.util';
import { EntriesList } from '@/components/EntriesList';
import { EntryFormModal } from '@/components/EntryFormModal';

const PAGE_SIZE = 20;

/** The user's food entries: date filters, daily-limit warnings, add / edit / delete. */
export function EntriesView() {
  const dailyLimit = useAuthStore((s) => s.user?.dailyCalorieLimit ?? 2100);
  const timezone = useMemo(() => browserTimeZone(), []);
  const [range, setRange] = useState({ from: '', to: '' });
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Entry | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Entry | null>(null);

  const filters = { dateFrom: range.from || undefined, dateTo: range.to || undefined, timezone };
  const list = useQuery(`entries:${JSON.stringify([filters, page])}`, (signal) => entriesApi.list({ ...filters, page, limit: PAGE_SIZE }, signal));
  const summary = useQuery(`summary:${JSON.stringify(filters)}`, (signal) => entriesApi.summary(filters, signal));

  const summaries = useMemo(() => Object.fromEntries((summary.data ?? []).map((d) => [d.date, d])), [summary.data]);
  const refresh = () => {
    list.refetch();
    summary.refetch();
  };

  return (
    <>
      <PageHeader
        title="Food entries"
        description={`Your daily limit is ${dailyLimit.toLocaleString()} kcal.`}
        actions={<Button leftIcon={<Icon name="plus" className="size-4" />} onClick={() => setEditing('new')}>Add entry</Button>}
      />

      <div className="space-y-6">
        <SectionCard title="Filter by date">
          <div className="p-5">
            <DateRangeFilter
              from={range.from}
              to={range.to}
              onApply={(next) => {
                setRange(next);
                setPage(1);
              }}
              onReset={() => {
                setRange({ from: '', to: '' });
                setPage(1);
              }}
            />
          </div>
        </SectionCard>

        <SectionCard title="Entries">
          {list.error ? (
            <div className="p-5">
              <Alert tone="error">{list.error instanceof ApiError ? list.error.message : 'Could not load your entries.'}</Alert>
            </div>
          ) : !list.data ? (
            <div className="flex justify-center p-10"><Spinner className="size-6 text-primary" /></div>
          ) : list.data.items.length === 0 ? (
            <EmptyState
              title={range.from || range.to ? 'No entries in this period' : 'No entries yet'}
              description="Add what you ate and we will keep track of your daily total."
              action={<Button onClick={() => setEditing('new')}>Add your first entry</Button>}
            />
          ) : (
            <>
              <EntriesList entries={list.data.items} summaries={summaries} dailyLimit={dailyLimit} onEdit={setEditing} onDelete={setDeleting} />
              <Pagination page={list.data.meta.page} totalPages={list.data.meta.totalPages} total={list.data.meta.total} onPageChange={setPage} />
            </>
          )}
        </SectionCard>
      </div>

      <EntryFormModal
        open={editing !== null}
        title={editing === 'new' || editing === null ? 'Add food entry' : 'Edit food entry'}
        entry={editing === 'new' ? undefined : (editing ?? undefined)}
        onClose={() => setEditing(null)}
        onSubmit={async (data) => {
          if (editing && editing !== 'new') await entriesApi.update(editing.id, toUpdatePayload(data));
          else await entriesApi.create(toCreatePayload(data));
          setEditing(null);
          refresh();
        }}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Delete entry?"
        message={`“${deleting?.name ?? ''}” will be removed from your log.`}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (deleting) await entriesApi.remove(deleting.id);
          setDeleting(null);
          refresh();
        }}
      />
    </>
  );
}