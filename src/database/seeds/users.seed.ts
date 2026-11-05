import { env } from '@/config/env';
import type { PrismaClient } from '@/database/generated/prisma/client';
import { hashToken } from '@/utils/hash.util';

const SEED_TOKEN_NAME = 'seed';


export const SEED_USERS = [
  {
    email: 'admin@calorie.test',
    name: 'Ada Admin',
    role: 'ADMIN',
    dailyCalorieLimit: 2100,
    password: env.SEED_ADMIN_TOKEN ,
  },
  {
    email: 'alice@calorie.test',
    name: 'Alice Adeyemi',
    role: 'USER',
    dailyCalorieLimit: 2100,
    password: env.SEED_ADMIN_TOKEN ,
  },
  {
    email: 'bob@calorie.test',
    name: 'Bob Okafor',
    role: 'USER',
    dailyCalorieLimit: 1800,
    password: env.SEED_ADMIN_TOKEN ,
  },
] as const;

export async function seedUsers(db: PrismaClient): Promise<void> {
  for (const seed of SEED_USERS) {
    const role = await db.role.findUniqueOrThrow({ where: { name: seed.role } });
    const user = await db.user.upsert({
      where: { email: seed.email },
      update: { name: seed.name, roleId: role.id, dailyCalorieLimit: seed.dailyCalorieLimit, deletedAt: null },
      create: {
        email: seed.email,
        name: seed.name,
        password: hashToken(seed.password),
        roleId: role.id,
        dailyCalorieLimit: seed.dailyCalorieLimit,
      },
    });
    await db.$transaction([
      db.accessToken.deleteMany({ where: { userId: user.id, name: SEED_TOKEN_NAME } }),
      db.accessToken.create({
        data: { userId: user.id, name: SEED_TOKEN_NAME, tokenHash: hashToken(seed.password) },
      }),
    ]);
  }
}