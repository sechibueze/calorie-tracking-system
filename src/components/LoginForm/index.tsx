'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { siteConfig } from '@/config/site';
import { authApi } from '@/features/auth/auth.api';
import { useAuthStore } from '@/features/auth/auth.store';
import { loginSchema } from '@/features/auth/auth.schema';
import { useForm } from '@/hooks/useForm';

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm(loginSchema, { email: '', password: '' });

  const onSubmit = form.handleSubmit(async (credentials) => {
    console.log('Login details', credentials)
    setSession(await authApi.login(credentials));
    router.replace(siteConfig.routes.dashboard);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {form.formError && <Alert tone="error">{form.formError}</Alert>}
      <TextField label="Email" type="email" autoComplete="email" placeholder="you@example.com" {...form.field('email')} />
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Your password"
        labelAction={
          <Link href={siteConfig.routes.forgotPassword} className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        }
        {...form.field('password')}
      />
      <Button type="submit" fullWidth loading={form.isSubmitting}>
        Log in
      </Button>
    </form>
  );
}