import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useMockBackend } from '@/lib/mockBackend';

export default function AdminUtilityCompaniesPage() {
  const { utilityCompanies, addUtilityCompany, toggleUtilityCompanyActive } = useMockBackend();
  const [form, setForm] = useState({ code: '', name: '' });

  const submit = (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.name.trim()) return;
    addUtilityCompany({ code: form.code.trim().toUpperCase(), name: form.name.trim() });
    setForm({ code: '', name: '' });
  };

  return (
    <div>
      <Helmet>
        <title>Utility companies — NDEPMP Super Admin</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">Manage utility companies</h1>
      <p className="mt-1 text-sm text-ink-muted">Controls which distribution companies citizens can select when linking a meter.</p>

      <Card className="mt-4">
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[120px_1fr_auto]">
          <Input placeholder="Code" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} />
          <Input placeholder="Company name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Button type="submit" variant="primary">
            <Plus size={14} /> Add
          </Button>
        </form>
      </Card>

      <div className="mt-4 flex flex-col gap-2">
        {utilityCompanies.map((u) => (
          <Card key={u.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Zap size={15} />
              </span>
              <div>
                <p className="text-sm font-medium">{u.code}</p>
                <p className="text-xs text-ink-muted">{u.name}</p>
              </div>
            </div>
            <button onClick={() => toggleUtilityCompanyActive(u.id)}>
              <Badge tone={u.active ? 'success' : 'neutral'}>{u.active ? 'Active' : 'Disabled'}</Badge>
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
