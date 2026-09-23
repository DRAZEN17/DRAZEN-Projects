import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, Zap, Users, FileText, ArrowLeft, Award } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PropertyMap } from '@/components/map/PropertyMap';
import { useMockBackend } from '@/lib/mockBackend';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, electricityAccounts, meters } = useMockBackend();
  const property = properties.find((p) => p.id === id);
  const account = electricityAccounts.find((a) => a.propertyId === id);
  const meter = account ? meters.find((m) => m.electricityAccountId === account.id) : null;

  if (!property) {
    return (
      <div>
        <p className="text-sm text-ink-muted">Property not found.</p>
        <Button href="/dashboard/properties" variant="outline" size="sm" className="mt-4">
          Back to properties
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Helmet>
        <title>{property.street} — NDEPMP</title>
      </Helmet>

      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {property.houseNumber} {property.street}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
            <MapPin size={13} /> {property.town}, {property.lga}, {property.state}
          </p>
        </div>
        <StatusBadge status={property.status} />
      </div>

      {property.status === 'rejected' && property.rejectionReason && (
        <Card className="mt-5 border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20">
          <p className="text-sm text-red-600">Rejected: {property.rejectionReason}</p>
        </Card>
      )}

      <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_auto]">
        <Card>
          <h2 className="font-display text-base font-semibold">Property details</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs text-ink-muted">Property ID</dt>
              <dd className="mt-0.5 font-mono">{property.propertyUid}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">Address ID</dt>
              <dd className="mt-0.5 font-mono">{property.addressUid}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">Type</dt>
              <dd className="mt-0.5 capitalize">{property.propertyType}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">District</dt>
              <dd className="mt-0.5">{property.district || '\u2014'}</dd>
            </div>
          </dl>

          <h3 className="mt-6 flex items-center gap-1.5 text-sm font-medium text-ink-muted">
            <Users size={13} /> Occupants
          </h3>
          <div className="mt-2 flex flex-col gap-1.5">
            {(property.occupants || []).map((o, i) => (
              <p key={i} className="text-sm">
                {o.name} <span className="text-xs capitalize text-ink-muted">({o.relationship})</span>
              </p>
            ))}
          </div>

          <h3 className="mt-6 flex items-center gap-1.5 text-sm font-medium text-ink-muted">
            <FileText size={13} /> Documents & photos
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            {(property.images || []).length} photo(s), {(property.documents || []).length} document(s) on file.
          </p>
        </Card>

        <Card className="flex w-full flex-col items-center gap-2 sm:w-48">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Address QR</p>
          <QRCodeSVG value={property.propertyUid} size={120} bgColor="transparent" fgColor="currentColor" className="text-ink" />
          <p className="text-center text-[11px] text-ink-muted">Scans to {property.propertyUid}</p>
        </Card>
      </div>

      {property.gps && (
        <Card className="mt-5 p-0">
          <div className="p-6 pb-0">
            <h2 className="font-display text-base font-semibold">Location</h2>
          </div>
          <div className="p-6">
            <PropertyMap markers={[{ id: property.id, lat: property.gps.lat, lng: property.gps.lng, label: property.street }]} height="260px" zoom={15} />
          </div>
        </Card>
      )}

      {property.status === 'approved' && (
        <Card className="mt-5">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-brand" />
            <h2 className="font-display text-base font-semibold">Digital registration certificate</h2>
          </div>
          <p className="mt-2 text-sm text-ink-muted">
            Verified and approved{property.reviewedAt ? ` on ${new Date(property.reviewedAt).toLocaleDateString()}` : ''}. This certificate is
            tied to address ID <span className="font-mono">{property.addressUid}</span>.
          </p>
        </Card>
      )}

      <Card className="mt-5">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-brand" />
          <h2 className="font-display text-base font-semibold">Electricity account</h2>
        </div>
        {meter ? (
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs text-ink-muted">Meter number</dt>
              <dd className="mt-0.5 font-mono">{meter.meterNumber}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">Type</dt>
              <dd className="mt-0.5 capitalize">{account.meterType}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">Distribution company</dt>
              <dd className="mt-0.5">{account.discoCode}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">Account number</dt>
              <dd className="mt-0.5 font-mono">{account.accountNumber}</dd>
            </div>
          </dl>
        ) : property.status === 'approved' ? (
          <div className="mt-3">
            <p className="text-sm text-ink-muted">No meter linked yet.</p>
            <Button href={`/dashboard/electricity/link/${property.id}`} variant="primary" size="sm" className="mt-3">
              Link a meter
            </Button>
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-muted">Available once this property is approved.</p>
        )}
      </Card>

      <Link to="/dashboard/properties" className="mt-6 inline-block text-sm font-medium text-brand hover:underline">
        {'\u2190 All properties'}
      </Link>
    </div>
  );
}
