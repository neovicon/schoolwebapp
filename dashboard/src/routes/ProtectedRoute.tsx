import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLE_DEFAULT_ROUTES } from '../permissions/roles';

/**
 * Wraps any route tree that requires authentication.
 *
 * Session restoration is handled by <AppLoadingScreen> at the App root,
 * so by the time this renders, `isLoading` is always false.
 *
 * - Not authenticated → redirect to /login, preserving the intended route in state
 * - Authenticated at root "/" → redirect to the role-appropriate dashboard
 * - Otherwise → render <Outlet />
 */
export function ProtectedRoute() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user lands at root "/", send them to their role dashboard
  if (location.pathname === '/' && user) {
    return <Navigate to={ROLE_DEFAULT_ROUTES[user.role]} replace />;
  }

  return <Outlet />;
}
