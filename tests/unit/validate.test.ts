import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { validateInput } from '../../src/utils/validate-input.util';

const schema = z.object({
  name: z.string().min(1),
  calories: z.coerce.number().int().positive(),
});

describe('validateInput', () => {
  it('returns parsed data when input is valid', () => {
    const result = validateInput(schema, {
      name: 'Banana',
      calories: '105',
    });

    expect(result).toEqual({
      success: true,
      data: {
        name: 'Banana',
        calories: 105,
      },
      errors: null,
    });
  });

  it('returns validation errors when input is invalid', () => {
    const result = validateInput(schema, {
      name: '',
      calories: -1,
    });

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.errors).toEqual({
      name: expect.any(String),
      calories: expect.any(String),
    });
  });

  it('returns field-level validation errors', () => {
    const result = validateInput(
      z.object({
        id: z.uuid(),
      }),
      { id: 'nope' },
    );

    expect(result.success).toBe(false);
    expect(result.errors).toHaveProperty('id');
    expect(typeof result.errors?.id).toBe('string');
  });

  it('uses root as the error key for invalid root-level input', () => {
    const result = validateInput(z.string(), 123);

    expect(result.success).toBe(false);
    expect(result.errors).toHaveProperty('root');
  });

  it('keeps only the first error for each field', () => {
    const result = validateInput(
      z.object({
        name: z.string().min(3).max(10),
      }),
      { name: '' },
    );

    expect(result.success).toBe(false);
    expect(Object.keys(result.errors ?? {})).toEqual(['name']);
  });
});