import { cn } from '@/lib/cn';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('rounded-2xl border border-border bg-canvas p-6', className)} {...props}>
      {children}
    </div>
  );
}
