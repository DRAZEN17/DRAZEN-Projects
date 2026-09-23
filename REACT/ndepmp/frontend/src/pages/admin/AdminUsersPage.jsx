import { Helmet } from 'react-helmet-async';
import { Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { useMockBackend } from '@/lib/mockBackend';

export default function AdminUsersPage() {
  const { accounts } = useMockBackend();

  return (
    <div>
      <Helmet>
        <title>Users — NDEPMP Admin</title>
      </Helmet>
      <h1 className="mb-6 font-display text-2xl font-semibold">Users</h1>

      {accounts.length === 0 ? (
        <EmptyState icon={Users} title="No users yet" description="Registered citizens, field agents, and staff will appear here." />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs text-ink-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">{a.fullName}</td>
                    <td className="px-4 py-3 text-ink-muted">{a.email}</td>
                    <td className="px-4 py-3">
                      <Badge tone="neutral" className="capitalize">
                        {a.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{new Date(a.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
