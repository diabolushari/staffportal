import { usePage } from '@inertiajs/react'
import { useCallback } from 'react'
import { PageProps } from '@/types'
import { UserRole } from './permission-types'

/**
 * Hook to check if the current user has permission to perform a specific action
 */
export function usePermissionCheck() {
  const { auth } = usePage<PageProps>().props
  const userRole: UserRole | null = auth.role

  /**
   * Check if the user can perform the specified action
   * @param action The action to check permission for
   * @returns Boolean indicating whether the user can perform the action
   */
  const can = useCallback(
    (action: string): boolean => {
      // If no role is assigned or no user is logged in, deny access
      if (!userRole) {
        return false
      }

      // If user is admin, allow all actions
      if (userRole.is_admin) {
        return true
      }

      // Check if the action is in the allowed actions list
      return userRole.actions.some((allowedAction) => {
        return allowedAction.action === action
      })
    },
    [userRole]
  )

  return { can }
}

export default usePermissionCheck
