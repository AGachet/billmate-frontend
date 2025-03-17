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
export const signUpPayloadSchema = z.object({
  firstname: z.string().min(1, { message: tAuth('fields.tk_firstNameError_') }),
  lastname: z.string().min(1, { message: tAuth('fields.tk_lastNameError_') }),
  email: z.string().email({ message: tAuth('fields.tk_emailError_') }),
  password: z
    .string()
    .min(6, { message: tAuth('fields.tk_passwordMinLength_') })
    .max(40)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
      message: tAuth('fields.tk_passwordComplexityError_')
    })
})

export const signUpResponseSchema = z.object({
  message: z.string(),
  confirmationToken: z.string().optional()
})

export type SignUpPayloadDto = z.infer<typeof signUpPayloadSchema>
export type SignUpResponseDto = z.infer<typeof signUpResponseSchema>

/**
 * Hook declaration
 */
export const useSignUp = () => {
  const mutation = useMutation({
    mutationFn: async (data: SignUpPayloadDto) => {
      // Schema validation
      signUpPayloadSchema.parse(data)

      // Send data to the API
      const response = await apiClient.post<SignUpResponseDto>('/auth/signup', data)
      return signUpResponseSchema.parse(response)
    },
    onError: (error) => {
      console.error(tAuth('errors.tk_signupError_'), error)
    }
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
    submit: mutation.mutate,
    submitAsync: mutation.mutateAsync
  }
}
