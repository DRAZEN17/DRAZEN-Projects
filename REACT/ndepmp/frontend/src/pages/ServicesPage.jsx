import { Helmet } from 'react-helmet-async';
import { Home, MapPin, Zap, Receipt, MessageSquare, Map } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Card } from '@/components/ui/Card';

const services = [
  { icon: Home, title: 'Property registration', text: 'Submit a residential, commercial, industrial, or government property with ownership documents and photographs for official verification.', points: ['Document upload', 'Officer review workflow', 'Registration certificate'] },
  { icon: MapPin, title: 'Digital addressing', text: 'Receive a permanent, geocoded address identifier resolvable from state down to unit number.', points: ['Unique address ID', 'QR verification', 'Printable certificate'] },
  { icon: Zap, title: 'Meter services', text: 'Register prepaid or postpaid meters and bind them to a verified property record.', points: ['Meter registration', 'Property linkage', 'Reading history'] },
  { icon: Receipt, title: 'Billing & payments', text: 'Band-based tariffs, itemised invoices, payment records, and downloadable receipts.', points: ['Invoice breakdown', 'Payment history', 'Receipt download'] },
  { icon: MessageSquare, title: 'Complaints & faults', text: 'Log outages, billing disputes, and faults, then track them to resolution with a reference number.', points: ['Ticket tracking', 'Status updates', 'Escalation path'] },
  { icon: Map, title: 'GIS & mapping', text: 'Every registered property plotted on a national map, with street visualisation and coverage overlays.', points: ['Address search', 'Street view of records', 'Coverage overlays'] },
];

export default function ServicesPage() {
  return (
    <>
      <Helmet>
        <title>Services — NDEPMP</title>
      </Helmet>
      <PageHero
        eyebrow="Services"
        title="Everything a property owner needs, in one place"
        description="Each service shares the same verified record, so information entered once is trusted everywhere it's used."
      />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, text, points }) => (
            <Card key={title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon size={18} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{text}</p>
              <ul className="mt-4 flex flex-col gap-1.5">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-xs text-ink-muted">
                    <span className="h-1 w-1 rounded-full bg-brand" />
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
