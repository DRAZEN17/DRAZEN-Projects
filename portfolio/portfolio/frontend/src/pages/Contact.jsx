import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { messagesService } from '../services/content.js';
import MagneticButton from '../components/MagneticButton.jsx';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // If EmailJS is configured in env, send an email directly from the frontend
      const svc = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const tpl = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY; // sometimes called public key
      if (svc && tpl && key) {
        const templateParams = {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        };
        console.log('EmailJS send', { svc, tpl, key, templateParams });
        try {
          await emailjs.send(svc, tpl, templateParams, key);
        } catch (ejErr) {
          console.error('EmailJS error', ejErr);
          // rethrow so outer catch shows error to user
          throw new Error(ejErr?.text || ejErr?.message || 'EmailJS send failed');
        }
      }
      // Always persist the message to backend
      await messagesService.send(form);
      toast.success('Message sent — talk soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send.');
    } finally { setLoading(false); }
  };

  return (
    <section className="section pt-40">
      <Helmet><title>Contact · Portfolio</title></Helmet>
      <p className="eyebrow">Contact</p>
      <h1 className="h1 mt-4">Let's build something.</h1>
      <form onSubmit={submit} className="mt-12 grid md:grid-cols-2 gap-6 max-w-3xl">
        <Input label="Name" value={form.name} onChange={update('name')} required />
        <Input label="Email" type="email" value={form.email} onChange={update('email')} required />
        <div className="md:col-span-2"><Input label="Subject" value={form.subject} onChange={update('subject')} /></div>
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">Message</label>
          <textarea value={form.message} onChange={update('message')} required rows={6}
                    className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:border-neon-cyan/60 focus:outline-none transition" />
        </div>
        <div className="md:col-span-2">
          <MagneticButton type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send message'}</MagneticButton>
        </div>
      </form>
    </section>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-muted mb-2">{label}</span>
      <input {...props} className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:border-neon-cyan/60 focus:outline-none transition" />
    </label>
  );
}
