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
import { SignIn, SignUp, ResetPasswordRequest, ResetPassword } from '@/pages/public/auth'

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
        element: <Navigate to="/signin" replace />
      },
      {
        path: 'signin',
        element: auth.isAuthenticated() ? <Navigate to="/dashboard" replace /> : <SignIn />
      },
      {
        path: 'signup',
        element: auth.isAuthenticated() ? <Navigate to="/dashboard" replace /> : <SignUp />
      }
      // {
      //   path: 'reset-password-request',
      //   element: auth.isAuthenticated() ? <Navigate to="/dashboard" replace /> : <ResetPasswordRequest />
      // },
      // {
      //   path: 'reset-password',
      //   element: auth.isAuthenticated() ? <Navigate to="/dashboard" replace /> : <ResetPassword />
      // }
      // Add other public routes here
    ]
  }
]
