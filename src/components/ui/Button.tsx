import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants = {
  primary: 'bg-brand-primary hover:bg-brand-primary-hover text-white border-transparent btn-glow',
  secondary: 'bg-brand-secondary/20 hover:bg-brand-secondary/30 text-brand-secondary border-brand-secondary/30',
  ghost: 'bg-transparent hover:bg-white/5 text-brand-text-secondary hover:text-white border-transparent',
  outline: 'bg-transparent hover:bg-brand-elevated text-brand-text-secondary hover:text-white border-brand-border hover:border-brand-primary/50',
  danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30',
  gold: 'bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold border-brand-gold/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
