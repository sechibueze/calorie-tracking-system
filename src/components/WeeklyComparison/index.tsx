import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

interface WeeklyComparisonProps {
  current: number;
  previous: number;
  change: number;
  changePercent: number | null;
}

export function WeeklyComparison({ current, previous, change, changePercent }: WeeklyComparisonProps) {
  const max = Math.max(current, previous, 1);
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
  const label =
    changePercent === null
      ? current > 0 ? 'New activity' : 'No change'
      : `${change > 0 ? '+' : ''}${changePercent}%`;

  const bars = [
    { name: 'Last 7 days (incl. today)', value: current, className: 'bg-primary' },
    { name: 'Previous 7 days', value: previous, className: 'bg-secondary-600' },
  ];

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-neutral-500">Entries added</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{current} <span className="text-base font-normal text-neutral-500">vs {previous} the week before</span></p>
        </div>
        <Badge tone={trend === 'up' ? 'success' : trend === 'down' ? 'danger' : 'neutral'} className="gap-1">
          {trend !== 'flat' && <Icon name={trend === 'up' ? 'arrowUp' : 'arrowDown'} className="size-3" />}
          {label}
        </Badge>
      </div>
      <div className="mt-5 space-y-3">
        {bars.map((bar) => (
          <div key={bar.name}>
            <div className="mb-1 flex justify-between text-xs text-neutral-600">
              <span>{bar.name}</span>
              <span className="font-medium">{bar.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
              <div className={`h-full rounded-full ${bar.className}`} style={{ width: `${(bar.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}