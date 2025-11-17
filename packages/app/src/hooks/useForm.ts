/**
 * useForm Hook
 * Generic form state management with validation
 * Handles form values, errors, touched fields, and submission
 */

import { useState, useCallback, ChangeEvent } from 'react';

/**
 * Validation schema type
 */
export type ValidationSchema<T> = {
  [K in keyof T]?: (value: T[K]) => string | undefined;
};

/**
 * useForm Hook
 * @param initialValues - Initial form values
 * @param validationSchema - Optional validation rules
 * @returns Form state and handlers
 */
export function useForm<T extends Record<string, string | number | boolean | string[] | undefined>>(
  initialValues: T,
  validationSchema?: ValidationSchema<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>(
    {}
  );
  const [isDirty, setIsDirty] = useState<boolean>(false);

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (name: keyof T, value: unknown): string | undefined => {
      if (validationSchema && validationSchema[name]) {
        const validator = validationSchema[name];
        return validator ? validator(value as T[keyof T]) : undefined;
      }
      return undefined;
    },
    [validationSchema]
  );

  /**
   * Validate all fields
   */
  const validateForm = useCallback((): boolean => {
    if (!validationSchema) return true;

    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationSchema).forEach((key) => {
      const fieldKey = key as keyof T;
      const error = validateField(fieldKey, values[fieldKey]);
      if (error) {
        newErrors[fieldKey] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationSchema, validateField, values]);

  /**
   * Handle input change
   */
  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      setIsDirty(true);

      // Clear error when user starts typing
      if (errors[name as keyof T]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name as keyof T];
          return newErrors;
        });
      }
    },
    [errors]
  );

  /**
   * Handle field blur - trigger validation
   */
  const handleBlur = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate field on blur
      const error = validateField(name as keyof T, value);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validateField]
  );

  /**
   * Set a specific field value programmatically
   */
  const setFieldValue = useCallback((name: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  }, []);

  /**
   * Set a specific field error programmatically
   */
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void | Promise<void>) => {
      return async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        );
        setTouched(allTouched);

        // Validate form
        const isValid = validateForm();

        if (isValid) {
          await onSubmit(values);
        }
      };
    },
    [values, validateForm]
  );

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    validateForm,
  };
}
