'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { siteConfig } from '@/config/site';
import { useAuthStore } from '@/features/auth/auth.store';
import { useClickOutside } from '@/hooks/useClickOutside';

export function UserMenu() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  if (!user) return null;

  const signOut = () => {
    clearSession();
    router.replace(siteConfig.routes.login);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-neutral-100"
      >
        <Avatar name={user.name} size="sm" />
        <span className="hidden text-sm font-medium sm:block">{user.name}</span>
        <Icon name="chevron" className="size-4 text-neutral-400" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-neutral-500">{user.email}</p>
            <Badge tone="success" className="mt-2">{user.role}</Badge>
          </div>
          <div className="my-1 border-t border-neutral-100" />
          <Link role="menuitem" href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-neutral-100">
            <Icon name="user" className="size-4" /> Profile
          </Link>
          <button role="menuitem" type="button" onClick={signOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
            <Icon name="logout" className="size-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}