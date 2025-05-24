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
const tAccounts = (key: string) => i18next.t(key, { ns: 'accounts' })

/**
 * Schemas & DTOs
 */
export const useInviteUserSchema = () => {
  const payload = z.object({
    email: z
      .string()
      .min(1, { message: tAccounts('fields.tk_emailRequired_') })
      .email({ message: tAccounts('fields.tk_emailError_') })
      .max(100),
    firstname: z.string().max(30).optional(),
    lastname: z.string().max(30).optional(),
    roleIds: z.array(z.number()).optional(),
    accountIds: z.array(z.string()).optional(),
    entityIds: z.array(z.string()).optional(),
    locale: z.enum(['FR', 'EN']).default(navigator.language.split('-')[0].toUpperCase() as 'FR' | 'EN')
  })

  const response = z.object({
    message: z.string(),
    invitationToken: z.string().optional()
  })

  return {
    payload,
    response
  }
}

export type InviteUserPayloadDto = z.infer<ReturnType<typeof useInviteUserSchema>['payload']>
export type InviteUserResponseDto = z.infer<ReturnType<typeof useInviteUserSchema>['response']>

/**
 * Hook declaration
 */
export const useInviteUser = () => {
  const schemas = useInviteUserSchema()

  const mutation = useMutation({
    mutationFn: async (data: InviteUserPayloadDto) => {
      // Schema validation
      schemas.payload.parse(data)

      // Send data to the API
      const response = await apiClient.post<InviteUserResponseDto>('/invitations', data)
      return schemas.response.parse(response)
    },
    onError: (error) => {
      console.error(tAccounts('errors.tk_inviteUserError_'), error)
    }
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
    submit: mutation.mutate,
    submitAsync: mutation.mutateAsync
  }
}
