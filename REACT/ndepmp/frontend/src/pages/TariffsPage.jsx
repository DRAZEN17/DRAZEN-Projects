import { Helmet } from 'react-helmet-async';
import { Clock } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Card } from '@/components/ui/Card';
import { useMockBackend } from '@/lib/mockBackend';

export default function TariffsPage() {
  const { tariffBands } = useMockBackend();

  return (
    <>
      <Helmet>
        <title>Tariffs — NDEPMP</title>
      </Helmet>
      <PageHero
        eyebrow="Tariffs"
        title="Service bands and rates"
        description="Your band reflects the minimum hours of supply guaranteed to your feeder each day, per NERC's Service Based Tariff structure."
      />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tariffBands.map((b) => (
            <Card key={b.id}>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Band {b.band}</h3>
                <span className="flex items-center gap-1.5 rounded-full bg-canvas-alt px-2.5 py-1 text-xs text-ink-muted">
                  <Clock size={12} /> {b.hours}
                </span>
              </div>
              <p className="mt-4">
                <span className="font-display text-2xl font-semibold text-highlight">₦{b.rate}</span>
                <span className="text-sm text-ink-muted"> /kWh</span>
              </p>
              <p className="mt-2 text-xs text-ink-muted">Feeders guaranteed the minimum hours of supply shown above.</p>
            </Card>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-xs text-ink-muted">
          Illustrative example rates. Actual tariffs are set and periodically reviewed by NERC and each distribution
          company — check your bill or your DISCO&apos;s official channel for the rate that applies to you.
        </p>
      </section>
    </>
  );
}
