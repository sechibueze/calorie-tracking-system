'use client';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAuthStore } from '@/features/auth/auth.store';
import { formatKcal, humanizePermission } from '@/utils/format.util';

export function ProfileView() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  const details: Array<[string, string]> = [
    ['Email', user.email],
    ['Daily calorie limit', formatKcal(user.dailyCalorieLimit)],
    ['User ID', user.id],
  ];

  return (
    <>
      <PageHeader title="Profile" description="Your account details." />
      <Card className="p-6">
        <div className="flex items-center gap-5">
          <Avatar name={user.name} size="lg" />
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <Badge tone="success" className="mt-1">{user.role.name}</Badge>
          </div>
        </div>
        <dl className="mt-8 divide-y divide-neutral-100 text-sm">
          {details.map(([term, value]) => (
            <div key={term} className="grid gap-1 py-3 sm:grid-cols-3">
              <dt className="text-neutral-500">{term}</dt>
              <dd className="font-medium break-all sm:col-span-2">{value}</dd>
            </div>
          ))}
          <div className="grid gap-1 py-3 sm:grid-cols-3">
            <dt className="text-neutral-500">Access</dt>
            <dd className="flex flex-wrap gap-2 sm:col-span-2">
              {/* {[...user.permissions].sort().map((p) => ( */}
                <Badge >{user.role.name}</Badge>
              {/* // ))} */}
            </dd>
          </div>
        </dl>
      </Card>
    </>
  );
}