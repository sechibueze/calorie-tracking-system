import type { Metadata } from 'next';
import { AdminReportView } from '@/components/AdminReportView';
import { RequirePermission } from '@/components/layout/RequirePermission';

export const metadata: Metadata = { title: 'Reports' };

export default function AdminReportsPage() {
  return (
    <RequirePermission permission="reports:read">
      <AdminReportView />
    </RequirePermission>
  );
}