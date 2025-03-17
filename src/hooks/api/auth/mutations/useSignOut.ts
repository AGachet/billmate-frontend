/**
 * Resources
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import i18next from 'i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

/**
 * Dependencies
 */
import apiClient from '@/lib/api/client'

// Translation
const tAuth = (key: string) => i18next.t(key, { ns: 'auth' })

/**
 * Types
 */
import type { MeResponseDto } from '@/hooks/api/auth/queries/useMe'

/**
 * Schemas & DTOs
 */
export const signOutPayloadSchema = z.object({
  userId: z.string()
})

export const signOutResponseSchema = z.object({
  message: z.string()
})

export type SignOutPayloadDto = z.infer<typeof signOutPayloadSchema>
export type SignOutResponseDto = z.infer<typeof signOutResponseSchema>

/**
 * Hook declaration
 */
export const useSignOut = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Get user data from cache
  const me = queryClient.getQueryData<MeResponseDto>(['authMe'])
  if (!me?.userId) throw new Error('User not found in cache')

  const mutation = useMutation({
    mutationFn: async () => {
      // Schema validation
      const payload: SignOutPayloadDto = {
        userId: me.userId
      }
      signOutPayloadSchema.parse(payload)

      // Send data to the API
      const response = await apiClient.post<SignOutResponseDto>('/auth/signout', payload)
      return signOutResponseSchema.parse(response)
    },
    onSuccess: () => {
      // Invalidate and reset auth status
      queryClient.setQueryData(['authMe'], null)
      localStorage.removeItem('authMe')

      // Redirect to signin page
      navigate('/signin')
    },
    onError: (error) => {
      console.error(tAuth('errors.tk_signoutError_'), error)
    }
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
    submit: mutation.mutate,
    submitAsync: mutation.mutateAsync
  }
}
