import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useMockBackend } from '@/lib/mockBackend';

export default function AddMeterPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { properties, linkMeter, utilityCompanies, tariffBands } = useMockBackend();
  const activeDiscos = utilityCompanies.filter((u) => u.active);
  const property = properties.find((p) => p.id === propertyId);
  const { register, handleSubmit } = useForm({
    defaultValues: { discoCode: activeDiscos[0]?.code, meterType: 'prepaid', tariffBand: 'C' },
  });

  if (!property) {
    return <p className="text-sm text-ink-muted">Property not found.</p>;
  }

  const onSubmit = (data) => {
    linkMeter(propertyId, data);
    navigate(`/dashboard/properties/${propertyId}`);
  };

  return (
    <div className="mx-auto max-w-lg">
      <Helmet>
        <title>Link a meter — NDEPMP</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">Link an electricity account</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {property.houseNumber} {property.street}, {property.town}
      </p>

      <Card className="mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Select label="Distribution company" id="discoCode" {...register('discoCode')}>
            {activeDiscos.map((d) => (
              <option key={d.code} value={d.code}>
                {d.code} — {d.name}
              </option>
            ))}
          </Select>

          <div>
            <span className="text-sm font-medium text-ink-muted">Meter type</span>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {['prepaid', 'postpaid'].map((t) => (
                <label
                  key={t}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm capitalize has-[:checked]:border-brand has-[:checked]:bg-brand/5 has-[:checked]:text-brand"
                >
                  <input type="radio" value={t} className="hidden" {...register('meterType')} />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <Select label="Tariff band" id="tariffBand" {...register('tariffBand')}>
            {tariffBands.map((b) => (
              <option key={b.id} value={b.band}>
                Band {b.band} — {b.hours} (₦{b.rate}/kWh)
              </option>
            ))}
          </Select>

          <Button type="submit" variant="primary" className="w-full">
            Link meter
          </Button>
        </form>
      </Card>
    </div>
  );
}
