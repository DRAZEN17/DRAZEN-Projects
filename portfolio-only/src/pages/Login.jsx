import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore.js';
import MagneticButton from '../components/MagneticButton.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      toast.success(`Welcome ${user.name}`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="section pt-40 max-w-md">
      <p className="eyebrow">Admin</p>
      <h1 className="h1 mt-4 text-5xl">Sign in.</h1>
      <form onSubmit={submit} className="mt-10 space-y-5">
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required
               className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:border-neon-cyan/60 outline-none" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required
               className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:border-neon-cyan/60 outline-none" />
        <MagneticButton type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</MagneticButton>
      </form>
    </section>
  );
}
