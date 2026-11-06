import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

const tones = {
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-primary-200 bg-primary-50 text-primary-800',
  info: 'border-neutral-200 bg-neutral-50 text-neutral-700',
} as const;

export function Alert({ tone = 'info', children, className }: { tone?: keyof typeof tones; children: ReactNode; className?: string }) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('rounded-lg border px-4 py-3 text-sm', tones[tone], className)}>
      {children}
    </div>
  );
}