/**
 * Resources
 */
import { useQuery } from '@tanstack/react-query'
import i18next from 'i18next'
import { z } from 'zod'

import apiClient from '@/lib/api/client'

// Translation
const tAccounts = (key: string) => i18next.t(key, { ns: 'accounts' })

/**
 * Schemas & DTOs
 */
export const useAccountSchema = () => {
  const peopleSchema = z.object({
    id: z.string(),
    firstname: z.string().nullable(),
    lastname: z.string().nullable()
  })

  const organizationSchema = z.object({
    id: z.string(),
    name: z.string()
  })

  const entitySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    isActive: z.boolean(),
    organization: organizationSchema.nullable(),
    createdAt: z.string(),
    updatedAt: z.string()
  })

  const userRoleSchema = z.object({
    id: z.number(),
    name: z.string()
  })

  const accountUserSchema = z.object({
    id: z.string(),
    email: z.string(),
    isActive: z.boolean(),
    people: peopleSchema,
    roles: z.array(userRoleSchema),
    entityIds: z.array(z.string()),
    isDirectlyLinked: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string()
  })

  const accountRoleSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    isActive: z.boolean(),
    isGlobal: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string()
  })

  const collectionResponseSchema = <T extends z.ZodType>(schema: T) =>
    z.object({
      count: z.number(),
      values: z.array(schema)
    })

  const response = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    users: collectionResponseSchema(accountUserSchema),
    entities: collectionResponseSchema(entitySchema),
    roles: collectionResponseSchema(accountRoleSchema)
  })

  return { response }
}

export type AccountResponseDto = z.infer<ReturnType<typeof useAccountSchema>['response']>

/**
 * Hook declaration
 */
export const useAccount = (accountId: string) => {
  const schemas = useAccountSchema()

  return useQuery({
    queryKey: ['account', accountId],
    queryFn: async () => {
      try {
        const response = await apiClient.get<AccountResponseDto>(`/accounts/${accountId}`)
        return schemas.response.parse(response)
      } catch (error) {
        console.error(tAccounts('errors.tk_fetchAccountError_'), error)
        throw error
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!accountId
  })
}
