export const formatKcal = (n: number): string => `${n.toLocaleString()} kcal`;

export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('') || '?';

export const humanizePermission = (permission: string): string => permission.replace(/[:_]/g, ' ');