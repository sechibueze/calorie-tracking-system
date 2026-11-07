import type { ReactNode } from 'react';
import { Card } from './Card';

export function StatCard({ label, value, hint, children }: { label: string; value: ReactNode; hint?: ReactNode; children?: ReactNode }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      {children && <div className="mt-3">{children}</div>}
      {hint && <p className="mt-2 text-xs text-neutral-500">{hint}</p>}
    </Card>
  );
}