import { logger } from "@/config/logger";
import { createAccessToken, findActiveTokenByHash, touchLastUsed } from "@/repositories/access-token.repository";
import { AuthContext, LoginInput } from "@/schema/auth.schema";
import { generateAccessToken, hashAccessToken, hashToken, verifyPassword } from "@/utils/hash.util";
import * as userRepository from '@/repositories/user.repository'
import { NotFoundError, UnauthorizedError } from "@/utils/http-error.util";
const LAST_USED_REFRESH_MS = 5 * 60_000;


export const loginUser = async (
  input: LoginInput,
) => {
  const user = await userRepository.getUserByEmail(input.email);

  if (!user) {
    throw new NotFoundError('Invalid email or password.');
  }

  const passwordIsValid = await verifyPassword(
    user.password,
    input.password,
  );

  if (!passwordIsValid) {
    throw new UnauthorizedError('Invalid email or password.', 401);
  }

  const token = generateAccessToken();
  const tokenHash = hashAccessToken(token);

  const expiresAt = new Date();

  expiresAt.setDate(
    expiresAt.getDate() + 2,
  );

  await createAccessToken( {
    userId: user.id,
    name: input.deviceName ?? 'Unknown device',
    tokenHash,
    expiresAt,
  });

  const { password: _, ...userDetails } = user;

  return {
    user: userDetails,
    token,
    tokenType: 'Bearer',
    expiresAt,
  };
};

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