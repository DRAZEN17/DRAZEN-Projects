import { cn } from '@/lib/cn';

const tones = {
  neutral: 'bg-canvas-alt text-ink-muted border-border',
  brand: 'bg-brand/10 text-brand border-brand/20',
  success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  danger: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export function Badge({ tone = 'neutral', children, className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  );
}
