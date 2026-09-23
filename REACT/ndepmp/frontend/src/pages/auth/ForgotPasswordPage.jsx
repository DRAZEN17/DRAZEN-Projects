import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useMockBackend } from '@/lib/mockBackend';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { requestPasswordReset, resetPassword } = useMockBackend();
  const requestForm = useForm();
  const resetForm = useForm();
  const [stage, setStage] = useState('request'); // request | reset
  const [email, setEmail] = useState('');
  const [demoCode, setDemoCode] = useState('');
  const [serverError, setServerError] = useState('');

  const onRequest = (data) => {
    const code = requestPasswordReset(data.email);
    setEmail(data.email);
    setDemoCode(code || '');
    setStage('reset');
  };

  const onReset = (data) => {
    setServerError('');
    try {
      resetPassword(email, data.code, data.newPassword);
      navigate('/login');
    } catch (err) {
      setServerError(err.message);
    }
  };

  if (stage === 'reset') {
    return (
      <div>
        <Helmet>
          <title>Reset password — NDEPMP</title>
        </Helmet>
        <h1 className="font-display text-2xl font-semibold">Enter your reset code</h1>
        <p className="mt-1 text-sm text-ink-muted">If that email is registered, a code was generated for it.</p>

        {demoCode && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-brand/20 bg-brand/5 p-3 text-xs text-ink-muted">
            <Sparkles size={14} className="mt-0.5 shrink-0 text-brand" />
            <span>
              {'Demo mode \u2014 no real email is sent, so here\u2019s the code: '}
              <span className="font-mono font-semibold text-brand">{demoCode}</span>
            </span>
          </div>
        )}

        <form onSubmit={resetForm.handleSubmit(onReset)} className="mt-6 flex flex-col gap-4">
          <Input label="Reset code" id="code" error={resetForm.formState.errors.code?.message} {...resetForm.register('code', { required: 'Code is required' })} />
          <Input
            label="New password"
            type="password"
            id="newPassword"
            error={resetForm.formState.errors.newPassword?.message}
            {...resetForm.register('newPassword', { required: 'Required', minLength: { value: 6, message: 'At least 6 characters' } })}
          />
          {serverError && <p className="text-sm text-red-500">{serverError}</p>}
          <Button type="submit" variant="primary" className="w-full">
            Reset password
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Forgot password — NDEPMP</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">Reset your password</h1>
      <p className="mt-1 text-sm text-ink-muted">We&apos;ll generate a code to reset it.</p>

      <form onSubmit={requestForm.handleSubmit(onRequest)} className="mt-8 flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          id="email"
          error={requestForm.formState.errors.email?.message}
          {...requestForm.register('email', { required: 'Email is required' })}
        />
        <Button type="submit" variant="primary" className="w-full">
          Send reset code
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        <Link to="/login" className="font-medium text-brand hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
