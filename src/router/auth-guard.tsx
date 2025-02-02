/**
 * Resources
 */
import { Navigate, Outlet } from 'react-router-dom'
import { auth } from '@/lib/auth'

/**
 * methods
 */
export const AuthGuard = () => {
  if (!auth.isAuthenticated()) return <Navigate to="/login" replace />
  return <Outlet />
}
