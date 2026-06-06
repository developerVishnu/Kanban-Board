import type { SelectHTMLAttributes } from 'react';
import { FieldWrapper } from './FieldWrapper';
import styles from './Field.module.scss';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: readonly SelectOption[];
  error?: string;
}

/** Labelled native select with validation styling. */
export function Select({
  id,
  label,
  options,
  error,
  required,
  className,
  ...rest
}: SelectProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} required={required} error={error}>
      <select
        id={id}
        className={`${styles.control} ${styles.select} ${
          error ? styles.invalid : ''
        } ${className ?? ''}`}
        aria-invalid={Boolean(error)}
        required={required}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
