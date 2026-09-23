import { Helmet } from 'react-helmet-async';
import { MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { useMockBackend } from '@/lib/mockBackend';
import { COMPLAINT_CATEGORIES } from '@/data/nigeria';

const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

export default function AdminComplaintsPage() {
  const { complaints, updateComplaint } = useMockBackend();
  const label = (value) => COMPLAINT_CATEGORIES.find((c) => c.value === value)?.label || value;

  return (
    <div>
      <Helmet>
        <title>Complaints — NDEPMP Admin</title>
      </Helmet>
      <h1 className="mb-6 font-display text-2xl font-semibold">Complaints</h1>

      {complaints.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No complaints yet" description="Citizen complaints appear here for assignment and tracking." />
      ) : (
        <div className="flex flex-col gap-3">
          {complaints.map((c) => (
            <Card key={c.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{label(c.category)}</p>
                  <p className="mt-1 text-sm text-ink-muted">{c.description}</p>
                  <p className="mt-2 font-mono text-xs text-ink-muted">{c.complaintUid}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                <span className="text-xs text-ink-muted">Update status:</span>
                <Select value={c.status} onChange={(e) => updateComplaint(c.id, e.target.value)} className="h-8 w-40 text-xs">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </Select>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
