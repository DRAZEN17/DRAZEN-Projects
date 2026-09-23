import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { UserPlus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useMockBackend } from '@/lib/mockBackend';

export default function AdminStaffPage() {
  const { accounts, inviteStaff } = useMockBackend();
  const staff = accounts.filter((a) => a.role !== 'citizen');
  const [form, setForm] = useState({ fullName: '', email: '', role: 'field_agent' });
  const [showForm, setShowForm] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) return;
    inviteStaff(form);
    setForm({ fullName: '', email: '', role: 'field_agent' });
    setShowForm(false);
  };

  return (
    <div>
      <Helmet>
        <title>Staff — NDEPMP Super Admin</title>
      </Helmet>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Staff</h1>
        <Button size="sm" variant="primary" onClick={() => setShowForm((s) => !s)}>
          <UserPlus size={14} /> {showForm ? 'Cancel' : 'Invite staff'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-4">
          <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[1fr_1fr_160px_auto]">
            <Input placeholder="Full name" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
            <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <Select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              <option value="field_agent">Field agent</option>
              <option value="admin">Admin</option>
            </Select>
            <Button type="submit" variant="primary">
              Add
            </Button>
          </form>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        {staff.map((s) => (
          <Card key={s.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{s.fullName}</p>
              <p className="text-xs text-ink-muted">{s.email}</p>
            </div>
            <Badge tone="neutral" className="capitalize">
              {s.role.replace('_', ' ')}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
