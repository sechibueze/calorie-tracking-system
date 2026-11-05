import type { Request, RequestHandler } from 'express';
import type { ZodType, output } from 'zod';
import { validateInput } from '@/utils/validate-input.util';
import { ValidationError } from '@/utils/http-error.util';

export type ValidationTarget = 'body' | 'params' | 'query';

function overrideRequestProp(
  req: Request,
  key: 'query' | 'params' | 'body',
  value: unknown,
): void {
  Object.defineProperty(req, key, {
    value,
    writable: true,
    configurable: true,
    enumerable: true,
  });
}

export const validateRequest = <S extends ZodType>(
  schema: S,
  target: ValidationTarget = 'body',
): RequestHandler =>
  (req: Request, _res, next) => {
    try {
      const result = validateInput(schema, req[target]);

      if (!result.success) {
        throw new ValidationError(
          `Invalid request ${target}`,
          Object.entries(result.errors).map(([field, message]) => ({
            field: field === 'root' ? target : `${target}.${field}`,
            message,
            code: 'INVALID_INPUT',
          })),
        );
      }

      overrideRequestProp(
        req,
        target,
        result.data as output<S>,
      );

      next();
    } catch (error) {
      next(error);
    }
  };