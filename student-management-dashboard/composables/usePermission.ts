/**
 * Centralised permission composable.
 *
 * Usage:
 *   const { can, canAny, canAll, isAdmin, isStaff } = usePermission()
 *
 *   can('ROLE_ADMIN')                        // single role
 *   canAny(['ROLE_ADMIN', 'ROLE_STAFF'])     // at least one
 *   canAll(['ROLE_ADMIN', 'ROLE_STAFF'])     // all of them
 *
 * In templates:
 *   <button v-if="can('ROLE_ADMIN')">Delete</button>
 *   <Can roles="ROLE_ADMIN"><button>Delete</button></Can>
 */

export const usePermission = () => {
  const auth = useAuthStore()

  const can = (role: string): boolean =>
    auth.user?.role === role

  const canAny = (roles: string[]): boolean => roles.some((r) => can(r))
  const canAll = (roles: string[]): boolean => roles.every((r) => can(r))

  const isAdmin = (): boolean => can('ROLE_ADMIN')
  
  const isStaff = (): boolean => can('ROLE_STAFF') || can('ROLE_ADMIN')

  return {
    can,
    canAny,
    canAll,
    isAdmin,
    isStaff,
  }
}
