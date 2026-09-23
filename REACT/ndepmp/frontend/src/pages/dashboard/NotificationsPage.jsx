import { Helmet } from 'react-helmet-async';
import { Bell, Home, Zap, Receipt, MessageSquare, LifeBuoy } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { useMockBackend } from '@/lib/mockBackend';

const iconFor = { property: Home, electricity: Zap, payment: Receipt, complaint: MessageSquare, support: LifeBuoy, system: Bell };

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useMockBackend();

  return (
    <div>
      <Helmet>
        <title>Notifications — NDEPMP</title>
      </Helmet>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Notifications</h1>
        {notifications.some((n) => !n.isRead) && (
          <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" description="Bill reminders, outage notices, and updates on your complaints will show up here." />
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => {
            const Icon = iconFor[n.type] || Bell;
            return (
              <Card
                key={n.id}
                className={`flex items-start gap-3 ${n.isRead ? '' : 'border-brand/30 bg-brand/5'}`}
                onClick={() => !n.isRead && markNotificationRead(n.id)}
                role={n.isRead ? undefined : 'button'}
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas-alt text-ink-muted">
                  <Icon size={14} />
                </span>
                <div>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="mt-0.5 text-sm text-ink-muted">{n.message}</p>
                  <p className="mt-1 text-xs text-ink-muted">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.isRead && <span className="ml-auto mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
