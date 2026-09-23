import { Helmet } from 'react-helmet-async';
import { History } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { useMockBackend } from '@/lib/mockBackend';

export default function AdminAuditLogPage() {
  const { auditLogs } = useMockBackend();

  return (
    <div>
      <Helmet>
        <title>Audit log — NDEPMP Super Admin</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">Audit log</h1>
      <p className="mt-1 text-sm text-ink-muted">Every write action taken across this demo session, newest first.</p>

      {auditLogs.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon={History} title="Nothing logged yet" description="Actions across the platform will appear here as they happen." />
        </div>
      ) : (
        <Card className="mt-4 overflow-hidden p-0">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 border-b border-border bg-canvas text-xs text-ink-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Entity</th>
                  <th className="px-4 py-3 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{l.action}</td>
                    <td className="px-4 py-3 text-ink-muted">{l.entity}</td>
                    <td className="px-4 py-3 text-ink-muted">{new Date(l.at).toLocaleString()}</td>
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
