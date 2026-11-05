export type ErrorDetails =
  | Array<{ field?: string; message: string; code?: string }>
  | Record<string, unknown>;


export class HttpError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details?: ErrorDetails,
    public readonly isOperational = true,
  ) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, new.target);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad request', details?: ErrorDetails) {
    super(message, 400, 'BAD_REQUEST',  details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 403, 'FORBIDDEN', );
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND', );
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Resource conflict', details?: ErrorDetails) {
    super(message, 409, 'CONFLICT',  details);
  }
}

export class PayloadTooLargeError extends HttpError {
  constructor(message = 'Payload too large') {
    super(message, 413, 'PAYLOAD_TOO_LARGE', );
  }
}

export class ValidationError extends HttpError {
  constructor(message = 'Validation failed', details?: ErrorDetails) {
    super(message, 422, 'VALIDATION_ERROR',  details);
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(
    message = 'Too many requests',
    public readonly retryAfterSeconds?: number,
  ) {
    super(message, 429, 'TOO_MANY_REQUESTS');
  }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Internal server error') {
    super(message, 500, 'INTERNAL_SERVER_ERROR',  undefined, false);
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(message = 'Service temporarily unavailable', details?: ErrorDetails) {
    super(message, 503, 'SERVICE_UNAVAILABLE',  details);
  }
}