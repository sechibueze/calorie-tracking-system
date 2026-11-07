import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import type { DailySummary, Entry } from '@/features/entries/entries.types';
import { dayOf, formatDay, formatTime } from '@/utils/date.util';
import { formatKcal } from '@/utils/format.util';

interface EntriesListProps {
  entries: Entry[];
  /** Totals per day (from the summary endpoint), keyed by YYYY-MM-DD. */
  summaries: Record<string, DailySummary>;
  dailyLimit: number;
  onEdit: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
}

/** Entries grouped by day; every day shows its total and a warning once the daily limit is reached. */
export function EntriesList({ entries, summaries, dailyLimit, onEdit, onDelete }: EntriesListProps) {
  const days = new Map<string, Entry[]>();
  for (const entry of entries) {
    const day = dayOf(entry.consumedAt);
    days.set(day, [...(days.get(day) ?? []), entry]);
  }

  return (
    <div className="divide-y divide-neutral-100">
      {[...days].map(([day, dayEntries]) => {
        const summary = summaries[day];
        const total = summary?.totalCalories ?? dayEntries.reduce((sum, e) => sum + e.calories, 0);
        const reached = summary?.limitReached ?? total >= dailyLimit;
        return (
          <section key={day} aria-label={formatDay(day)}>
            <header className="flex flex-wrap items-center justify-between gap-2 bg-neutral-50 px-5 py-2.5">
              <h3 className="text-sm font-semibold">{formatDay(day)}</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-600">{total.toLocaleString()} / {dailyLimit.toLocaleString()} kcal</span>
                {reached ? (
                  <Badge tone="danger">
                    Limit reached{summary && summary.overBy > 0 ? ` (+${summary.overBy.toLocaleString()})` : ''}
                  </Badge>
                ) : (
                  <Badge tone="success">Within limit</Badge>
                )}
              </div>
            </header>
            <ul className="divide-y divide-neutral-100">
              {dayEntries.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-4 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{entry.name}</p>
                    <p className="text-xs text-neutral-500">
                      {formatTime(entry.consumedAt)}
                      {entry.quantityGrams ? ` · ${entry.quantityGrams} g` : ''}
                      {entry.brand ? ` · ${entry.brand}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-primary-700">{formatKcal(entry.calories)}</span>
                    <button type="button" onClick={() => onEdit(entry)} aria-label={`Edit ${entry.name}`} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
                      <Icon name="edit" className="size-4" />
                    </button>
                    <button type="button" onClick={() => onDelete(entry)} aria-label={`Delete ${entry.name}`} className="rounded-md p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600">
                      <Icon name="trash" className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}