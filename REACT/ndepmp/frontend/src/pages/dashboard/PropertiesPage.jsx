import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { useMockBackend } from '@/lib/mockBackend';

export default function PropertiesPage() {
  const { properties, currentUser } = useMockBackend();
  const mine = properties.filter((p) => p.ownerId === currentUser?.id);

  return (
    <div>
      <Helmet>
        <title>Properties — NDEPMP</title>
      </Helmet>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Properties</h1>
        <Button href="/dashboard/properties/new" variant="primary" size="sm">
          Register a property
        </Button>
      </div>

      {mine.length === 0 ? (
        <EmptyState
          icon={Home}
          title="No properties yet"
          description="Register your first property to get a verified digital address and link an electricity account to it."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((p) => (
            <Link key={p.id} to={`/dashboard/properties/${p.id}`}>
              <Card className="h-full transition-transform hover:-translate-y-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Home size={16} />
                  </span>
                  <StatusBadge status={p.status} />
                </div>
                <h3 className="mt-3 font-display text-base font-semibold">
                  {p.houseNumber} {p.street}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                  <MapPin size={11} /> {p.town}, {p.lga}, {p.state}
                </p>
                <p className="mt-3 font-mono text-xs text-ink-muted">{p.propertyUid}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
