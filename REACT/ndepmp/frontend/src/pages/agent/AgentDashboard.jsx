import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ClipboardList, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { useMockBackend } from '@/lib/mockBackend';

export default function AgentDashboard() {
  const { fieldTasks, properties } = useMockBackend();

  return (
    <div>
      <Helmet>
        <title>Field agent — NDEPMP</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">Assigned verifications</h1>
      <p className="mt-1 text-sm text-ink-muted">Properties queued for an in-person check before approval.</p>

      <div className="mt-6">
        {fieldTasks.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No tasks assigned" description="New property submissions will appear here for verification." />
        ) : (
          <div className="flex flex-col gap-3">
            {fieldTasks.map((task) => {
              const property = properties.find((p) => p.id === task.propertyId);
              if (!property) return null;
              return (
                <Link key={task.id} to={`/agent/tasks/${task.id}`}>
                  <Card className="transition-transform hover:-translate-y-0.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {property.houseNumber} {property.street}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                          <MapPin size={11} /> {property.town}, {property.lga}, {property.state}
                        </p>
                      </div>
                      <StatusBadge status={task.status} />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
