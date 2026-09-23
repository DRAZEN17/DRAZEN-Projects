import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/Card';
import { useMockBackend } from '@/lib/mockBackend';

const TOGGLES = [
  { key: 'maintenanceMode', label: 'Maintenance mode', hint: 'Shows a site-wide banner to every visitor. Try it — this one actually does something.' },
  { key: 'allowRegistrations', label: 'Allow new citizen registrations', hint: 'Turns off the "Create account" flow when disabled.' },
  { key: 'requireFieldVerification', label: 'Require field verification before approval', hint: 'Reference toggle — verification tasks are always created for now.' },
];

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useMockBackend();

  return (
    <div>
      <Helmet>
        <title>Settings — NDEPMP Super Admin</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">System settings</h1>
      <p className="mt-1 text-sm text-ink-muted">Platform-wide switches, persisted for this demo session.</p>

      <div className="mt-4 flex flex-col gap-3">
        {TOGGLES.map((t) => (
          <Card key={t.key} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{t.label}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{t.hint}</p>
            </div>
            <button
              type="button"
              onClick={() => updateSettings({ [t.key]: !settings[t.key] })}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${settings[t.key] ? 'bg-brand' : 'bg-canvas-alt border border-border'}`}
              aria-pressed={settings[t.key]}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings[t.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
