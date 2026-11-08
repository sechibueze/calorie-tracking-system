import { db } from '@/database/db';
import { Prisma } from '@/database/generated/prisma/client';
import { ConflictError } from '@/utils/http-error.util';

const include = { role: true } satisfies Prisma.UserInclude;
export type UserWithRole = Prisma.UserGetPayload<{ include: typeof include }>;

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  roleId: string;
  dailyCalorieLimit?: number;
}
export type UpdateUserData = Partial<CreateUserData>;


const isPrismaError = (err: unknown, code: string): boolean =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === code;

export const getUserRole = (roleName: string = 'USER') => db.role.findFirst({where: { name: roleName}});
export const getUserById = (id: string): Promise<UserWithRole | null> =>
  db.user.findFirst({ where: { id, deletedAt: null }, include });

export const getUsersByIds = (ids: string[]) =>
  db.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, email: true, name: true },
  });
export const getUserByEmail = (email: string): Promise<UserWithRole | null> =>
  db.user.findFirst({
    where: { email: email.trim().toLowerCase(), deletedAt: null },
    include: { role: true}
  });

export const listUsers = (): Promise<UserWithRole[]> =>
  db.user.findMany({ where: { deletedAt: null }, include, orderBy: { createdAt: 'asc' } });

export async function createUser(data: CreateUserData): Promise<UserWithRole> {
  try {
    return await db.user.create({ data: data, include });
  } catch (err) {
    if (isPrismaError(err, 'P2002')) throw new ConflictError('Email is already in use');
    throw err;
  }
}

export async function updateUser(id: string, data: UpdateUserData): Promise<UserWithRole | null> {
  try {
    return await db.user.update({
      where: { id, deletedAt: null },
      data,
      include,
    });
  } catch (err) {
    if (isPrismaError(err, 'P2025')) return null;
    if (isPrismaError(err, 'P2002')) throw new ConflictError('Email is already in use');
    throw err;
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  const user = await db.user.findFirst({ where: { id, deletedAt: null } });
  if (!user) return false;

  const now = new Date();
  await db.$transaction([
    db.user.update({
      where: { id },
      data: { email: `deleted+${now.getTime()}+${user.email}`, deletedAt: now },
    }),
    db.accessToken.updateMany({
      where: { userId: id, deletedAt: null },
      data: { deletedAt: now },
    }),
  ]);
  return true;
}