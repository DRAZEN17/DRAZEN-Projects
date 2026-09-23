import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/Card';
import { useMockBackend } from '@/lib/mockBackend';

const ALL_PERMISSIONS = [
  'view_own_properties', 'file_complaints', 'pay_bills', 'verify_properties',
  'approve_properties', 'manage_users', 'manage_complaints', 'manage_tariffs', 'manage_settings',
];

const ROLES = ['citizen', 'field_agent', 'admin'];

export default function AdminRolesPage() {
  const { rolePermissions, updateRolePermissions } = useMockBackend();

  const toggle = (role, permission) => {
    const current = rolePermissions[role] || [];
    const next = current.includes(permission) ? current.filter((p) => p !== permission) : [...current, permission];
    updateRolePermissions(role, next);
  };

  return (
    <div>
      <Helmet>
        <title>Roles — NDEPMP Super Admin</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">Role permissions</h1>
      <p className="mt-1 text-sm text-ink-muted">Reference matrix — saved and persisted.</p>

      <Card className="mt-4 overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Permission</th>
              {ROLES.map((r) => (
                <th key={r} className="px-4 py-3 text-center font-medium capitalize">
                  {r.replace('_', ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_PERMISSIONS.map((perm) => (
              <tr key={perm} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-ink-muted">{perm.replace(/_/g, ' ')}</td>
                {ROLES.map((r) => (
                  <td key={r} className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={(rolePermissions[r] || []).includes(perm)}
                      onChange={() => toggle(r, perm)}
                      className="h-4 w-4 accent-current text-brand"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
