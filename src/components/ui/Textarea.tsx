import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-brand-text-secondary">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-brand-text-muted outline-none transition-all resize-none',
            'focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30',
            error && 'border-red-500/50',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
