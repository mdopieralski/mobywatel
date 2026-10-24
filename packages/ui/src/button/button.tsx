import type { ComponentPropsWithRef, ReactNode } from 'react';

import styles from './button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], fullWidth ? styles.fullWidth : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return <button type={type} className={classes} {...rest} />;
}
