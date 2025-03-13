/**
 * Resources
 */
import { auth } from '@/lib/auth'
import { Navigate, Outlet } from 'react-router-dom'

/**
 * methods
 */
export const AuthGuard = () => {
  if (!auth.isAuthenticated()) return <Navigate to="/signin" replace />
  return <Outlet />
}
