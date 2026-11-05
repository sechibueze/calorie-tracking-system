import { db } from "@/database/db";

export const findActiveTokenByHash = (tokenHash: string) =>
  db.accessToken.findFirst({
    where: {
      tokenHash,
      deletedAt: null,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
      user: {
        is: {
          deletedAt: null,
          role: {
            is: {
              deletedAt: null,
            },
          },
        },
      },
    },
    select: {
      id: true,
      lastUsedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          dailyCalorieLimit: true,
          role: {
            select: {
              name: true,
              permissions: {
                where: {
                  deletedAt: null,
                  permission: {
                    is: {
                      deletedAt: null,
                    },
                  },
                },
                select: {
                  permission: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

export const touchLastUsed = (id: string) =>
  db.accessToken.update({ where: { id }, data: { lastUsedAt: new Date() } });