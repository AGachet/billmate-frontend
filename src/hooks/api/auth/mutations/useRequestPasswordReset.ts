/**
 * Resources
 */
import { useMutation } from '@tanstack/react-query'
import i18next from 'i18next'
import { z } from 'zod'

/**
 * Dependencies
 */
import apiClient from '@/lib/api/client'

// Translation
const tAuth = (key: string) => i18next.t(key, { ns: 'auth' })

/**
 * Schemas & DTOs
 */
export const requestPasswordResetPayloadSchema = z.object({
  email: z.string().email({ message: tAuth('fields.tk_emailError_') })
})

export const requestPasswordResetResponseSchema = z.object({
  message: z.string(),
  resetToken: z.string().optional()
})

export type RequestPasswordResetPayloadDto = z.infer<typeof requestPasswordResetPayloadSchema>
export type RequestPasswordResetResponseDto = z.infer<typeof requestPasswordResetResponseSchema>

/**
 * Hook declaration
 */
export const useRequestPasswordReset = () => {
  const mutation = useMutation({
    mutationFn: async (data: RequestPasswordResetPayloadDto) => {
      // Schema validation
      requestPasswordResetPayloadSchema.parse(data)

      // Send data to the API
      const response = await apiClient.post<RequestPasswordResetResponseDto>('/auth/request-password-reset', data)
      return requestPasswordResetResponseSchema.parse(response)
    },
    onError: (error) => {
      console.error(tAuth('errors.tk_requestPasswordResetError_'), error)
    }
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
    submit: mutation.mutate,
    submitAsync: mutation.mutateAsync
  }
}
