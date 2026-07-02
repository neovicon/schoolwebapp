import { UserRole } from '../types/user.types';

// ─── Display names ────────────────────────────────────────────────────────────

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.SCHOOL_ADMIN]: 'School Admin',
  [UserRole.TEACHER]: 'Teacher',
  [UserRole.STUDENT]: 'Student',
};

// ─── Hierarchy (higher index = more privileged) ───────────────────────────────

export const ROLE_HIERARCHY: UserRole[] = [
  UserRole.STUDENT,
  UserRole.TEACHER,
  UserRole.SCHOOL_ADMIN,
  UserRole.SUPER_ADMIN,
];

/**
 * Returns true if `role` is at least as privileged as `minimumRole`.
 */
export function isRoleAtLeast(role: UserRole, minimumRole: UserRole): boolean {
  return ROLE_HIERARCHY.indexOf(role) >= ROLE_HIERARCHY.indexOf(minimumRole);
}

/**
 * Returns true if the role belongs to the admin group (School Admin or Super Admin).
 */
export function isAdminRole(role: UserRole): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.SCHOOL_ADMIN;
}

/**
 * Returns the default landing path after login for each role.
 */
export const ROLE_DEFAULT_ROUTES: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: '/admin/dashboard',
  [UserRole.SCHOOL_ADMIN]: '/admin/dashboard',
  [UserRole.TEACHER]: '/teacher/dashboard',
  [UserRole.STUDENT]: '/student/dashboard',
};
