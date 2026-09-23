import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PhotoUpload } from '@/components/shared/PhotoUpload';
import { PropertyMap } from '@/components/map/PropertyMap';
import { useMockBackend } from '@/lib/mockBackend';

export default function AgentTaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { fieldTasks, properties, submitFieldReport } = useMockBackend();
  const task = fieldTasks.find((t) => t.id === taskId);
  const property = task ? properties.find((p) => p.id === task.propertyId) : null;

  const [photos, setPhotos] = useState([]);
  const [notes, setNotes] = useState('');

  if (!task || !property) {
    return <p className="text-sm text-ink-muted">Task not found.</p>;
  }

  const complete = () => {
    submitFieldReport(task.id, { notes, photoCount: photos.length, verifiedAt: new Date().toISOString() });
    navigate('/agent');
  };

  return (
    <div>
      <Helmet>
        <title>Verify property — NDEPMP Field Agent</title>
      </Helmet>
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold">
            {property.houseNumber} {property.street}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
            <MapPin size={13} /> {property.town}, {property.lga}, {property.state}
          </p>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {property.gps && (
        <div className="mt-4">
          <PropertyMap markers={[{ id: property.id, lat: property.gps.lat, lng: property.gps.lng, label: property.street }]} height="220px" zoom={16} />
        </div>
      )}

      <Card className="mt-4">
        <h2 className="font-display text-sm font-semibold">Submitted details</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-ink-muted">Property ID</dt>
            <dd className="font-mono">{property.propertyUid}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Type</dt>
            <dd className="capitalize">{property.propertyType}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-ink-muted">
          {(property.documents?.length || 0)} document(s) and {(property.images?.length || 0)} photo(s) submitted by the citizen.
        </p>
      </Card>

      {task.status === 'assigned' ? (
        <Card className="mt-4">
          <h2 className="font-display text-sm font-semibold">Verification report</h2>
          <div className="mt-3">
            <PhotoUpload label="Photos taken on site" onChange={setPhotos} max={6} />
          </div>
          <div className="mt-4 flex flex-col gap-1.5">
            <label htmlFor="notes" className="text-sm font-medium text-ink-muted">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl border border-border bg-canvas p-4 text-sm text-ink transition focus:border-brand"
              placeholder="Confirmed the building matches the submission…"
            />
          </div>
          <Button variant="primary" className="mt-4 w-full" onClick={complete}>
            Mark verified
          </Button>
        </Card>
      ) : (
        <Card className="mt-4">
          <p className="text-sm text-ink-muted">
            Verified {task.completedAt ? new Date(task.completedAt).toLocaleString() : ''}. {task.report?.notes}
          </p>
        </Card>
      )}
    </div>
  );
}
