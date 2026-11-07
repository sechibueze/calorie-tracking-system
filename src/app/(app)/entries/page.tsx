import type { Metadata } from 'next';
import { EntriesView } from '@/components/EntriesView';

export const metadata: Metadata = { title: 'Food entries' };

export default function EntriesPage() {
  return <EntriesView />;
}