/**
 * Resources
 */
import { useMutation } from '@tanstack/react-query'
import i18next from 'i18next'
import { z } from 'zod'

/**
 * Dependencies
 */
import { useMe } from '@/hooks/api/auth'
import apiClient from '@/lib/api/client'

// Translation
const tAuth = (key: string) => i18next.t(key, { ns: 'auth' })

/**
 * Schemas & DTOs
 */
export const useAcceptUserInvitationSchema = () => {
  const payload = z.object({
    invitationToken: z.string().min(1, { message: tAuth('fields.tk_invitationTokenRequired_') }),
    password: z.string().min(1, { message: tAuth('fields.tk_passwordRequired_') }),
    firstname: z.string().min(1, { message: tAuth('fields.tk_firstNameError_') }),
    lastname: z.string().min(1, { message: tAuth('fields.tk_lastNameError_') }),
    locale: z
      .string()
      .optional()
      .transform((val) => val?.toUpperCase())
  })

  const response = z.object({
    userId: z.string()
  })

  return { payload, response }
}

export type AcceptUserInvitationPayloadDto = z.infer<ReturnType<typeof useAcceptUserInvitationSchema>['payload']>
export type AcceptUserInvitationResponseDto = z.infer<ReturnType<typeof useAcceptUserInvitationSchema>['response']>

/**
 * Hook declaration
 */
export const useAcceptUserInvitation = () => {
  const me = useMe()
  const schemas = useAcceptUserInvitationSchema()

  const mutation = useMutation({
    mutationFn: async (data: AcceptUserInvitationPayloadDto) => {
      // Schema validation
      schemas.payload.parse(data)

      // Send data to the API
      const response = await apiClient.post<AcceptUserInvitationResponseDto>('/invitations/accept', data)
      return schemas.response.parse(response)
    },
    onSuccess: async () => {
      // Remove guest access
      localStorage.removeItem('guestAccess')

      // Fetch user profile
      await me.refetch()
    },
    onError: (error) => {
      console.error(tAuth('errors.tk_acceptInvitationError_'), error)
    }
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
    submit: mutation.mutate,
    submitAsync: mutation.mutateAsync
  }
}
