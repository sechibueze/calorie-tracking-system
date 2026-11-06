'use client';

import { cn } from '@/utils/cn';
import { type InputHTMLAttributes, type ReactNode, forwardRef, useState } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  /** Shown inside the field, on the left (e.g. an icon). */
  leftElement?: ReactNode;
  /** Shown inside the field, on the right. Password inputs get a show/hide toggle automatically. */
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, leftElement, rightElement, className, type = 'text', ...props },
  ref,
) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative">
      {leftElement && (
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
          {leftElement}
        </span>
      )}
      <input
        ref={ref}
        type={isPassword && revealed ? 'text' : type}
        aria-invalid={invalid || undefined}
        className={cn(
          'h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400',
          'transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-100',
          invalid
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'border-neutral-300 focus:border-primary focus:ring-primary-200',
          leftElement && 'pl-10',
          (rightElement || isPassword) && 'pr-11',
          className,
        )}
        {...props}
      />
      {isPassword ? (
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          aria-label={revealed ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral-500 hover:text-neutral-800"
        >
          {revealed ? 'Hide' : 'Show'}
        </button>
      ) : (
        rightElement && <span className="absolute inset-y-0 right-3 flex items-center">{rightElement}</span>
      )}
    </div>
  );
});