import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PhotoUpload } from '@/components/shared/PhotoUpload';
import { useMockBackend } from '@/lib/mockBackend';
import { COMPLAINT_CATEGORIES } from '@/data/nigeria';
import { useState } from 'react';

export default function FileComplaintPage() {
  const navigate = useNavigate();
  const { properties, currentUser, fileComplaint } = useMockBackend();
  const mine = properties.filter((p) => p.ownerId === currentUser?.id);
  const [photos, setPhotos] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { category: COMPLAINT_CATEGORIES[0].value },
  });

  const onSubmit = (data) => {
    fileComplaint({ ...data, photos: photos.map((p) => ({ name: p.name })) });
    navigate('/dashboard/complaints');
  };

  return (
    <div className="mx-auto max-w-lg">
      <Helmet>
        <title>File a complaint — NDEPMP</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">File a complaint</h1>
      <p className="mt-1 text-sm text-ink-muted">We&apos;ll assign it a reference number and track it through to resolution.</p>

      <Card className="mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Select label="Category" id="category" {...register('category')}>
            {COMPLAINT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>

          {mine.length > 0 && (
            <Select label="Related property (optional)" id="propertyId" {...register('propertyId')}>
              <option value="">None</option>
              {mine.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.houseNumber} {p.street}
                </option>
              ))}
            </Select>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-ink-muted">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="rounded-xl border border-border bg-canvas p-4 text-sm text-ink transition focus:border-brand"
              {...register('description', { required: true })}
            />
            {errors.description && <span className="text-xs text-red-500">Please describe the issue</span>}
          </div>

          <PhotoUpload label="Photos (optional)" onChange={setPhotos} max={4} />

          <Button type="submit" variant="primary" className="w-full">
            Submit complaint
          </Button>
        </form>
      </Card>
    </div>
  );
}
