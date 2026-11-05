import type { ErrorRequestHandler } from 'express';

import { env } from '@/config/env';
import { logger } from '@/config/logger';
import { HttpError, InternalServerError } from '@/utils/http-error.util';

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  _next,
) => {
  const httpError =
    error instanceof HttpError
      ? error
      : new InternalServerError();

  const statusCode = httpError.statusCode;

  // Log unexpected errors with their original stack.
  if (!(error instanceof HttpError) || !httpError.isOperational) {
    logger.error('Unexpected application error', {
      method: req.method,
      url: req.originalUrl,
      error: error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error,
    });
  } else {
    logger.warn('Request failed', {
      method: req.method,
      url: req.originalUrl,
      statusCode,
      code: httpError.code,
      message: httpError.message,
    });
  }

  if (res.headersSent) {
    return;
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: httpError.message,
      code: httpError.code,
      ...(httpError.details !== undefined && {
        details: httpError.details,
      }),
      ...(env.NODE_ENV !== 'production' && {
        stack: error instanceof Error ? error.stack : undefined,
      }),
    },
  });
};