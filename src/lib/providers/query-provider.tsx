/**
 * Resources
 */
import { queryClient } from '@/lib/react-query/query-client'

/**
 * Dependencies
 */
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

/**
 * TS Types
 */
interface QueryProviderProps {
  children: ReactNode
}

/**
 * Cached data
 */
const cachedMe = localStorage.getItem('authMe')
if (cachedMe) queryClient.setQueryData(['authMe'], JSON.parse(cachedMe))

/**
 * React declaration
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
