import type { Metadata } from 'next';
import { AdminEntriesView } from '@/components/AdminEntriesView';
import { RequirePermission } from '@/components/layout/RequirePermission';

export const metadata: Metadata = { title: 'All entries' };

export default function AdminEntriesPage() {
  return (
    <RequirePermission permission="entries:read:all">
      <AdminEntriesView />
    </RequirePermission>
  );
}