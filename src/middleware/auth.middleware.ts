import { authenticateToken } from '@/services/auth.service';
import { UnauthorizedError } from '@/utils/http-error.util';
import type { RequestHandler } from 'express';

const BEARER = /^Bearer\s+(\S+)$/i;

export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const match = BEARER.exec(req.header('authorization') ?? '');
    if (!match?.[1]) throw new UnauthorizedError('Missing or malformed Authorization header');

    const auth = await authenticateToken(match[1]);
    if (!auth) throw new UnauthorizedError('Invalid or expired token');

    req.auth = auth;
    next();
  } catch (err) {
    next(err);
  }
};