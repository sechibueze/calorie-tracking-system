import type { ApiErrorBody } from '@/types/api';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details: NonNullable<ApiErrorBody['error']['details']> = [],
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get fieldErrors(): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const detail of this.details) {
      const field = detail.field?.split('.').slice(1).join('.');
      if (field && !errors[field]) errors[field] = detail.message;
    }
    return errors;
  }
}