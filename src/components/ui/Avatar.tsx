import { cn } from '@/utils/cn';
import { initials } from '@/utils/format.util';

const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-20 text-2xl' } as const;

/** Round avatar showing the user's initials. */
export function Avatar({ name, size = 'md', className }: { name: string; size?: keyof typeof sizes; className?: string }) {
  return (
    <span
      role="img"
      aria-label={`${name}'s avatar`}
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-white ring-2 ring-secondary', sizes[size], className)}
    >
      {initials(name)}
    </span>
  );
}