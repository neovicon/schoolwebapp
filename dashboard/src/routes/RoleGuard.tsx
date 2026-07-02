import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/user.types';

interface RoleGuardProps {
  /** Roles allowed to access this route subtree */
  allowedRoles: UserRole[];
  /** Where to redirect if the user's role is not allowed. Defaults to /unauthorized */
  redirectTo?: string;
}

/**
 * Must be nested inside <ProtectedRoute> (so isLoading is already resolved).
 * - If the user's role is in allowedRoles → renders <Outlet />
 * - Otherwise → redirects to `redirectTo` (default: /unauthorized)
 */
export function RoleGuard({ allowedRoles, redirectTo = '/unauthorized' }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
