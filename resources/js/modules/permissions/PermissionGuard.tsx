import React from 'react'
import usePermissionCheck from './usePermissionCheck'

interface Props {
  requiredAction: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const PermissionGuard = ({ requiredAction, children, fallback = null }: Props) => {
  const { can } = usePermissionCheck()

  // Render fallback content if the user doesn't have permission
  if (!can(requiredAction)) {
    // eslint-disable-next-line sonarjs/jsx-no-useless-fragment
    return <>{fallback}</>
  }

  // eslint-disable-next-line sonarjs/jsx-no-useless-fragment
  return <>{children}</>
}

export default React.memo(PermissionGuard)
