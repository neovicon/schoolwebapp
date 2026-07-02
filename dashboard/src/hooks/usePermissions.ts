import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../permissions/permissions';
import type { Permission } from '../permissions/permissions';

/**
 * Provides permission helpers scoped to the current authenticated user.
 * All permission logic is centralized in permissions/permissions.ts.
 */
export function usePermissions() {
  const { user } = useAuth();

  /** Returns true if the user has the specified permission. */
  const can = useCallback(
    (permission: Permission): boolean => hasPermission(user, permission),
    [user],
  );

  /** Returns true if the user has at least one of the given permissions. */
  const canAny = useCallback(
    (permissions: Permission[]): boolean => hasAnyPermission(user, permissions),
    [user],
  );

  /** Returns true if the user has ALL of the given permissions. */
  const canAll = useCallback(
    (permissions: Permission[]): boolean => hasAllPermissions(user, permissions),
    [user],
  );

  return { can, canAny, canAll, user };
}
