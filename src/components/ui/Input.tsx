import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-brand-text-secondary">{label}</label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-brand-text-muted">{leftIcon}</div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-brand-text-muted outline-none transition-all',
              'focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500/50',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-brand-text-muted">{rightIcon}</div>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
