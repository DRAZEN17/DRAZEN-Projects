import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useMockBackend } from '@/lib/mockBackend';

export default function AdminStatesPage() {
  const { states, properties, addState, toggleStateActive } = useMockBackend();
  const [newState, setNewState] = useState('');

  const countFor = (name) => properties.filter((p) => p.state === name).length;

  const submit = (e) => {
    e.preventDefault();
    if (!newState.trim()) return;
    addState(newState.trim());
    setNewState('');
  };

  return (
    <div>
      <Helmet>
        <title>States — NDEPMP Super Admin</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">Manage states</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Toggle a state off to hide it from property registration. LGAs and streets are entered as free text on each
        property rather than a separate master list — kept that way so the demo doesn&apos;t need Nigeria&apos;s
        full 774-LGA dataset to feel real.
      </p>

      <form onSubmit={submit} className="mt-4 flex gap-2">
        <input
          value={newState}
          onChange={(e) => setNewState(e.target.value)}
          placeholder="Add a state or territory"
          className="h-10 flex-1 rounded-xl border border-border bg-canvas px-4 text-sm focus:border-brand"
        />
        <Button type="submit" size="sm" variant="primary">
          <Plus size={14} /> Add
        </Button>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {states.map((s) => (
          <Card key={s.id} className="flex items-center justify-between">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-medium">
                <MapPin size={12} className="text-ink-muted" /> {s.name}
              </p>
              <p className="mt-1 text-xs text-ink-muted">{countFor(s.name)} registered</p>
            </div>
            <button onClick={() => toggleStateActive(s.id)}>
              <Badge tone={s.active ? 'success' : 'neutral'}>{s.active ? 'Active' : 'Hidden'}</Badge>
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
