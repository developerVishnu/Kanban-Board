import type { ReactNode } from 'react';
import styles from './Field.module.scss';

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

/**
 * Shared label + error layout for form controls. Keeps the markup
 * for accessibility (label association, error text) in one place so
 * every field type renders consistently.
 */
export function FieldWrapper({
  label,
  htmlFor,
  required,
  error,
  children,
}: FieldWrapperProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
