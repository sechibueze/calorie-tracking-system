'use client';

import type { ReactNode } from 'react';
import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated';

export default function AuthLayout({ children }: { children: ReactNode }) {
  useRedirectIfAuthenticated();
  return (
    <main className="flex min-h-svh items-center justify-center bg-gradient-to-b from-primary-50 to-white px-4 py-12">
      {children}
    </main>
  );
}