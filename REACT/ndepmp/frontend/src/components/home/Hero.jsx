import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const stats = [
  { label: 'States covered', value: '36 + FCT' },
  { label: 'Local government areas', value: '774' },
  { label: 'Distribution companies', value: '11' },
  { label: 'Registry availability', value: '24/7' },
];

const trustPoints = ['Free citizen registration', 'Officer-verified registration', 'Fully auditable'];

export function Hero() {
  const scopeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('[data-hero-badge]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo('[data-hero-heading]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.25')
        .fromTo('[data-hero-sub]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo('[data-hero-cta]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo('[data-hero-trust]', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.3')
        .fromTo('[data-hero-card]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.6');
    }, scopeRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={scopeRef} className="relative overflow-hidden bg-brand text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgb(255_255_255/0.08),_transparent_55%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <div
            data-hero-badge
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70"
          >
            National Digital Electricity & Property Management Platform
          </div>

          <h1 data-hero-heading className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.1] sm:text-5xl">
            One national registry for every property and every meter.
          </h1>

          <p data-hero-sub className="mt-6 max-w-lg text-white/75">
            NDEPMP connects property ownership, verified digital addressing, and electricity service records into a
            single accountable system — for citizens, distribution companies, and each other.
          </p>

          <div data-hero-cta className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/register" variant="inverse" size="lg">
              Register your property <ArrowRight size={16} />
            </Button>
            <Button href="/coverage" variant="outline-inverse" size="lg">
              <MapPin size={16} /> Check coverage
            </Button>
          </div>

          <div data-hero-trust className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/60">
            {trustPoints.map((point) => (
              <span key={point} className="flex items-center gap-1.5">
                <ShieldCheck size={13} /> {point}
              </span>
            ))}
          </div>
        </div>

        <div data-hero-card className="rounded-2xl bg-canvas p-6 text-ink shadow-2xl">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Registry snapshot</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-canvas-alt p-4">
                <p className="font-display text-xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-xs text-ink-muted">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-border p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Sample address ID</p>
            <p className="mt-1.5 font-mono text-sm text-brand">NG-LA9-IKJ-0417-C</p>
            <p className="mt-1 text-xs text-ink-muted">Illustrative — every registered property receives one on approval.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
