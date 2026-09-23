import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { LifeBuoy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { useMockBackend } from '@/lib/mockBackend';

export default function SupportPage() {
  const { supportTickets, currentUser, fileTicket } = useMockBackend();
  const mine = supportTickets.filter((t) => t.ownerId === currentUser?.id);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    fileTicket(data);
    reset();
    setShowForm(false);
  };

  return (
    <div>
      <Helmet>
        <title>Support — NDEPMP</title>
      </Helmet>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Support</h1>
        <div className="flex gap-2">
          <Button href="/dashboard/call-request" variant="outline" size="sm">
            Request a callback
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowForm((s) => !s)}>
            {showForm ? 'Cancel' : 'New ticket'}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="Subject" id="subject" error={errors.subject?.message} {...register('subject', { required: 'Required' })} />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium text-ink-muted">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="rounded-xl border border-border bg-canvas p-4 text-sm text-ink transition focus:border-brand"
                {...register('description', { required: true })}
              />
            </div>
            <Button type="submit" variant="primary" className="self-start">
              Open ticket
            </Button>
          </form>
        </Card>
      )}

      {mine.length === 0 ? (
        <EmptyState icon={LifeBuoy} title="No support tickets" description="Open a ticket for anything account-related, or check the FAQ for common questions." />
      ) : (
        <div className="flex flex-col gap-3">
          {mine.map((t) => (
            <Card key={t.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{t.subject}</p>
                  <p className="mt-1 text-sm text-ink-muted">{t.description}</p>
                  <p className="mt-2 font-mono text-xs text-ink-muted">{t.ticketUid}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
