import * as React from 'react';
import { cn } from '@/lib/utils';

const variantClasses = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
  ghost: 'bg-transparent text-foreground hover:bg-secondary/60',
  outline:
    'bg-transparent border border-border text-foreground hover:bg-secondary/50',
  success: 'bg-success text-success-foreground shadow-sm',
  destructive: 'bg-destructive text-destructive-foreground shadow-sm',
} as const;

const sizeClasses = {
  default: 'h-11 px-5 text-sm',
  sm: 'h-9 px-3 text-sm',
  lg: 'h-14 px-6 text-base',
  icon: 'h-11 w-11',
} as const;

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'default', size = 'default', disabled, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-wide transition-all duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
