'use client';

import { useCallback, useMemo, useState } from 'react';
import { hasErrors, type FieldError } from '@/lib/validation';

export function useFieldValidation<T extends string>(
  validators: Record<T, () => FieldError>
) {
  const [touched, setTouched] = useState<Partial<Record<T, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<T, string>>>({});

  const touch = useCallback((field: T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const validateField = useCallback(
    (field: T) => {
      const error = validators[field]?.();
      setErrors((prev) => ({ ...prev, [field]: error }));
      return !error;
    },
    [validators]
  );

  const validateAll = useCallback(
    (fields: T[]) => {
      const next: Partial<Record<T, string>> = {};
      for (const field of fields) {
        const error = validators[field]?.();
        if (error) next[field] = error;
      }
      setErrors(next);
      setTouched(
        fields.reduce((acc, f) => ({ ...acc, [f]: true }), {} as Partial<Record<T, boolean>>)
      );
      return !hasErrors(next);
    },
    [validators]
  );

  const blurValidate = useCallback(
    (field: T) => {
      touch(field);
      validateField(field);
    },
    [touch, validateField]
  );

  const isValid = useMemo(() => {
    const draft: Record<string, FieldError> = {};
    for (const key of Object.keys(validators) as T[]) {
      draft[key] = validators[key]();
    }
    return !hasErrors(draft);
  }, [validators]);

  const clearFieldError = useCallback((field: T) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  return {
    touched,
    errors,
    touch,
    blurValidate,
    validateField,
    validateAll,
    isValid,
    clearFieldError,
    setErrors,
  };
}
