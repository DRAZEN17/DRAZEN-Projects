import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

const links = [
  { to: '/admin',              label: 'Overview',       end: true },
  { to: '/admin/projects',     label: 'Projects' },
  { to: '/admin/blogs',        label: 'Blogs' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/messages',     label: 'Messages' },
  { to: '/admin/analytics',    label: 'Analytics' },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  return (
    <div className="pt-32 max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-[220px_1fr] gap-10">
      <aside className="glass p-5 h-fit sticky top-28">
        <div className="text-xs font-mono text-muted">Signed in</div>
        <div className="font-display text-lg">{user?.name}</div>
        <div className="text-xs text-muted mt-1 font-mono">localStorage mode</div>
        <nav className="mt-6 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to} to={l.to} end={l.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm transition ${isActive ? 'bg-white/10 text-white' : 'text-muted hover:text-white hover:bg-white/5'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={async () => { await logout(); navigate('/login'); }}
          className="mt-6 text-sm text-muted hover:text-neon-magenta"
        >
          Logout
        </button>
      </aside>
      <main className="pb-20 min-w-0"><Outlet /></main>
    </div>
  );
}
