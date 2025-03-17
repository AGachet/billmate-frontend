/**
 * Resources
 */
import { RouteObject } from 'react-router-dom'

/**
 * Pages
 */
import { Dashboard } from '@/pages/private/dashboard'

/**
 * Components
 */
import { LayoutLogged } from '@/components/layout/layout-logged'
import { PrivateOnlyRoute } from '@/router/routes-guard'

/**
 * Routes
 */
export const privateRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PrivateOnlyRoute />,
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
