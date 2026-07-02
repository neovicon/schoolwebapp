import { UserRole } from '../types/user.types';
import type { AuthUser, LoginCredentials, ForgotPasswordPayload } from '../types/user.types';
import type { AuthResponse } from '../types/auth.types';

// ─── Mock User Database ───────────────────────────────────────────────────────
// Replace this block when connecting to Strapi:
//   POST /api/auth/local  { identifier, password }  → { jwt, user }

const MOCK_USERS: Array<AuthUser & { password: string }> = [
  {
    id: 'u-001',
    name: 'Alex Rivera',
    email: 'admin@school.edu',
    password: 'admin123',
    role: UserRole.SUPER_ADMIN,
    schoolId: undefined,
    schoolName: undefined,
  },
  {
    id: 'u-002',
    name: 'Morgan Chen',
    email: 'schooladmin@academy.edu',
    password: 'school123',
    role: UserRole.SCHOOL_ADMIN,
    schoolId: 's-001',
    schoolName: 'Westfield Academy',
  },
  {
    id: 'u-003',
    name: 'Jordan Blake',
    email: 'teacher@academy.edu',
    password: 'teacher123',
    role: UserRole.TEACHER,
    schoolId: 's-001',
    schoolName: 'Westfield Academy',
  },
  {
    id: 'u-004',
    name: 'Sarah Connor',
    email: 'student@academy.edu',
    password: 'student123',
    role: UserRole.STUDENT,
    schoolId: 's-001',
    schoolName: 'Westfield Academy',
  },
];

// ─── Simulate network delay ───────────────────────────────────────────────────

const mockDelay = (ms = 900) => new Promise<void>((res) => setTimeout(res, ms));

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * Authenticates a user.
   * Strapi replacement: POST /api/auth/local
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await mockDelay();

    const { email, password } = credentials;
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );

    if (!found) {
      throw new Error('Invalid email or password. Please try again.');
    }

    // Strip password before returning
    const { password: _pw, ...user } = found;

    return {
      user,
      tokens: {
        accessToken: `mock-jwt-${user.id}-${Date.now()}`,
        refreshToken: `mock-refresh-${user.id}`,
        expiresAt: Date.now() + 1000 * 60 * 60 * 8, // 8 hours
      },
    };
  },

  /**
   * Sends a password-reset email.
   * Strapi replacement: POST /api/auth/forgot-password
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await mockDelay(1200);

    const exists = MOCK_USERS.some(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase(),
    );

    if (!exists) {
      // Do NOT reveal that the email doesn't exist (security best practice)
      // Silently succeed
    }
    // In production: throw on network error but always return OK to the UI
  },

  /**
   * Refreshes the access token.
   * Strapi replacement: POST /api/token/refresh
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    await mockDelay(300);
    return { accessToken: `mock-jwt-refreshed-${Date.now()}-${refreshToken.slice(-6)}` };
  },

  /**
   * Invalidates the current session server-side.
   * Strapi has no server-side logout for JWT; this is a stub for future use.
   */
  async logout(): Promise<void> {
    await mockDelay(200);
  },
};
