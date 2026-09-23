import { Helmet } from 'react-helmet-async';
import { ShieldCheck, MapPin, Zap } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Card } from '@/components/ui/Card';

const points = [
  { icon: MapPin, title: 'One address system', text: 'Every property gets a permanent, verifiable digital address tied to Nigeria\u2019s real state, LGA, and street hierarchy.' },
  { icon: Zap, title: 'One electricity record', text: 'Meters, tariff bands, readings, and bills live against the property they belong to, not a disconnected account number.' },
  { icon: ShieldCheck, title: 'Verified, not assumed', text: 'A field officer confirms every property in person before it\u2019s approved — the record means something.' },
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About — NDEPMP</title>
      </Helmet>
      <PageHero
        eyebrow="About"
        title="An independent registry for property and electricity records"
        description="NDEPMP is a  project exploring what a unified property-and-utility platform for Nigeria."
      />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-5 sm:grid-cols-3">
          {points.map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon size={18} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{text}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
