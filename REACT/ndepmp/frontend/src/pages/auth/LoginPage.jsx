import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { ShieldCheck } from 'lucide-react';
import { AuthTabs } from '@/components/auth/AuthTabs';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useMockBackend } from '@/lib/mockBackend';

const roleHome = { admin: '/admin', field_agent: '/agent', citizen: '/dashboard' };

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsDemo } = useMockBackend();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const goHome = (account) => {
    const target = location.state?.from && location.state.from !== '/login' ? location.state.from : roleHome[account.role] || '/dashboard';
    navigate(target, { replace: true });
  };

  const onSubmit = (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      const account = login(data.email, data.password);
      goHome(account);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const tryDemo = (role) => {
    const account = loginAsDemo(role);
    if (account) goHome(account);
  };

  return (
    <div>
      <Helmet>
        <title>Sign in — NDEPMP</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">Citizen portal</h1>
      <p className="mt-1 text-sm text-ink-muted">Sign in to continue, or create a free account.</p>

      <AuthTabs active="login" />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Email" type="email" id="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
        <Input
          label="Password"
          type="password"
          id="password"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-ink-muted hover:text-ink">
            Forgot your password?
          </Link>
        </div>

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3 text-xs text-ink-muted">
        <div className="h-px flex-1 bg-border" />
        Explore without an account
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Button variant="outline" size="sm" onClick={() => tryDemo('admin')} type="button">
          <ShieldCheck size={14} /> Continue as demo Admin
        </Button>
        <Button variant="outline" size="sm" onClick={() => tryDemo('field_agent')} type="button">
          <ShieldCheck size={14} /> Continue as demo Field Agent
        </Button>
      </div>
    </div>
  );
}
