import type { PrismaClient } from '@/database/generated/prisma/client';

const MEALS = [
  { name: 'Oatmeal with banana', calories: 350, hour: 8 },
  { name: 'Jollof rice and chicken', calories: 750, hour: 13 },
  { name: 'Apple', calories: 95, hour: 16 },
  { name: 'Grilled fish with plantain', calories: 620, hour: 19 },
];
const HEAVY_EXTRAS = [
  { name: 'Pizza (3 slices)', calories: 900, hour: 21 },
  { name: 'Soda', calories: 150, hour: 22 },
];
const DEMO_USERS = [
  { email: 'eben@calorie.com', skip: [] as string[] },
  { email: 'admin@calorie.com', skip: ['Apple'] }, // Bob's limit is 1800, so a normal day stays under
];
const DAYS = 14;

export async function seedEntries(db: PrismaClient): Promise<void> {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (const demo of DEMO_USERS) {
    const user = await db.user.findFirst({ where: { email: demo.email, deletedAt: null } });
    if (!user) continue;

    const rows = [];
    for (let offset = 0; offset < DAYS; offset++) {
      const meals = [...MEALS.filter((m) => !demo.skip.includes(m.name)), ...(offset % 5 === 2 ? HEAVY_EXTRAS : [])];
      for (const meal of meals) {
        const consumedAt = new Date(today.getTime() - offset * 86_400_000 + meal.hour * 3_600_000);
        if (consumedAt.getTime() > Date.now()) continue;
        rows.push({ userId: user.id, name: meal.name, calories: meal.calories, consumedAt, createdAt: consumedAt });
      }
    }
    await db.foodEntry.deleteMany({ where: { userId: user.id } });
    await db.foodEntry.createMany({ data: rows });
  }
}