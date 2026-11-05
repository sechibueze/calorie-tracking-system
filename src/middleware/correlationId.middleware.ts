import { randomUUID } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const uuidSchema = z.uuid();

export function correlationIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const correlationId = req.headers['x-correlation-id'];

  const result = uuidSchema.safeParse(correlationId);

  req.correlationId = result.success ? result.data : randomUUID();

  res.setHeader('x-correlation-id', req.correlationId);

  next();
}