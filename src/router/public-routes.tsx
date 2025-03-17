/**
 * Resources
 */
import { Navigate, RouteObject } from 'react-router-dom'

/**
 * Pages
 */
import { ResetPassword, ResetPasswordRequest, SignIn, SignUp } from '@/pages/public/auth'
import { NotFound } from '@/pages/public/errors/not-found'

/**
 * Components
 */
import { PublicOnlyRoute } from '@/router/routes-guard'

/**
 * Routes
 */
export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicOnlyRoute />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Navigate to="/signin" replace />
      },
      {
        path: 'signin',
        element: <SignIn />
      },
      {
        path: 'signup',
        element: <SignUp />
      },
      {
        path: 'reset-password-request',
        element: <ResetPasswordRequest />
      },
      {
        path: 'reset-password',
        element: <ResetPassword />
      }
      // Add other public routes here
    ]
  }
]
