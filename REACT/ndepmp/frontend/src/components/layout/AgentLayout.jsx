import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Zap, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useMockBackend } from '@/lib/mockBackend';

export function AgentLayout() {
  const navigate = useNavigate();
  const { currentUser, logout } = useMockBackend();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-canvas px-4">
        <Link to="/agent" className="flex items-center gap-2 font-display font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <Zap size={16} />
          </span>
          <span>
            NDEPMP <span className="text-xs font-normal text-ink-muted">Field Agent</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-ink-muted sm:inline">{currentUser?.fullName}</span>
          <ThemeToggle />
          <button onClick={handleLogout} className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-muted hover:text-ink" aria-label="Log out">
            <LogOut size={15} />
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
