import { Helmet } from 'react-helmet-async';
import { CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { useMockBackend } from '@/lib/mockBackend';

export default function AdminPaymentsPage() {
  const { payments, properties } = useMockBackend();
  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <Helmet>
        <title>Payments — NDEPMP Admin</title>
      </Helmet>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Payments</h1>
        <p className="text-sm text-ink-muted">Total collected: <span className="font-semibold text-ink">₦{total.toLocaleString()}</span></p>
      </div>

      {payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payments yet" description="Successful payments across every account will appear here." />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs text-ink-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Receipt</th>
                  <th className="px-4 py-3 font-medium">Property</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Provider</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Paid</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const property = properties.find((pr) => pr.id === p.propertyId);
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-mono text-xs">{p.paymentUid}</td>
                      <td className="px-4 py-3 text-ink-muted">{property?.street || '\u2014'}</td>
                      <td className="px-4 py-3">₦{p.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 capitalize text-ink-muted">{p.provider.replace('_', ' ')}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3 text-ink-muted">{new Date(p.paidAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
