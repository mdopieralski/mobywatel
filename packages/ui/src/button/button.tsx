import type { ComponentPropsWithRef, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: ReactNode;
}

/* Sizes follow --target-min (48 px, 56 px in senior mode). The focus ring comes from the base layer (global.css). */
const base =
  'inline-flex items-center justify-center gap-2 min-h-target min-w-target py-3 px-5 border-2 rounded-md ' +
  '[font-family:inherit] [font-style:inherit] text-md font-semibold leading-tight cursor-pointer ' +
  '[transition:background-color_var(--duration-fast)_var(--easing-standard)] disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-text border-transparent',
  secondary: 'bg-surface text-accent border-accent',
  ghost: 'bg-transparent text-accent border-transparent',
  danger: 'bg-surface text-danger border-danger',
};

export function Button({
  variant = 'primary',
  fullWidth = false,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [base, variants[variant], fullWidth ? 'w-full' : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return <button type={type} className={classes} {...rest} />;
}
