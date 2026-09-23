import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Zap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useMockBackend } from '@/lib/mockBackend';

const links = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/coverage', label: 'Coverage' },
  { href: '/tariffs', label: 'Tariffs' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

const roleHome = { admin: '/admin', field_agent: '/agent', citizen: '/dashboard' };

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useMockBackend();
  const homeHref = currentUser ? roleHome[currentUser.role] || '/dashboard' : null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-canvas">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-base font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <Zap size={16} />
          </span>
          NDEPMP
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link key={link.href} to={link.href} className="text-sm text-ink-muted transition hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {currentUser ? (
            <Button href={homeHref} variant="primary" size="sm">
              Go to dashboard
            </Button>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                Sign in
              </Button>
              <Button href="/register" variant="primary" size="sm">
                Create account
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-border p-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-canvas-alt"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 border-t border-border pt-3">
            {currentUser ? (
              <Button href={homeHref} variant="primary" size="sm" className="flex-1">
                Go to dashboard
              </Button>
            ) : (
              <>
                <Button href="/login" variant="outline" size="sm" className="flex-1">
                  Sign in
                </Button>
                <Button href="/register" variant="primary" size="sm" className="flex-1">
                  Create account
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
