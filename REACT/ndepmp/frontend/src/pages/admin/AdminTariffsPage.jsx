import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useMockBackend } from '@/lib/mockBackend';

export default function AdminTariffsPage() {
  const { tariffBands, updateTariffBand } = useMockBackend();
  const [drafts, setDrafts] = useState({});
  const [saved, setSaved] = useState(null);

  const rateFor = (b) => (drafts[b.id] !== undefined ? drafts[b.id] : b.rate);

  const save = (b) => {
    const rate = parseFloat(rateFor(b));
    if (Number.isNaN(rate)) return;
    updateTariffBand(b.id, { rate });
    setSaved(b.id);
    setTimeout(() => setSaved(null), 1500);
  };

  return (
    <div>
      <Helmet>
        <title>Tariffs — NDEPMP Super Admin</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">Manage tariffs</h1>
      <p className="mt-1 text-sm text-ink-muted">Rates update live on the public Tariffs page and the meter-linking form.</p>

      <div className="mt-4 flex flex-col gap-3">
        {tariffBands.map((b) => (
          <Card key={b.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">Band {b.band}</p>
              <p className="text-xs text-ink-muted">{b.hours}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink-muted">₦</span>
              <input
                type="number"
                step="0.01"
                value={rateFor(b)}
                onChange={(e) => setDrafts((d) => ({ ...d, [b.id]: e.target.value }))}
                className="h-9 w-28 rounded-lg border border-border bg-canvas px-3 text-sm focus:border-brand"
              />
              <span className="text-sm text-ink-muted">/kWh</span>
              <Button size="sm" variant="outline" onClick={() => save(b)}>
                {saved === b.id ? <Check size={14} /> : 'Save'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
