import {  ZodType } from 'zod';

type ValidationResult<T> = {
  success: true;
  data: T;
  errors: null;
} | {
  success: false;
  data: null;
  errors: Record<string, string>;
};

export function validateInput<T>(
  schema: ZodType<T>,
  inputData: unknown,
): ValidationResult<T> {
  const result = schema.safeParse(inputData);

  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: null,
    };
  }

  const errors: Record<string, string> = {};

  for (const issue of result.error.issues) {
    const field = issue.path.join('.') || 'root';

    if (!errors[field]) {
      errors[field] = issue.message;
    }
  }

  return {
    success: false,
    data: null,
    errors,
  };
}