'use client';

import { type SelectHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, error, options, placeholder, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={selectId} className="text-sm font-medium text-neutral-800">{label}</label>
      <select
        ref={ref}
        id={selectId}
        aria-invalid={Boolean(error) || undefined}
        className={cn(
          'h-11 w-full rounded-lg border bg-white px-3 text-sm focus:outline-none focus:ring-2',
          error ? 'border-red-500 focus:ring-red-200' : 'border-neutral-300 focus:border-primary focus:ring-primary-200',
        )}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
    </div>
  );
});