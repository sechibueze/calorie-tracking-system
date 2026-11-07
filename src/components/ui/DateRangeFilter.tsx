'use client';

import { useState } from 'react';
import { Button } from './Button';
import { TextField } from './TextField';

interface DateRangeFilterProps {
  from: string;
  to: string;
  onApply: (range: { from: string; to: string }) => void;
  onReset: () => void;
}

export function DateRangeFilter({ from, to, onApply, onReset }: DateRangeFilterProps) {
  const [draft, setDraft] = useState({ from, to });
  const [error, setError] = useState<string>();

  const apply = () => {
    if (draft.from && draft.to && draft.from > draft.to) {
      setError('Start date must be on or before the end date');
      return;
    }
    setError(undefined);
    onApply(draft);
  };

  const reset = () => {
    setDraft({ from: '', to: '' });
    setError(undefined);
    onReset();
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <TextField label="From date" type="date" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} className="sm:w-44" />
      <TextField label="To date" type="date" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} error={error} className="sm:w-44" />
      <div className="flex gap-2">
        <Button onClick={apply}>Apply</Button>
        <Button variant="outline" onClick={reset}>Reset</Button>
      </div>
    </div>
  );
}