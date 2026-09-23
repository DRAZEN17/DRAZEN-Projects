import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ClipboardCheck, Check, X, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { useMockBackend } from '@/lib/mockBackend';

export default function AdminPropertiesPage() {
  const { properties, reviewProperty } = useMockBackend();
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState('');

  const submitReject = (id) => {
    reviewProperty(id, 'rejected', reason || 'Documents incomplete');
    setRejecting(null);
    setReason('');
  };

  return (
    <div>
      <Helmet>
        <title>Property approvals — NDEPMP Admin</title>
      </Helmet>
      <h1 className="mb-6 font-display text-2xl font-semibold">Property approvals</h1>

      {properties.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="No properties submitted" description="Submitted registrations land here for review." />
      ) : (
        <div className="flex flex-col gap-3">
          {properties.map((p) => (
            <Card key={p.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {p.houseNumber} {p.street}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                    <MapPin size={11} /> {p.town}, {p.lga}, {p.state}
                  </p>
                  <p className="mt-1 font-mono text-xs text-ink-muted">
                    {p.propertyUid} · {(p.documents?.length || 0)} doc(s) · {(p.images?.length || 0)} photo(s)
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </div>

              {p.status === 'pending' && (
                <div className="mt-4 border-t border-border pt-4">
                  {rejecting === p.id ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Reason for rejection"
                        className="h-9 flex-1 rounded-lg border border-border bg-canvas px-3 text-sm focus:border-brand"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="primary" onClick={() => submitReject(p.id)}>
                          Confirm
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setRejecting(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" variant="primary" onClick={() => reviewProperty(p.id, 'approved')}>
                        <Check size={14} /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setRejecting(p.id)}>
                        <X size={14} /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
