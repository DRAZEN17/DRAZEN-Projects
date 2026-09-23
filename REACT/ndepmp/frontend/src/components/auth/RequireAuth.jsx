import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useMockBackend } from '@/lib/mockBackend';

export function RequireAuth({ roles }) {
  const { currentUser } = useMockBackend();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (roles && !roles.includes(currentUser.role)) {
    const home = currentUser.role === 'admin' ? '/admin' : currentUser.role === 'field_agent' ? '/agent' : '/dashboard';
    return <Navigate to={home} replace />;
  }
  return <Outlet />;
}
