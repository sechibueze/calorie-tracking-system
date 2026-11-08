import { MarketingNavbar } from '@/components/layout/MarketingNavbar';
import type { ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingNavbar />
      <main>{children}</main>
    </>
  );
}