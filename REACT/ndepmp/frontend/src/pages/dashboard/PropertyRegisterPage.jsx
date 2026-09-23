import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LocationPicker } from '@/components/map/LocationPicker';
import { PhotoUpload } from '@/components/shared/PhotoUpload';
import { FileUpload } from '@/components/shared/FileUpload';
import { useMockBackend } from '@/lib/mockBackend';
import { PROPERTY_TYPES } from '@/data/nigeria';

export default function PropertyRegisterPage() {
  const navigate = useNavigate();
  const { currentUser, registerProperty, states } = useMockBackend();
  const activeStates = states.filter((s) => s.active);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { propertyType: 'residential', state: activeStates[0]?.name },
  });

  const [location, setLocation] = useState(null);
  const [occupants, setOccupants] = useState([{ name: currentUser?.fullName || '', relationship: 'owner', phone: currentUser?.phone || '' }]);
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [locationError, setLocationError] = useState('');

  const addOccupant = () => setOccupants((o) => [...o, { name: '', relationship: 'occupant', phone: '' }]);
  const removeOccupant = (i) => setOccupants((o) => o.filter((_, idx) => idx !== i));
  const updateOccupant = (i, field, value) =>
    setOccupants((o) => o.map((occ, idx) => (idx === i ? { ...occ, [field]: value } : occ)));

  const onSubmit = (data) => {
    if (!location) {
      setLocationError('Pin the property location on the map before submitting.');
      return;
    }
    setLocationError('');

    const property = registerProperty({
      ...data,
      gps: location,
      occupants,
      images: photos.map((p) => ({ name: p.name })),
      documents: documents.map((d) => ({ name: d.name })),
    });

    navigate(`/dashboard/properties/${property.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Helmet>
        <title>Register a property — NDEPMP</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">Register a property</h1>
      <p className="mt-1 text-sm text-ink-muted">Submit your property for verification. A field agent will confirm it before approval.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5">
        <Card>
          <h2 className="font-display text-base font-semibold">Property type</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PROPERTY_TYPES.map((t) => (
              <label
                key={t.value}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand/5 has-[:checked]:text-brand"
              >
                <input type="radio" value={t.value} className="hidden" {...register('propertyType')} />
                {t.label}
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-base font-semibold">Address</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Select label="State" id="state" {...register('state', { required: true })}>
              {activeStates.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </Select>
            <Input label="LGA" id="lga" error={errors.lga?.message} {...register('lga', { required: 'Required' })} />
            <Input label="Town / village" id="town" error={errors.town?.message} {...register('town', { required: 'Required' })} />
            <Input label="District (optional)" id="district" {...register('district')} />
            <Input label="Street" id="street" error={errors.street?.message} {...register('street', { required: 'Required' })} />
            <Input label="House number" id="houseNumber" error={errors.houseNumber?.message} {...register('houseNumber', { required: 'Required' })} />
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-base font-semibold">GPS location</h2>
          <p className="mt-1 text-sm text-ink-muted">Click the map to pin exactly where the property sits.</p>
          <div className="mt-4">
            <LocationPicker value={location} onChange={setLocation} />
          </div>
          {locationError && <p className="mt-2 text-xs text-red-500">{locationError}</p>}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Occupants</h2>
            <Button type="button" variant="outline" size="sm" onClick={addOccupant}>
              <Plus size={14} /> Add
            </Button>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {occupants.map((occ, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 rounded-xl border border-border p-3 sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-end">
                <Input label="Name" value={occ.name} onChange={(e) => updateOccupant(i, 'name', e.target.value)} />
                <Select label="Relationship" value={occ.relationship} onChange={(e) => updateOccupant(i, 'relationship', e.target.value)}>
                  <option value="owner">Owner</option>
                  <option value="tenant">Tenant</option>
                  <option value="occupant">Occupant</option>
                </Select>
                <Input label="Phone" value={occ.phone} onChange={(e) => updateOccupant(i, 'phone', e.target.value)} />
                {occupants.length > 1 && (
                  <button type="button" onClick={() => removeOccupant(i)} className="flex h-11 items-center justify-center text-ink-muted hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-base font-semibold">Photos & documents</h2>
          <p className="mt-1 text-sm text-ink-muted">Photos of the property, ownership documents, and a valid ID.</p>
          <div className="mt-4 flex flex-col gap-5">
            <PhotoUpload label="Property photos" onChange={setPhotos} />
            <FileUpload label="Ownership documents & ID" files={documents} onChange={setDocuments} />
          </div>
        </Card>

        <Button type="submit" variant="primary" size="lg" className="self-start">
          Submit for verification
        </Button>
      </form>
    </div>
  );
}
