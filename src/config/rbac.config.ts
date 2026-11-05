export const ROLES = { ADMIN: 'ADMIN', USER: 'USER' } as const;
export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  ENTRIES_READ_OWN: 'entries:read:own',
  ENTRIES_WRITE_OWN: 'entries:write:own',
  ENTRIES_READ_ALL: 'entries:read:all',
  ENTRIES_WRITE_ALL: 'entries:write:all',
  REPORTS_READ: 'reports:read',
  USERS_READ: 'users:read',
  AUTOCOMPLETE_READ: 'autocomplete:read',
} as const;
export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_DESCRIPTIONS: Record<PermissionName, string> = {
  'entries:read:own': 'Read your own food entries',
  'entries:write:own': 'Create, update and delete your own food entries',
  'entries:read:all': 'Read food entries of every user',
  'entries:write:all': 'Create, update and delete food entries of every user',
  'reports:read': 'View the admin reports',
  'users:read': 'List users',
  'autocomplete:read': 'Use food name/calorie autocomplete',
};

export const ROLE_DESCRIPTIONS: Record<RoleName, string> = {
  ADMIN: 'Manages all users and food entries and can view reports',
  USER: 'Tracks their own food entries',
};

export const ROLE_PERMISSIONS: Record<RoleName, PermissionName[]> = {
  USER: [
    PERMISSIONS.ENTRIES_READ_OWN,
    PERMISSIONS.ENTRIES_WRITE_OWN,
    PERMISSIONS.AUTOCOMPLETE_READ,
  ],
  ADMIN: Object.values(PERMISSIONS),
};