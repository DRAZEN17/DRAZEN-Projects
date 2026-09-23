import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { AuthTabs } from '@/components/auth/AuthTabs';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useMockBackend } from '@/lib/mockBackend';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signup, settings } = useMockBackend();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!settings.allowRegistrations) {
    return (
      <div>
        <Helmet>
          <title>Create account — NDEPMP</title>
        </Helmet>
        <h1 className="font-display text-2xl font-semibold">Citizen portal</h1>
        <AuthTabs active="register" />
        <p className="text-sm text-ink-muted">
          New registrations are temporarily paused by an administrator. Try the demo login options on the sign-in
          page instead.
        </p>
      </div>
    );
  }

  const onSubmit = (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      signup(data);
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Create account — NDEPMP</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">Citizen portal</h1>
      <p className="mt-1 text-sm text-ink-muted">Sign in to continue, or create a free account.</p>

      <AuthTabs active="register" />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Full name" id="fullName" error={errors.fullName?.message} {...register('fullName', { required: 'Required' })} />
        <Input label="Phone number" type="tel" id="phone" {...register('phone')} />
        <Input label="Email" type="email" id="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
        <Input
          label="Password"
          type="password"
          id="password"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'At least 6 characters' },
          })}
        />
        <Input
          label="Confirm password"
          type="password"
          id="confirmPassword"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            validate: (value) => value === watch('password') || 'Passwords don\u2019t match',
          })}
        />

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </div>
  );
}
