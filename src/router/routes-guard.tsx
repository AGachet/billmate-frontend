/**
 * Resources
 */
import { Navigate, Outlet } from 'react-router-dom'

/**
 * Dependencies
 */
import { useIsSessionActive } from '@/hooks/auth/session'

/**
 * Declarations
 */
export const PrivateOnlyRoute = () => {
  const { isSessionActive } = useIsSessionActive()

  if (!isSessionActive) return <Navigate to="/signin" replace />

  return <Outlet />
}

export const PublicOnlyRoute = () => {
  const { isSessionActive } = useIsSessionActive()

  if (isSessionActive) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
