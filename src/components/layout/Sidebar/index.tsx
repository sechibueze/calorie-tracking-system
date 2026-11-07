'use client';

import { Logo } from '@/components/ui/Logo';
import { navigation } from '@/config/navigation';
import { useAuthStore } from '@/features/auth/auth.store';
import { cn } from '@/utils/cn';
import { NavItem } from '@/components/layout/NavItem';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}
const EMPTY_PERMISSIONS: string[] = [];

/** Fixed on large screens, a slide-in drawer on small ones. Admin links only for admins. */
export function Sidebar({ open, onClose }: SidebarProps) {
  const permissions = useAuthStore((s) => s.user?.permissions ?? EMPTY_PERMISSIONS);
  const items = navigation.filter((item) => !item.permission || permissions.includes(item.permission));
  const sections = [...new Set(items.map((i) => i.section ?? ''))];

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-neutral-900/40 lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside
        aria-label="Sidebar"
        data-open={open}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-neutral-200 bg-white transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center border-b border-neutral-100 px-5">
          <Logo />
        </div>
        <nav aria-label="Main" className="flex-1 space-y-6 overflow-y-auto p-4">
          {sections.map((section) => (
            <div key={section || 'main'} className="space-y-1">
              {section && <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">{section}</p>}
              {items.filter((i) => (i.section ?? '') === section).map((item) => (
                <NavItem key={item.href} {...item} onNavigate={onClose} />
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}