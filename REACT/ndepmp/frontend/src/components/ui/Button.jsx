import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  inverse: 'bg-white text-brand hover:bg-white/90',
  outline: 'border border-border text-ink hover:bg-canvas-alt',
  'outline-inverse': 'border border-white/30 text-white hover:bg-white/10',
  ghost: 'text-ink-muted hover:text-ink',
};

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-base',
};

export function Button({ as: Component = 'button', href, variant = 'primary', size = 'md', className, children, ...props }) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link to={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
