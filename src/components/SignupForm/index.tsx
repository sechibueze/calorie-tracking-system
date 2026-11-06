'use client';

import { useRouter } from 'next/navigation';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { siteConfig } from '@/config/site';
import { authApi } from '@/features/auth/auth.api';
import { useAuthStore } from '@/features/auth/auth.store';
import { useForm } from '@/hooks/useForm';
import { signupSchema } from '@/features/auth/auth.schema';

export function SignupForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm(signupSchema, { name: '', email: '', password: '', confirmPassword: '' });

  const onSubmit = form.handleSubmit(async (details) => {
    setSession(await authApi.signup(details));
    router.replace(siteConfig.routes.dashboard);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {form.formError && <Alert tone="error">{form.formError}</Alert>}
      <TextField label="Full name" autoComplete="name" placeholder="Ada Okafor" {...form.field('name')} />
      <TextField label="Email" type="email" autoComplete="email" placeholder="you@example.com" {...form.field('email')} />
      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters with upper and lower case letters and a number."
        {...form.field('password')}
      />
      <TextField label="Confirm password" type="password" autoComplete="new-password" {...form.field('confirmPassword')} />
      <Button type="submit" fullWidth loading={form.isSubmitting}>
        Create account
      </Button>
    </form>
  );
}