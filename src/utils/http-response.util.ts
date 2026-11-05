import type { Response } from 'express';
import type { ErrorDetails } from '@/utils/http-error.util';

export interface SuccessEnvelope<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
  correlationId?: string;
}

export interface ErrorEnvelope {
  success: false;
  error: { code: string; message: string; details?: ErrorDetails };
  correlationId?: string;
}

export const successBody = <T>(data: T, meta?: Record<string, unknown>): SuccessEnvelope<T> => ({
  success: true,
  data,
  ...(meta ? { meta } : {}),
});

export const errorBody = (
  code: string,
  message: string,
  details?: ErrorDetails,
): ErrorEnvelope => ({
  success: false,
  error: { code, message, ...(details ? { details } : {}) },
  correlationId: getCorrelationId(),
});

export const sendSuccess = <T>(
  res: Response,
  data: T,
  options: { status?: number; meta?: Record<string, unknown> } = {},
): Response => res.status(options.status ?? 200).json(successBody(data, options.meta));