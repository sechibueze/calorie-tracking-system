import type { RequestHandler } from 'express';
import type { PermissionName } from '@/config/rbac.config';
import { ForbiddenError, UnauthorizedError } from '@/utils/http-error.util';

export const requirePermission =
  (...required: PermissionName[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.auth) {
      next(new UnauthorizedError());
      return;
    }
    const missing = required.filter((permission) => !req.auth?.permissions.includes(permission));
    next(missing.length ? new ForbiddenError() : undefined);
  };