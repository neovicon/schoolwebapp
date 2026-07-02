import type { AuthUser } from '../types/user.types';
import { UserRole } from '../types/user.types';

// ─── Permission ───────────────────────────────────────────────────────────────

export const Permission = {
  // General
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',

  // Users / Staff
  MANAGE_USERS: 'MANAGE_USERS',

  // Schools (Super Admin only)
  VIEW_SCHOOLS: 'VIEW_SCHOOLS',
  MANAGE_SCHOOLS: 'MANAGE_SCHOOLS',

  // Students
  VIEW_STUDENTS: 'VIEW_STUDENTS',
  MANAGE_STUDENTS: 'MANAGE_STUDENTS',

  // Teachers
  VIEW_TEACHERS: 'VIEW_TEACHERS',
  MANAGE_TEACHERS: 'MANAGE_TEACHERS',

  // Classes
  VIEW_CLASSES: 'VIEW_CLASSES',
  MANAGE_CLASSES: 'MANAGE_CLASSES',

  // Courses
  VIEW_COURSES: 'VIEW_COURSES',
  MANAGE_COURSES: 'MANAGE_COURSES',

  // Admissions
  VIEW_ADMISSIONS: 'VIEW_ADMISSIONS',
  MANAGE_ADMISSIONS: 'MANAGE_ADMISSIONS',

  // Reports & Analytics
  VIEW_REPORTS: 'VIEW_REPORTS',
  VIEW_ANALYTICS: 'VIEW_ANALYTICS',

  // Settings
  MANAGE_SETTINGS: 'MANAGE_SETTINGS',

  // Attendance
  VIEW_ATTENDANCE: 'VIEW_ATTENDANCE',
  MANAGE_ATTENDANCE: 'MANAGE_ATTENDANCE',

  // Assignments
  VIEW_ASSIGNMENTS: 'VIEW_ASSIGNMENTS',
  MANAGE_ASSIGNMENTS: 'MANAGE_ASSIGNMENTS',

  // Student-specific
  VIEW_NOTES: 'VIEW_NOTES',
  MANAGE_NOTES: 'MANAGE_NOTES',
  VIEW_RESULTS: 'VIEW_RESULTS',
  VIEW_EXAMS: 'VIEW_EXAMS',

  // Profile
  VIEW_PROFILE: 'VIEW_PROFILE',
  EDIT_PROFILE: 'EDIT_PROFILE',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

// ─── Role → Permission Map ────────────────────────────────────────────────────

export const ROLE_PERMISSIONS: Record<UserRole, Set<Permission>> = {
  [UserRole.SUPER_ADMIN]: new Set([
    Permission.VIEW_DASHBOARD,
    Permission.MANAGE_USERS,
    Permission.VIEW_SCHOOLS,
    Permission.MANAGE_SCHOOLS,
    Permission.VIEW_STUDENTS,
    Permission.MANAGE_STUDENTS,
    Permission.VIEW_TEACHERS,
    Permission.MANAGE_TEACHERS,
    Permission.VIEW_CLASSES,
    Permission.MANAGE_CLASSES,
    Permission.VIEW_COURSES,
    Permission.MANAGE_COURSES,
    Permission.VIEW_ADMISSIONS,
    Permission.MANAGE_ADMISSIONS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_ATTENDANCE,
    Permission.MANAGE_ATTENDANCE,
    Permission.VIEW_ASSIGNMENTS,
    Permission.MANAGE_ASSIGNMENTS,
    Permission.VIEW_NOTES,
    Permission.MANAGE_NOTES,
    Permission.VIEW_RESULTS,
    Permission.VIEW_EXAMS,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
  ]),

  [UserRole.SCHOOL_ADMIN]: new Set([
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_STUDENTS,
    Permission.MANAGE_STUDENTS,
    Permission.VIEW_TEACHERS,
    Permission.MANAGE_TEACHERS,
    Permission.VIEW_CLASSES,
    Permission.MANAGE_CLASSES,
    Permission.VIEW_COURSES,
    Permission.MANAGE_COURSES,
    Permission.VIEW_ADMISSIONS,
    Permission.MANAGE_ADMISSIONS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_ATTENDANCE,
    Permission.MANAGE_ATTENDANCE,
    Permission.VIEW_ASSIGNMENTS,
    Permission.MANAGE_ASSIGNMENTS,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
  ]),

  [UserRole.TEACHER]: new Set([
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_STUDENTS,
    Permission.VIEW_CLASSES,
    Permission.VIEW_COURSES,
    Permission.VIEW_ATTENDANCE,
    Permission.MANAGE_ATTENDANCE,
    Permission.VIEW_ASSIGNMENTS,
    Permission.MANAGE_ASSIGNMENTS,
    Permission.VIEW_NOTES,
    Permission.MANAGE_NOTES,
    Permission.VIEW_EXAMS,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
  ]),

  [UserRole.STUDENT]: new Set([
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_COURSES,
    Permission.VIEW_ATTENDANCE,
    Permission.VIEW_ASSIGNMENTS,
    Permission.VIEW_NOTES,
    Permission.VIEW_RESULTS,
    Permission.VIEW_EXAMS,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
  ]),
};

// ─── Permission Helpers ───────────────────────────────────────────────────────

/**
 * Returns true if the user has the specified permission.
 */
export function hasPermission(user: AuthUser | null, permission: Permission): boolean {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role]?.has(permission) ?? false;
}

/**
 * Returns true if the user has at least one of the provided permissions.
 */
export function hasAnyPermission(user: AuthUser | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.some((p) => hasPermission(user, p));
}

/**
 * Returns true if the user has ALL of the provided permissions.
 */
export function hasAllPermissions(user: AuthUser | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.every((p) => hasPermission(user, p));
}
