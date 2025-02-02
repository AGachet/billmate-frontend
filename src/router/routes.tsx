/**
 * Resources
 */
import { createBrowserRouter } from 'react-router-dom'

/**
 * Routes
 */
import { publicRoutes } from './public-routes'
import { loggedRoutes } from './logged-routes'

/**
 * Router
 */
export const router = createBrowserRouter([...publicRoutes, ...loggedRoutes])
