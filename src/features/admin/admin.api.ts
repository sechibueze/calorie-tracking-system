import { api } from '@/lib/api-client';
import type { EntryUpdatePayload } from '@/features/entries/entries.types';
import type { ApiSuccess } from '@/types/api';
import type {
  AdminEntriesMeta,
  AdminEntriesQuery,
  AdminEntry,
  AdminEntryPayload,
  UserSummary,
  WeeklyReport,
} from './admin.types';

export const adminApi = {
  async listEntries(params: AdminEntriesQuery, signal?: AbortSignal): Promise<{ items: AdminEntry[]; meta: AdminEntriesMeta }> {
    const { data } = await api.get<ApiSuccess<AdminEntry[]>>('/admin/entries', { params, signal });
    return { items: data.data, meta: data.meta as unknown as AdminEntriesMeta };
  },

  async createEntry(payload: AdminEntryPayload): Promise<AdminEntry> {
    const { data } = await api.post<ApiSuccess<AdminEntry>>('/admin/entries', payload);
    return data.data;
  },

  async updateEntry(id: string, payload: EntryUpdatePayload): Promise<AdminEntry> {
    const { data } = await api.patch<ApiSuccess<AdminEntry>>(`/admin/entries/${id}`, payload);
    return data.data;
  },

  async removeEntry(id: string): Promise<void> {
    await api.delete(`/admin/entries/${id}`);
  },

  async listUsers(signal?: AbortSignal): Promise<UserSummary[]> {
    const { data } = await api.get<ApiSuccess<UserSummary[]>>('/users', { signal });
    return data.data;
  },

  async weeklyReport(signal?: AbortSignal): Promise<WeeklyReport> {
    const { data } = await api.get<ApiSuccess<WeeklyReport>>('/admin/reports/summary', { signal });
    return data.data;
  },
};