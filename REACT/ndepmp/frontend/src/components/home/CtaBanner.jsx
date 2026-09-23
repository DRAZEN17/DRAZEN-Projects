import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-brand px-8 py-16 text-center text-white sm:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgb(255_255_255/0.1),_transparent_60%)]" />
        <h2 className="relative font-display text-3xl font-semibold sm:text-4xl">Put your property on the record</h2>
        <p className="relative mx-auto mt-4 max-w-lg text-white/75">
          Registration is free for citizens and takes about ten minutes to submit.
        </p>
        <Button href="/register" variant="inverse" size="lg" className="relative mt-8">
          Get started <ArrowRight size={16} />
        </Button>
      </div>
    </section>
  );
}
