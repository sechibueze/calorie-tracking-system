import type { Metadata } from 'next';
import { DashboardView } from '@/components/Dashboard';

export const metadata: Metadata = { title: 'Dashboard' };
export const instant = false;

export default function DashboardPage() {
  return <DashboardView />;
}