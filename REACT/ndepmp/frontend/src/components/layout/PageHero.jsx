import { cn } from '@/lib/cn';

export function PageHero({ eyebrow, title, description, className }) {
  return (
    <section className={cn('relative overflow-hidden bg-brand px-4 py-16 text-white', className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgb(255_255_255/0.08),_transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl">
        {eyebrow && <p className="text-xs font-medium uppercase tracking-wider text-white/60">{eyebrow}</p>}
        <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-4 max-w-xl text-white/75">{description}</p>}
      </div>
    </section>
  );
}
