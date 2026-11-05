import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '@/config/env';
import { PrismaClient } from './generated/prisma/client';

export const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
});

export async function disconnectDB(): Promise<void> {
  await db.$disconnect();
}