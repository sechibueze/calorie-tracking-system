import type { EntriesMeta, EntriesQuery, Entry, EntryPayload } from '@/features/entries/entries.types';

export interface Owner {
  id: string;
  email: string;
  name: string;
}

export interface AdminEntry extends Entry {
  userId: string;
  user: Owner | null;
}

export interface AdminEntriesQuery extends EntriesQuery {
  userId?: string;
}

export type AdminEntriesMeta = Omit<EntriesMeta, 'dailyLimit'>;

export interface AdminEntryPayload extends EntryPayload {
  userId: string;
}

export interface UserSummary {
  id: string;
  email: string;
  name: string;
  role: string;
  dailyCalorieLimit: number;
}

export interface WeeklyReport {
  windows: { currentWeek: { from: string; to: string }; previousWeek: { from: string; to: string }; note: string };
  entriesAdded: { currentWeek: number; previousWeek: number; change: number; changePercent: number | null };
  caloriesAdded: {
    totalCurrentWeek: number;
    activeUsers: number;
    averagePerUser: number;
    perUser: Array<{ userId: string; email: string | null; name: string | null; totalCalories: number; entryCount: number }>;
  };
}