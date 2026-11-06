import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { AuthCard } from '@/components/layout/AuthCard';
import { SignupForm } from '@/components/SignupForm';

export const metadata: Metadata = { title: 'Sign up' };

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Start logging meals and keep an eye on your daily limit."
      footer={
        <>
          Already have an account?{' '}
          <Link href={siteConfig.routes.login} className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}