import { MarketingNavbar } from '@/components/layout/Navbar';
import type { ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingNavbar />
      <main>{children}</main>
    </>
  );
}