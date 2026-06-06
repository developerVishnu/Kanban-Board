import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.scss';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Optional leading icon / glyph. */
  iconLeft?: ReactNode;
  fullWidth?: boolean;
}

/**
 * Reusable button with a small set of visual variants. Forwards all
 * native button props so it can be used anywhere a `<button>` would.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  fullWidth = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...rest}>
      {iconLeft && <span className={styles.icon}>{iconLeft}</span>}
      {children}
    </button>
  );
}
