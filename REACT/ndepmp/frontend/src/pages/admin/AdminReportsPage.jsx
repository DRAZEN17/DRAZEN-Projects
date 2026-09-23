import { Helmet } from 'react-helmet-async';
import { Calendar, TrendingUp, Zap, Home, Gauge, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useMockBackend } from '@/lib/mockBackend';

export default function AdminReportsPage() {
  const { properties, meters, bills, payments, complaints } = useMockBackend();

  const revenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const consumption = bills.reduce((sum, b) => sum + b.consumptionKwh, 0);
  const thisMonthLabel = new Date().toLocaleDateString('en-NG', { month: 'long', year: 'numeric' });

  const reports = [
    { icon: Calendar, title: 'This month', value: thisMonthLabel },
    { icon: TrendingUp, title: 'Revenue collected', value: `\u20a6${revenue.toLocaleString()}` },
    { icon: Zap, title: 'Power consumption logged', value: `${consumption.toLocaleString()} kWh` },
    { icon: Home, title: 'Registered properties', value: properties.length },
    { icon: Gauge, title: 'Registered meters', value: meters.length },
    { icon: MessageSquare, title: 'Complaints filed', value: complaints.length },
  ];

  return (
    <div>
      <Helmet>
        <title>Reports — NDEPMP Admin</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">Reports</h1>
      <p className="mt-1 text-sm text-ink-muted">Live totals from this demo session.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map(({ icon: Icon, title, value }) => (
          <Card key={title}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-ink-muted">
              <Icon size={16} />
            </span>
            <p className="mt-4 font-display text-xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-ink-muted">{title}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
