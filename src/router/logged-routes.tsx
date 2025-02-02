/**
 * Resources
 */
import { RouteObject } from 'react-router-dom'
import { AuthGuard } from '@/router/auth-guard'

/**
 * Components
 */
import { LayoutLogged } from '@/components/layout/layout-logged'

/**
 * Pages
 */
import { Dashboard } from '@/pages/logged/dashboard'

/**
 * Routes
 */
export const loggedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        element: <LayoutLogged />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />
          }
          // Add other protected routes here
        ]
      }
    ]
  }
]
