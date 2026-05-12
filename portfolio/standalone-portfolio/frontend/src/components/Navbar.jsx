import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore.js';

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all ${scrolled ? 'py-3' : 'py-5'}`}>
      <nav className={`mx-auto max-w-7xl px-6 md:px-10 flex items-center justify-between ${scrolled ? 'glass !rounded-full !py-2 !px-4' : ''}`}>
        <Link to="/" className="font-display font-semibold tracking-tight text-lg">
          <span className="neon-text">/</span>dev<span className="text-neon-cyan">.</span>
        </Link>
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) =>
                `relative font-medium transition ${isActive ? 'text-white' : 'text-muted hover:text-white'}`}>
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-neon-cyan to-neon-magenta" />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="hidden md:flex items-center gap-3">
          {user && isAdmin() && <Link to="/admin" className="text-sm text-neon-cyan hover:underline">Admin</Link>}
          {!user && <Link to="/login" className="text-sm text-muted hover:text-white">Login</Link>}
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className="block h-0.5 w-6 bg-white mb-1.5" />
          <span className="block h-0.5 w-6 bg-white mb-1.5" />
          <span className="block h-0.5 w-6 bg-white" />
        </button>
      </nav>
      {open && (
        <div className="md:hidden mx-6 mt-3 glass p-6">
          <ul className="flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.to}><NavLink to={l.to} className="text-lg">{l.label}</NavLink></li>
            ))}
            {user && isAdmin() && <li><Link to="/admin" className="text-neon-cyan">Admin</Link></li>}
            {!user && <li><Link to="/login">Login</Link></li>}
          </ul>
        </div>
      )}
    </header>
  );
}
