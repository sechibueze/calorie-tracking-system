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


export const createAccessToken = (
  data: {
    userId: string;
    name: string;
    tokenHash: string;
    expiresAt: Date;
  },
) => {
  return db.accessToken.create({
    data,
    select: {
      id: true,
      name: true,
      expiresAt: true,
      createdAt: true,
    },
  });
};

export const findActiveAccessToken = (
  tokenHash: string,
) => {
  return db.accessToken.findFirst({
    where: {
      tokenHash,
      deletedAt: null,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
      user: {
        deletedAt: null,
        role: {
          deletedAt: null,
        },
      },
    },
    select: {
      id: true,
      userId: true,
    },
  });
};


export const revokeAccessToken = (
  id: string,
) => {
  return db.accessToken.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};