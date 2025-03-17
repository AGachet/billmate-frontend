/**
 * Resources
 */
import { useMutation } from '@tanstack/react-query'
import i18next from 'i18next'
import { z } from 'zod'

/**
 * Dependencies
 */
import { useMe } from '@/hooks/api/auth/queries/useMe'
import apiClient from '@/lib/api/client'

// Translation
const tAuth = (key: string) => i18next.t(key, { ns: 'auth' })

/**
 * Schemas & DTOs
 */
export const signInPayloadSchema = z.object({
  email: z.string().email({ message: tAuth('fields.tk_emailError_') }),
  password: z.string().min(1, { message: tAuth('fields.tk_passwordError_') }),
  confirmAccountToken: z.string().optional()
})

export const signInResponseSchema = z.object({
  userId: z.string()
})

export type SignInPayloadDto = z.infer<typeof signInPayloadSchema>
export type SignInResponseDto = z.infer<typeof signInResponseSchema>

/**
 * Hook declaration
 */
export const useSignIn = () => {
  const me = useMe()

  const mutation = useMutation({
    mutationFn: async (data: SignInPayloadDto) => {
      // Schema validation
      signInPayloadSchema.parse(data)

      // Send data to the API
      const response = await apiClient.post<SignInResponseDto>('/auth/signin', data)
      return signInResponseSchema.parse(response)
    },
    onSuccess: async () => {
      // Fetch user profile
      const authMe = await me.refetch()
      localStorage.setItem('authMe', JSON.stringify(authMe.data))
    },
    onError: (error) => {
      console.error(tAuth('errors.tk_signinError_'), error)
    }
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
    submit: mutation.mutate,
    submitAsync: mutation.mutateAsync
  }
}
