import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export const Select = forwardRef(function Select({ label, error, className, id, children, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          'h-11 rounded-xl border border-border bg-canvas px-4 text-sm text-ink transition focus:border-brand',
          error && 'border-red-400 focus:border-red-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});
