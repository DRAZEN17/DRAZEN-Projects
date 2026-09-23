import { AlertTriangle } from 'lucide-react';
import { useMockBackend } from '@/lib/mockBackend';

export function MaintenanceBanner() {
  const { settings } = useMockBackend();
  if (!settings.maintenanceMode) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-center text-xs font-medium text-white">
      <AlertTriangle size={13} />
      Scheduled maintenance is underway — some actions may be temporarily unavailable.
    </div>
  );
}
