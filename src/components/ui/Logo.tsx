import Link from 'next/link';
import { cn } from '@/utils/cn';
import { siteConfig } from '@/config/site';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href={siteConfig.routes.home} className={cn('inline-flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900', className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-secondary" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
          <path d="M20 4C9 4 4 9 4 16c0 1.2.2 2.3.6 3.4C7 15 10.5 12.5 15 11c-3 2-5.2 4.6-6.5 8.4.5.1 1 .2 1.5.2 7 0 10-5 10-12.4V4Z" />
        </svg>
      </span>
      {siteConfig.name}
    </Link>
  );
}