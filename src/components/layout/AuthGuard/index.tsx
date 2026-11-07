'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { siteConfig } from '@/config/site';
import { authApi } from '@/features/auth/auth.api';
import { useAuthStore } from '@/features/auth/auth.store';

const FullPage = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-svh items-center justify-center p-6">{children}</div>
);

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { token, user, hasHydrated, setUser, clearSession } = useAuthStore();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace(siteConfig.routes.login);
      return;
    }
    let cancelled = false;
    authApi.me().then(
      (fresh) => !cancelled && setUser(fresh),
      () => !cancelled && setFailed(true),
    );
    return () => {
      cancelled = true;
    };
  }, [hasHydrated, token, router, setUser]);

  console.log({
  hasHydrated, token, user, failed
})
  if (failed && !user) {
    return (
      <FullPage>
        <div className="max-w-sm space-y-4 text-center">
          <Alert tone="error">We could not load your account. Check your connection and try again.</Alert>
          <div className="flex justify-center gap-2">
            <Button onClick={() => window.location.reload()}>Try again</Button>
            <Button variant="outline" onClick={clearSession}>Sign out</Button>
          </div>
        </div>
      </FullPage>
    );
  }

  if ( !token || !user) {
    return (
      <FullPage>
        <Spinner className="size-8 text-primary" />
      </FullPage>
    );
  }

  return <>{children}</>;
}