import { useState, useCallback, useEffect, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { session } from './session';
import { authApi } from '../api/auth.api';
import type { AuthUser, LoginCredentials } from '../types/user.types';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true until session is restored
  const [error, setError] = useState<string | null>(null);
  const unauthorizedListenerRef = useRef<(() => void) | null>(null);

  // ── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    const restoreSession = () => {
      try {
        const saved = session.get();
        if (!saved) return;

        // If the session is expired and rememberMe was false, clear it
        if (session.isExpired(saved) && !saved.rememberMe) {
          session.clear();
          return;
        }

        setUser(saved.user);
      } catch {
        session.clear();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ── Listen for 401 events from the Axios interceptor ─────────────────────
  useEffect(() => {
    const handler = () => {
      session.clear();
      setUser(null);
      setError('Your session has expired. Please log in again.');
    };

    window.addEventListener('auth:unauthorized', handler);
    unauthorizedListenerRef.current = handler;

    return () => window.removeEventListener('auth:unauthorized', handler);
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (credentials: LoginCredentials) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);

      session.set({
        user: response.user,
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
        expiresAt: response.tokens.expiresAt,
        rememberMe: credentials.rememberMe ?? false,
      });

      setUser(response.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
      throw err; // re-throw so LoginPage can react
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } finally {
      session.clear();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  // ── Clear error ───────────────────────────────────────────────────────────
  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
