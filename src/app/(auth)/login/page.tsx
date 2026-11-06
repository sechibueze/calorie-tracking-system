import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { AuthCard } from '@/components/layout/AuthCard';
import { LoginForm } from '@/components/LoginForm';

export const metadata: Metadata = { title: 'Log in' };

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to see today's meals and your daily total."
      footer={
        <>
          New here?{' '}
          <Link href={siteConfig.routes.signup} className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}