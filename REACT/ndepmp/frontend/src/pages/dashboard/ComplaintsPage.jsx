import { Helmet } from 'react-helmet-async';
import { MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { useMockBackend } from '@/lib/mockBackend';
import { COMPLAINT_CATEGORIES } from '@/data/nigeria';

export default function ComplaintsPage() {
  const { complaints, currentUser } = useMockBackend();
  const mine = complaints.filter((c) => c.ownerId === currentUser?.id);
  const label = (value) => COMPLAINT_CATEGORIES.find((c) => c.value === value)?.label || value;

  return (
    <div>
      <Helmet>
        <title>Complaints — NDEPMP</title>
      </Helmet>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Complaints</h1>
        <Button href="/dashboard/complaints/new" variant="primary" size="sm">
          File a complaint
        </Button>
      </div>

      {mine.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No complaints filed"
          description="Report outages, low voltage, meter faults, or billing disputes here, with photos and a tracked reference number."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {mine.map((c) => (
            <Card key={c.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{label(c.category)}</p>
                  <p className="mt-1 text-sm text-ink-muted">{c.description}</p>
                  <p className="mt-2 font-mono text-xs text-ink-muted">{c.complaintUid}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              {c.updates?.length > 0 && (
                <div className="mt-3 border-t border-border pt-3">
                  {c.updates.map((u, i) => (
                    <p key={i} className="text-xs text-ink-muted">
                      {new Date(u.at).toLocaleDateString()} — now {u.status.replace('_', ' ')}{u.note ? `: ${u.note}` : ''}
                    </p>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
