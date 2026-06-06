import type { TextareaHTMLAttributes } from 'react';
import { FieldWrapper } from './FieldWrapper';
import styles from './Field.module.scss';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
}

/** Labelled multi-line text input with validation styling. */
export function TextArea({
  id,
  label,
  error,
  required,
  className,
  ...rest
}: TextAreaProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} required={required} error={error}>
      <textarea
        id={id}
        className={`${styles.control} ${styles.textarea} ${
          error ? styles.invalid : ''
        } ${className ?? ''}`}
        aria-invalid={Boolean(error)}
        required={required}
        {...rest}
      />
    </FieldWrapper>
  );
}
