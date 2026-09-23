import { Home, MapPin, Zap, Receipt, QrCode, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const modules = [
  { icon: Home, title: 'Property registration', text: 'Submit ownership documents and photographs for review by a field officer, then receive a certificate of digital registration.' },
  { icon: MapPin, title: 'Digital addressing', text: 'Every registered building receives a unique, geocoded address ID resolvable down to street and house number.' },
  { icon: Zap, title: 'Meter registry', text: 'Link prepaid or postpaid meters to a verified property, ending duplicate and orphan meter records.' },
  { icon: Receipt, title: 'Billing & receipts', text: 'Band-based tariffs, consumption history, and downloadable receipts for every payment.' },
  { icon: QrCode, title: 'Verifiable credentials', text: 'QR-coded property and address certificates that anyone can validate instantly, without a phone call.' },
  { icon: ShieldCheck, title: 'Governed access', text: 'Role-based permissions for citizens, field agents, and administrators, with a full audit trail.' },
];

export function PlatformModules() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <p className="text-xs font-medium uppercase tracking-wide text-brand">Platform modules</p>
      <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold sm:text-4xl">Built for the full lifecycle of a property</h2>
      <p className="mt-4 max-w-xl text-ink-muted">
        From first registration through metering, billing, and inspection — each stage is recorded once and shared
        across the modules that need it.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map(({ icon: Icon, title, text }) => (
          <Card key={title} className="transition-transform duration-200 hover:-translate-y-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon size={18} />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-ink-muted">{text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
