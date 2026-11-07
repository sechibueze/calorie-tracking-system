'use client';

import type { ReactNode } from 'react';
import { Alert } from '@/components/ui/Alert';
import { useAuthStore } from '@/features/auth/auth.store';

export function RequirePermission({ permission, children }: { permission: string; children: ReactNode }) {
  const allowed = useAuthStore((s) => s.user?.permissions.includes(permission) ?? false);
  if (!allowed) return <Alert tone="error">You do not have access to this page.</Alert>;
  return <>{children}</>;
}