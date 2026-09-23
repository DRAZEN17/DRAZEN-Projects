import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useMockBackend } from '@/lib/mockBackend';

export default function ProfilePage() {
  const { currentUser, updateProfile } = useMockBackend();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: currentUser?.fullName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
    },
  });
  const [saved, setSaved] = useState(false);

  const onSubmit = (data) => {
    updateProfile({ fullName: data.fullName, phone: data.phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <Helmet>
        <title>Profile — NDEPMP</title>
      </Helmet>
      <h1 className="mb-6 font-display text-2xl font-semibold">Profile</h1>

      <Card className="max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Full name" id="fullName" {...register('fullName')} />
          <Input label="Email" type="email" id="email" disabled {...register('email')} />
          <Input label="Phone number" type="tel" id="phone" {...register('phone')} />
          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" className="self-start">
              Save changes
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                <CheckCircle2 size={14} /> Saved
              </span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
