import type { IconName } from '@/components/ui/Icon';

export interface NavItemConfig {
  label: string;
  href: string;
  icon: IconName;
  /** Only shown to users holding this permission. */
  permission?: string;
  section?: string;
}

export const navigation: NavItemConfig[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'home' },
  { label: 'Food Entries', href: '/entries', icon: 'list' },
  { label: 'Profile', href: '/profile', icon: 'user' },
  { label: 'All Entries', href: '/admin/entries', icon: 'shield', permission: 'ADMIN', section: 'Admin' },
  { label: 'Reports', href: '/admin/reports', icon: 'chart', permission: 'ADMIN', section: 'Admin' },
];