'use client';

import { useMemo, useState } from 'react';
import { EntryFormModal } from '@/components/EntryFormModal';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SectionCard } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { DateRangeFilter } from '@/components/ui/DateRangeFilter';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { SelectField } from '@/components/ui/SelectField';
import { Spinner } from '@/components/ui/Spinner';
import { adminApi } from '@/features/admin/admin.api';
import type { AdminEntry } from '@/features/admin/admin.types';
import { toCreatePayload, toUpdatePayload } from '@/features/entries/entries.schema';
import { useQuery } from '@/hooks/useQuery';
import { ApiError } from '@/lib/api-error';
import { browserTimeZone, formatDateTime } from '@/utils/date.util';
import { formatKcal } from '@/utils/format.util';

const PAGE_SIZE = 20;

export function AdminEntriesView() {
  const timezone = useMemo(() => browserTimeZone(), []);
  const [userId, setUserId] = useState('');
  const [range, setRange] = useState({ from: '', to: '' });
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminEntry | 'new' | null>(null);
  const [deleting, setDeleting] = useState<AdminEntry | null>(null);

  const users = useQuery('admin-users', (signal) => adminApi.listUsers(signal));
  const filters = { userId: userId || undefined, dateFrom: range.from || undefined, dateTo: range.to || undefined, timezone };
  const list = useQuery(`admin-entries:${JSON.stringify([filters, page])}`, (signal) =>
    adminApi.listEntries({ ...filters, page, limit: PAGE_SIZE }, signal),
  );

  const columns: Column<AdminEntry>[] = [
    {
      header: 'User',
      cell: (e) => (
        <>
          <p className="font-medium">{e.user?.name ?? 'Unknown user'}</p>
          <p className="text-xs text-neutral-500">{e.user?.email}</p>
        </>
      ),
    },
    {
      header: 'Food',
      cell: (e) => (
        <>
          <p className="font-medium">{e.name}</p>
          {e.brand && <p className="text-xs text-neutral-500">{e.brand}</p>}
        </>
      ),
    },
    { header: 'Amount', cell: (e) => (e.quantityGrams ? `${e.quantityGrams} g` : '—') },
    { header: 'Calories', cell: (e) => <span className="font-semibold text-primary-700">{formatKcal(e.calories)}</span> },
    { header: 'Eaten', cell: (e) => formatDateTime(e.consumedAt) },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (e) => (
        <div className="flex justify-end gap-1">
          <button type="button" onClick={() => setEditing(e)} aria-label={`Edit ${e.name} for ${e.user?.name ?? 'user'}`} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
            <Icon name="edit" className="size-4" />
          </button>
          <button type="button" onClick={() => setDeleting(e)} aria-label={`Delete ${e.name} for ${e.user?.name ?? 'user'}`} className="rounded-md p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600">
            <Icon name="trash" className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="All entries"
        description="Food entries of every user."
        actions={<Button leftIcon={<Icon name="plus" className="size-4" />} onClick={() => setEditing('new')}>Add entry</Button>}
      />

      <div className="space-y-6">
        <SectionCard title="Filters">
          <div className="space-y-4 p-5">
            <SelectField
              label="User"
              className="sm:max-w-sm"
              placeholder="All users"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setPage(1);
              }}
              options={(users.data ?? []).map((u) => ({ value: u.id, label: `${u.name} (${u.email})` }))}
            />
            <DateRangeFilter
              from={range.from}
              to={range.to}
              onApply={(next) => {
                setRange(next);
                setPage(1);
              }}
              onReset={() => {
                setRange({ from: '', to: '' });
                setUserId('');
                setPage(1);
              }}
            />
          </div>
        </SectionCard>

        <SectionCard title="Entries">
          {list.error ? (
            <div className="p-5"><Alert tone="error">{list.error instanceof ApiError ? list.error.message : 'Could not load entries.'}</Alert></div>
          ) : !list.data ? (
            <div className="flex justify-center p-10"><Spinner className="size-6 text-primary" /></div>
          ) : list.data.items.length === 0 ? (
            <EmptyState title="No entries found" description="Try a different user or date range." />
          ) : (
            <>
              <DataTable caption="All food entries" columns={columns} rows={list.data.items} />
              <Pagination page={list.data.meta.page} totalPages={list.data.meta.totalPages} total={list.data.meta.total} onPageChange={setPage} />
            </>
          )}
        </SectionCard>
      </div>

      <EntryFormModal
        open={editing !== null}
        title={editing === 'new' || editing === null ? 'Add entry for a user' : 'Edit entry'}
        entry={editing === 'new' ? undefined : (editing ?? undefined)}
        users={users.data}
        onClose={() => setEditing(null)}
        onSubmit={async (data) => {
          if (editing && editing !== 'new') await adminApi.updateEntry(editing.id, toUpdatePayload(data));
          else await adminApi.createEntry({ ...toCreatePayload(data), userId: data.userId ?? '' });
          setEditing(null);
          list.refetch();
        }}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Delete entry?"
        message={`“${deleting?.name ?? ''}” belonging to ${deleting?.user?.name ?? 'this user'} will be removed.`}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (deleting) await adminApi.removeEntry(deleting.id);
          setDeleting(null);
          list.refetch();
        }}
      />
    </>
  );
}