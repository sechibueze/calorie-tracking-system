'use client';

import { Icon } from '@/components/ui/Icon';
import { useAuthStore } from '@/features/auth/auth.store';
import { UserMenu } from '@/components/layout/UserMenu';

const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
};

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const name = useAuthStore((s) => s.user?.name.split(' ')[0]);
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenuClick} aria-label="Open menu" className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden">
          <Icon name="menu" />
        </button>
        <p className="hidden text-sm text-neutral-500 sm:block">{greeting()}, <span className="font-medium text-neutral-900">{name}</span></p>
      </div>
      <UserMenu />
    </header>
  );
}