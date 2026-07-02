// ─── User Role ───────────────────────────────────────────────────────────────

export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// ─── Authenticated User ───────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  /** The school this user belongs to (null for Super Admin) */
  schoolId?: string;
  schoolName?: string;
}

// ─── Auth State ───────────────────────────────────────────────────────────────

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ─── Request Payloads ─────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}
