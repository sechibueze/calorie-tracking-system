import { cn } from '@/utils/cn';

export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const percent = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="h-2 w-full overflow-hidden rounded-full bg-neutral-100"
    >
      <div className={cn('h-full rounded-full transition-all', value >= max ? 'bg-red-500' : 'bg-primary')} style={{ width: `${percent}%` }} />
    </div>
  );
}