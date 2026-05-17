'use client';

import { cn } from '@/lib/utils';

type ValidatedFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function ValidatedField({
  label,
  htmlFor,
  required,
  error,
  touched,
  children,
  className,
}: ValidatedFieldProps) {
  const showError = Boolean(touched && error);

  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-[#2C2C2C]">
        {label}
        {required && <span className="text-[#F283AE]"> *</span>}
      </label>
      {children}
      {showError && (
        <p id={`${htmlFor}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function invalidFieldClass(isInvalid: boolean, baseClass: string): string {
  return cn(
    baseClass,
    isInvalid &&
      'border-red-500 bg-red-50/40 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
  );
}
