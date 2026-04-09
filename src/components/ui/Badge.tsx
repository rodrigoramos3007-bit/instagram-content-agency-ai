import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gold';
}

const variants = {
  default: 'bg-white/10 text-white border-white/20',
  primary: 'bg-brand-primary/20 text-brand-primary border-brand-primary/30',
  secondary: 'bg-brand-secondary/20 text-brand-secondary border-brand-secondary/30',
  success: 'bg-brand-success/20 text-brand-success border-brand-success/30',
  warning: 'bg-brand-warning/20 text-brand-warning border-brand-warning/30',
  danger: 'bg-red-500/20 text-red-400 border-red-500/30',
  gold: 'bg-brand-gold/20 text-brand-gold border-brand-gold/30',
};

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
