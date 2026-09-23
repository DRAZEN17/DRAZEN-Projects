import { Helmet } from 'react-helmet-async';
import { Home, Zap, Receipt, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useMockBackend } from '@/lib/mockBackend';

export default function DashboardOverview() {
  const { currentUser, properties, electricityAccounts, bills, complaints } = useMockBackend();
  const myProperties = properties.filter((p) => p.ownerId === currentUser?.id);
  const myPropertyIds = new Set(myProperties.map((p) => p.id));
  const myMeters = electricityAccounts.filter((a) => myPropertyIds.has(a.propertyId));
  const myBills = bills.filter((b) => myPropertyIds.has(b.propertyId));
  const outstanding = myBills.filter((b) => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0);
  const myComplaints = complaints.filter((c) => c.ownerId === currentUser?.id && c.status !== 'resolved' && c.status !== 'closed');

  const stats = [
    { label: 'Registered properties', value: myProperties.length, icon: Home },
    { label: 'Active meters', value: myMeters.length, icon: Zap },
    { label: 'Outstanding bills', value: `\u20a6${outstanding.toLocaleString()}`, icon: Receipt },
    { label: 'Open complaints', value: myComplaints.length, icon: MessageSquare },
  ];

  return (
    <div>
      <Helmet>
        <title>Dashboard — NDEPMP</title>
      </Helmet>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Welcome back{currentUser?.fullName ? `, ${currentUser.fullName.split(' ')[0]}` : ''}</h1>
        <p className="mt-1 text-sm text-ink-muted">Here&apos;s what&apos;s happening with your account.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon size={16} />
            </span>
            <p className="mt-4 font-display text-2xl font-semibold">{value}</p>
            <p className="text-sm text-ink-muted">{label}</p>
          </Card>
        ))}
      </div>

      {myProperties.length === 0 ? (
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Get started</h2>
            <Badge tone="brand">Next step</Badge>
          </div>
          <p className="mt-2 text-sm text-ink-muted">
            You don&apos;t have any registered properties yet. Register your first property to link an electricity
            account, view bills, and file complaints.
          </p>
          <Button href="/dashboard/properties/new" variant="primary" size="sm" className="mt-4">
            Register a property
          </Button>
        </Card>
      ) : (
        <Card className="mt-6">
          <h2 className="font-display text-lg font-semibold">Your properties</h2>
          <div className="mt-3 flex flex-col gap-2">
            {myProperties.slice(0, 4).map((p) => (
              <Button key={p.id} href={`/dashboard/properties/${p.id}`} variant="ghost" size="sm" className="justify-start px-0">
                {p.houseNumber} {p.street} — <span className="capitalize text-ink-muted">{p.status}</span>
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
