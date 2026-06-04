import { useLocation, Navigate } from 'react-router-dom';

// Minimal client-side secret-path guard.
// Set `VITE_ADMIN_PREFIX` at build/deploy time (example: /admin-SECRET123).
// When set, the guard blocks access to wrapped routes unless the current
// pathname starts with the prefix. This is a client-side-only, low-security
// fallback for static hosting.
export default function SecretGuard({ children }) {
  const prefix = import.meta.env.VITE_ADMIN_PREFIX || '';
  const { pathname } = useLocation();
  if (!prefix) return children;
  // Normalize prefix to ensure it starts with '/'
  const norm = prefix.startsWith('/') ? prefix : `/${prefix}`;
  if (pathname.startsWith(norm)) return children;
  return <Navigate to="/" replace />;
}
