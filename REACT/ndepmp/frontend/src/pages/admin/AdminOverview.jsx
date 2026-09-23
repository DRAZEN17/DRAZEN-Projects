import { Helmet } from 'react-helmet-async';
import { Users, Home, MessageSquare, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useMockBackend } from '@/lib/mockBackend';

export default function AdminOverview() {
  const { accounts, properties, complaints } = useMockBackend();
  const stats = [
    { label: 'Total users', value: accounts.length, icon: Users },
    { label: 'Pending approvals', value: properties.filter((p) => p.status === 'pending').length, icon: Clock },
    { label: 'Registered properties', value: properties.length, icon: Home },
    { label: 'Open complaints', value: complaints.filter((c) => c.status === 'open' || c.status === 'in_progress').length, icon: MessageSquare },
  ];
  const pending = properties.filter((p) => p.status === 'pending').slice(0, 5);

  return (
    <div>
      <Helmet>
        <title>Admin — NDEPMP</title>
      </Helmet>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Admin overview</h1>
        <p className="mt-1 text-sm text-ink-muted">Platform-wide activity at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-ink-muted">
              <Icon size={16} />
            </span>
            <p className="mt-4 font-display text-2xl font-semibold">{value}</p>
            <p className="text-sm text-ink-muted">{label}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="font-display text-lg font-semibold">Property approval queue</h2>
        {pending.length === 0 ? (
          <p className="mt-2 text-sm text-ink-muted">Nothing waiting on review.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {pending.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-t border-border py-2 text-sm first:border-t-0 first:pt-0">
                <span>
                  {p.houseNumber} {p.street}, {p.town}
                </span>
                <span className="font-mono text-xs text-ink-muted">{p.propertyUid}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
