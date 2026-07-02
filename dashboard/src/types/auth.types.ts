import type { AuthUser } from './user.types';

// ─── Token Shape ──────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  /** Strapi uses JWT; refresh token will be introduced when needed */
  refreshToken?: string;
  expiresAt?: number; // unix ms timestamp
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

// ─── Session stored in localStorage ──────────────────────────────────────────

export interface SessionData {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  rememberMe: boolean;
}

// ─── Auth Context Contract ────────────────────────────────────────────────────

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: import('./user.types').LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
