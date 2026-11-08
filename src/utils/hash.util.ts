import { createHash, randomBytes } from 'node:crypto';
import argon2 from 'argon2';

export const hashToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex')

export const generateAccessToken = (): string => {
  return randomBytes(32).toString('base64url');
};

export const hashAccessToken = (token: string): string => {
  return createHash('sha256')
    .update(token)
    .digest('hex');
};


export const hashPassword = async (
  password: string,
): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id,
  });
};

export const verifyPassword = async (
  hashedPassword: string,
  password: string,
): Promise<boolean> => {
  return argon2.verify(hashedPassword, password);
};
