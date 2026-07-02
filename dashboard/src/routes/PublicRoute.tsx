import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLE_DEFAULT_ROUTES } from '../permissions/roles';
import { AppLoadingScreen } from '../components/auth/AppLoadingScreen';

/**
 * Wraps public-only routes (login, forgot-password).
 * - While session is restoring → shows loading screen
 * - If already authenticated → redirects to the role's default home
 * - Otherwise → renders the public page
 */
export function PublicRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <AppLoadingScreen />;
  }

  if (isAuthenticated && user) {
    const destination = ROLE_DEFAULT_ROUTES[user.role];
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}
