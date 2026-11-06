'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { siteConfig } from '@/config/site';
import { useAuthStore } from '@/features/auth/auth.store';

export function useRedirectIfAuthenticated(): void {
  const router = useRouter();
  const { token, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && token) router.replace(siteConfig.routes.dashboard);
  }, [hasHydrated, token, router]);
}