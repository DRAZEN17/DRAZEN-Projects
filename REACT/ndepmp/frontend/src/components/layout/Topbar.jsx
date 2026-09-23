import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useMockBackend } from '@/lib/mockBackend';

const roleHome = { admin: '/admin', field_agent: '/agent', citizen: '/dashboard' };

export function Topbar() {
  const navigate = useNavigate();
  const { currentUser, notifications, logout } = useMockBackend();
  const [menuOpen, setMenuOpen] = useState(false);
  const unread = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notificationsHref = currentUser?.role === 'citizen' ? '/dashboard/notifications' : `${roleHome[currentUser?.role] || ''}`;

  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-6">
      <div className="hidden items-center gap-2 rounded-xl border border-border bg-canvas-alt px-3 py-2 text-sm text-ink-muted md:flex md:w-72">
        <Search size={14} />
        <input placeholder="Search properties, meters, bills…" className="w-full bg-transparent outline-none placeholder:text-ink-muted" />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(notificationsHref)}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-muted hover:text-ink"
          aria-label="Notifications"
        >
          <Bell size={16} />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-medium text-white">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
        <ThemeToggle />

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-full border border-border py-1 pl-1 pr-2 hover:bg-canvas-alt"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-medium text-white">
              {(currentUser?.fullName || '?').charAt(0).toUpperCase()}
            </span>
            <ChevronDown size={13} className="text-ink-muted" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-border bg-canvas p-2 shadow-lg">
                <div className="px-2 py-1.5">
                  <p className="truncate text-sm font-medium">{currentUser?.fullName}</p>
                  <p className="truncate text-xs text-ink-muted">{currentUser?.email}</p>
                </div>
                <div className="my-1 h-px bg-border" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-red-500 hover:bg-red-500/10"
                >
                  <LogOut size={14} /> Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
