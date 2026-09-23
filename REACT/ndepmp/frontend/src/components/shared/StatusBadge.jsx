import { Badge } from '@/components/ui/Badge';

const toneMap = {
  pending: 'neutral',
  pending_verification: 'neutral',
  assigned: 'neutral',
  open: 'neutral',
  approved: 'success',
  active: 'success',
  paid: 'success',
  success: 'success',
  resolved: 'success',
  closed: 'success',
  completed: 'success',
  in_progress: 'brand',
  rejected: 'danger',
  overdue: 'danger',
  failed: 'danger',
};

const labelMap = {
  pending_verification: 'Pending verification',
  in_progress: 'In progress',
};

export function StatusBadge({ status }) {
  const tone = toneMap[status] || 'neutral';
  const label = labelMap[status] || (status ? status.replace(/_/g, ' ') : 'Unknown');
  return (
    <Badge tone={tone} className="capitalize">
      {label}
    </Badge>
  );
}
