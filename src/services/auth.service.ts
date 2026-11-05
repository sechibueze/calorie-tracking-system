import { logger } from "@/config/logger";
import { findActiveTokenByHash, touchLastUsed } from "@/repositories/access-token.repository";
import { AuthContext } from "@/schema/auth.schema";
import { hashToken } from "@/utils/hash.util";

const LAST_USED_REFRESH_MS = 5 * 60_000;

export async function authenticateToken(
  rawToken: string,
): Promise<AuthContext | null> {
  const record = await findActiveTokenByHash(hashToken(rawToken));

  if (!record) return null;

  const stale =
    !record.lastUsedAt ||
    Date.now() - record.lastUsedAt.getTime() > LAST_USED_REFRESH_MS;

  if (stale) {
    touchLastUsed(record.id).catch((err: unknown) =>
      logger.warn('Failed to update token lastUsedAt', {
        err,
        tokenId: record.id,
      }),
    );
  }

  const { role, ...user } = record.user;

  return {
    user,
    role: role.name,
    permissions: role.permissions.map(
      (rp) => rp.permission.name,
    ),
    tokenId: record.id,
  };
}

export const describeCaller = (auth: AuthContext) => ({
  id: auth.user.id,
  email: auth.user.email,
  name: auth.user.name,
  dailyCalorieLimit: auth.user.dailyCalorieLimit,
  role: auth.role,
  permissions: [...auth.permissions].sort(),
});