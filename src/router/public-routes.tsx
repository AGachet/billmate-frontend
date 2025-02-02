/**
 * Resources
 */
import { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { auth } from '@/lib/auth'

/**
 * Pages
 */
import { NotFound } from '@/pages/public/not-found'
import { Login } from '@/pages/public/login'

/**
 * Routes
 */
export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Navigate to="/login" replace />
      },
      {
        path: 'login',
        element: auth.isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />
      }
      // Add other public routes here
    ]
  }
]
