/**
 * Resources
 */
import { useQuery } from '@tanstack/react-query'
import i18next from 'i18next'
import { z } from 'zod'

import apiClient from '@/lib/api/client'

// Translation
const tAuth = (key: string) => i18next.t(key, { ns: 'auth' })

/**
 * Schemas & DTOs
 */
export const meResponseSchema = z.object({
  userId: z.string(),
  firstname: z.string().nullable(),
  lastname: z.string().nullable(),
  email: z.string(),
  roles: z.array(z.string()),
  modules: z.array(z.string()),
  permissions: z.array(z.string()),
  createdAt: z.string()
})

export type MeResponseDto = z.infer<typeof meResponseSchema>

/**
 * Hook declaration
 */
export const useMe = () =>
  useQuery({
    queryKey: ['authMe'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<MeResponseDto>('/auth/me')
        return meResponseSchema.parse(response)
      } catch (error) {
        console.error(tAuth('errors.tk_fetchMeError_'), error)
        throw error
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: false
  })
