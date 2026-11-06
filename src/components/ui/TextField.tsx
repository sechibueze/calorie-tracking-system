'use client';

import { type ReactNode, forwardRef, useId } from 'react';
import { Input, type InputProps } from './Input';
import { cn } from '@/utils/cn';

export interface TextFieldProps extends Omit<InputProps, 'invalid'> {
  label: string;
  error?: string;
  hint?: string;
  /** Rendered opposite the label, e.g. a "Forgot password?" link. */
  labelAction?: ReactNode;
}

/** Label + Input + hint/error message */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, labelAction, required, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-800">
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </label>
        {labelAction}
      </div>
      <Input
        ref={ref}
        id={inputId}
        required={required}
        invalid={Boolean(error)}
        aria-describedby={error || hint ? messageId : undefined}
        {...props}
      />
      {(error || hint) && (
        <p id={messageId} role={error ? 'alert' : undefined} className={cn('text-xs', error ? 'text-red-600' : 'text-neutral-500')}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
});