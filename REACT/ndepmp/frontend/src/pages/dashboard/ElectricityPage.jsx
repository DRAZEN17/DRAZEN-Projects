import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Zap, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { useMockBackend } from '@/lib/mockBackend';

export default function ElectricityPage() {
  const { properties, electricityAccounts, meters, currentUser } = useMockBackend();
  const myProperties = properties.filter((p) => p.ownerId === currentUser?.id);
  const myPropertyIds = new Set(myProperties.map((p) => p.id));
  const myAccounts = electricityAccounts.filter((a) => myPropertyIds.has(a.propertyId));

  const approvedUnlinked = myProperties.filter(
    (p) => p.status === 'approved' && !myAccounts.some((a) => a.propertyId === p.id)
  );

  return (
    <div>
      <Helmet>
        <title>Electricity — NDEPMP</title>
      </Helmet>
      <h1 className="mb-6 font-display text-2xl font-semibold">Electricity</h1>

      {myAccounts.length === 0 && approvedUnlinked.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No electricity accounts linked"
          description="Once a property is registered and approved, you can link a prepaid or postpaid meter to it here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {myAccounts.map((account) => {
            const meter = meters.find((m) => m.electricityAccountId === account.id);
            const property = myProperties.find((p) => p.id === account.propertyId);
            return (
              <Card key={account.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Zap size={16} />
                    </span>
                    <h3 className="mt-3 font-display text-base font-semibold">{meter?.meterNumber}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                      <MapPin size={11} /> {property?.street}
                    </p>
                  </div>
                  <div className="text-right text-xs text-ink-muted">
                    <p className="capitalize">{account.meterType}</p>
                    <p className="mt-0.5">{account.discoCode}</p>
                  </div>
                </div>
                <Link to={`/dashboard/properties/${account.propertyId}`} className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
                  View property
                </Link>
              </Card>
            );
          })}

          {approvedUnlinked.map((p) => (
            <Card key={p.id} className="border-dashed">
              <p className="text-sm font-medium">
                {p.houseNumber} {p.street}
              </p>
              <p className="mt-1 text-xs text-ink-muted">{'Approved and ready \u2014 no meter linked yet.'}</p>
              <Button href={`/dashboard/electricity/link/${p.id}`} variant="primary" size="sm" className="mt-3">
                Link a meter
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
