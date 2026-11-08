import { api } from '@/lib/api-client';
import type { ApiSuccess } from '@/types/api';
import type {
  DailySummary,
  EntriesMeta,
  EntriesQuery,
  Entry,
  EntryPayload,
  EntryUpdatePayload,
  FoodSuggestion,
} from './entries.types';

export const entriesApi = {
  async list(params: EntriesQuery, signal?: AbortSignal): Promise<{ items: Entry[]; meta: EntriesMeta }> {
    const { data } = await api.get<ApiSuccess<Entry[]>>('/entries', { params, signal });
    return { items: data.data, meta: data.meta as unknown as EntriesMeta };
  },

  async summary(params: Omit<EntriesQuery, 'page' | 'limit'>, signal?: AbortSignal): Promise<DailySummary[]> {
    const { data } = await api.get<ApiSuccess<DailySummary[]>>('/entries/summary', { params, signal });
    return data.data;
  },

  async create(payload: EntryPayload): Promise<Entry> {
    const { data } = await api.post<ApiSuccess<Entry>>('/entries', payload);
    return data.data;
  },

  async update(id: string, payload: EntryUpdatePayload): Promise<Entry> {
    const { data } = await api.patch<ApiSuccess<Entry>>(`/entries/${id}`, payload);
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/entries/${id}`);
  },

  async suggestFoods(q: string, signal?: AbortSignal): Promise<{ suggestions: FoodSuggestion[]; degraded: boolean }> {
    const { data } = await api.get<ApiSuccess<FoodSuggestion[]>>('/entries/suggest', { params: { q }, signal });
    return { suggestions: data.data, degraded: Boolean(data.meta?.degraded) };
  },
};