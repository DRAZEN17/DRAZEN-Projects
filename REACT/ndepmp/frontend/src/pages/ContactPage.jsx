import { Helmet } from 'react-helmet-async';
import { Phone, Mail, Clock3, Timer } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PageHero } from '@/components/layout/PageHero';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const contactMethods = [
  { icon: Phone, label: 'Support line', value: '0800 123 4567 (toll free)' },
  { icon: Mail, label: 'Email', value: 'support@ndepmp.example' },
  { icon: Timer, label: 'Response time', value: 'Within 2 business days' },
  { icon: Clock3, label: 'Hours', value: 'Monday to Friday, 08:00 – 17:00 WAT' },
];

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = () => {
    // Wires to the backend's /support/enquiries endpoint once it exists.
  };

  return (
    <>
      <Helmet>
        <title>Contact — NDEPMP</title>
      </Helmet>
      <PageHero
        eyebrow="Contact"
        title="Talk to the support desk"
        description="For registration issues, billing disputes, and account access, reach out through any channel below."
      />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-4">
            {contactMethods.map(({ icon: Icon, label, value }) => (
              <Card key={label} className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon size={16} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
                  <p className="mt-0.5 text-sm font-medium">{value}</p>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <h2 className="font-display text-lg font-semibold">Send an enquiry</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full name" id="name" error={errors.name?.message} {...register('name', { required: 'Required' })} />
                <Input label="Email address" type="email" id="email" error={errors.email?.message} {...register('email', { required: 'Required' })} />
              </div>
              <Input label="Subject" id="subject" error={errors.subject?.message} {...register('subject', { required: 'Required' })} />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-sm font-medium text-ink-muted">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="rounded-xl border border-border bg-canvas p-4 text-sm text-ink transition focus:border-brand"
                  {...register('message', { required: true })}
                />
              </div>
              <Button type="submit" variant="primary" className="self-start">
                Submit enquiry
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </>
  );
}
