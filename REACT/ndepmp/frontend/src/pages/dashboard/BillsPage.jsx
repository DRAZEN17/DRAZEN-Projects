import { Helmet } from 'react-helmet-async';
import { Receipt } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { useMockBackend } from '@/lib/mockBackend';

export default function BillsPage() {
  const { bills, properties, currentUser } = useMockBackend();
  const myPropertyIds = new Set(properties.filter((p) => p.ownerId === currentUser?.id).map((p) => p.id));
  const myBills = bills.filter((b) => myPropertyIds.has(b.propertyId));

  return (
    <div>
      <Helmet>
        <title>Bills — NDEPMP</title>
      </Helmet>
      <h1 className="mb-6 font-display text-2xl font-semibold">Bills</h1>

      {myBills.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No bills yet"
          description="Bills appear here once you have an active electricity account. You'll be able to pay, download, and email receipts from this page."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {myBills.map((bill) => {
            const property = properties.find((p) => p.id === bill.propertyId);
            return (
              <Card key={bill.id} className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-semibold">₦{bill.amount.toLocaleString()}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {bill.period} · {property?.street} · {bill.consumptionKwh} kWh{bill.isEstimated ? ' (estimated)' : ''}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-ink-muted">{bill.billUid}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={bill.status} />
                  {bill.status === 'pending' && (
                    <Button href={`/dashboard/bills/pay/${bill.id}`} variant="primary" size="sm">
                      Pay now
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
