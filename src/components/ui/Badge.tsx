import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

const tones = {
  neutral: 'bg-neutral-100 text-neutral-700',
  success: 'bg-primary-100 text-primary-800',
  warning: 'bg-secondary text-neutral-900',
  danger: 'bg-red-100 text-red-700',
} as const;

export function Badge({ tone = 'neutral', children, className }: { tone?: keyof typeof tones; children: ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone], className)}>{children}</span>;
}