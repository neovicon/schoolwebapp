import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import type { AuthContextValue } from '../types/auth.types';

/**
 * Returns the auth context value.
 * Must be called inside <AuthProvider>.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth() must be used inside <AuthProvider>');
  }
  return ctx;
}
