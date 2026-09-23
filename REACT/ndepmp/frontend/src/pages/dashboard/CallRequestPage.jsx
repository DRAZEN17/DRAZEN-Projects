import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { PhoneCall, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useMockBackend } from '@/lib/mockBackend';

export default function CallRequestPage() {
  const { currentUser, requestCall } = useMockBackend();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { phone: currentUser?.phone || '' },
  });
  const [sent, setSent] = useState(false);

  const onSubmit = (data) => {
    requestCall(data);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-md text-center">
        <Helmet>
          <title>Request a call — NDEPMP</title>
        </Helmet>
        <Card>
          <CheckCircle2 className="mx-auto text-emerald-600" size={28} />
          <h1 className="mt-3 font-display text-lg font-semibold">Callback requested</h1>
          <p className="mt-1 text-sm text-ink-muted">We&apos;ll call you at the time you selected.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <Helmet>
        <title>Request a call — NDEPMP</title>
      </Helmet>
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold">
        <PhoneCall size={20} className="text-brand" /> Request a callback
      </h1>
      <p className="mt-1 text-sm text-ink-muted">Prefer to talk it through? Leave your number and a good time.</p>

      <Card className="mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Phone number" type="tel" id="phone" error={errors.phone?.message} {...register('phone', { required: 'Required' })} />
          <Input label="Preferred time" id="preferredTime" placeholder="e.g. Weekday afternoons" {...register('preferredTime')} />
          <Button type="submit" variant="primary" className="w-full">
            Request callback
          </Button>
        </form>
      </Card>
    </div>
  );
}
