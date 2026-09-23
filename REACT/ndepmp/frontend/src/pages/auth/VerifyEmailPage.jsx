import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useMockBackend } from '@/lib/mockBackend';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { accounts, verifyEmail, resendVerification } = useMockBackend();
  const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email, code: '' } });
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resent, setResent] = useState(false);

  const onSubmit = (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      verifyEmail(data.email, data.code);
      navigate('/login');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = () => {
    resendVerification(email);
    setResent(true);
  };

  return (
    <div>
      <Helmet>
        <title>Verify email — NDEPMP</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">Verify your email</h1>
      <p className="mt-1 text-sm text-ink-muted">Enter the code we sent to your inbox.</p>

      {account?.verificationCode && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-brand/20 bg-brand/5 p-3 text-xs text-ink-muted">
          <Sparkles size={14} className="mt-0.5 shrink-0 text-brand" />
          <span>
            {"Demo mode \u2014 there's no real backend to send mail, so here's the code directly: "}
            <span className="font-mono font-semibold text-brand">{account.verificationCode}</span>
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <Input label="Email" type="email" id="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
        <Input
          label="Verification code"
          id="code"
          placeholder="123456"
          error={errors.code?.message}
          {...register('code', { required: 'Code is required' })}
        />

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
          {submitting ? 'Verifying…' : 'Verify email'}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-ink-muted">
        {resent ? (
          <span>New code generated above.</span>
        ) : (
          <button type="button" onClick={handleResend} className="font-medium text-brand hover:underline">
            Resend code
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-ink-muted">
        <Link to="/login" className="font-medium text-brand hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
