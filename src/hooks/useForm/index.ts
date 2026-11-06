'use client';

import { type ChangeEvent, type FormEvent, useCallback, useState } from 'react';
import type { z } from 'zod';
import { ApiError } from '@/lib/api-error';

type Errors<T> = Partial<Record<keyof T, string>>;

export function useForm<TValues extends Record<string, string>, TOutput>(
  schema: z.ZodType<TOutput, TValues>,
  initialValues: TValues,
) {
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<Errors<TValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const validate = useCallback(
    (candidate: TValues) => {
      const result = schema.safeParse(candidate);
      const found: Errors<TValues> = {};
      if (!result.success) {
        for (const issue of result.error.issues) {
          const key = issue.path[0] as keyof TValues | undefined;
          if (key !== undefined && !found[key]) found[key] = issue.message;
        }
      }
      return { data: result.success ? result.data : null, found };
    },
    [schema],
  );

  const field = <K extends keyof TValues & string>(name: K) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [name]: event.target.value }));
      setErrors((current) => ({ ...current, [name]: '' }));
    },
    onBlur: () => {
      const { found } = validate(values);
      setErrors((current) => ({ ...current, [name]: found[name] }));
    },
  });

  const showServerError = (err: unknown) => {
    if (err instanceof ApiError) {
      const fieldErrors = err.fieldErrors as Errors<TValues>;
      setErrors((current) => ({ ...current, ...fieldErrors }));
      if (Object.keys(fieldErrors).length === 0) setFormError(err.message);
    } else {
      setFormError('Something went wrong. Please try again.');
    }
  };

  const handleSubmit =
    (onValid: (data: TOutput) => Promise<void>) => async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFormError(null);
      const { data, found } = validate(values);
      setErrors(found);
      if (!data) return;

      setSubmitting(true);
      try {
        await onValid(data);
      } catch (err) {
        showServerError(err);
      } finally {
        setSubmitting(false);
      }
    };

  return { values, errors, formError, isSubmitting, field, handleSubmit };
}