import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

export function AuthTabs({ active }) {
  return (
    <div className="mb-8 grid grid-cols-2 rounded-xl bg-canvas-alt p-1 text-sm font-medium">
      <Link
        to="/login"
        className={cn('rounded-lg py-2 text-center transition', active === 'login' ? 'bg-canvas shadow-sm' : 'text-ink-muted')}
      >
        Sign in
      </Link>
      <Link
        to="/register"
        className={cn('rounded-lg py-2 text-center transition', active === 'register' ? 'bg-canvas shadow-sm' : 'text-ink-muted')}
      >
        Create account
      </Link>
    </div>
  );
}
