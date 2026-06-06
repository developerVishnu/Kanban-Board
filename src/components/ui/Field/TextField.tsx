import type { InputHTMLAttributes } from 'react';
import { FieldWrapper } from './FieldWrapper';
import styles from './Field.module.scss';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

/** Labelled single-line text input with validation styling. */
export function TextField({
  id,
  label,
  error,
  required,
  className,
  ...rest
}: TextFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} required={required} error={error}>
      <input
        id={id}
        className={`${styles.control} ${error ? styles.invalid : ''} ${
          className ?? ''
        }`}
        aria-invalid={Boolean(error)}
        required={required}
        {...rest}
      />
    </FieldWrapper>
  );
}
