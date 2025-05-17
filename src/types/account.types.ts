/**
 * Account Types
 */

export enum UserOrderBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
  LASTNAME = 'lastname'
}

export interface AccountUser {
  id: string
  email: string
  isActive: boolean
  people: {
    id: string
    firstname: string | null
    lastname: string | null
  } | null
  roles: {
    id: number
    name: string
  }[]
  entityIds: string[]
  isDirectlyLinked: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PaginatedUsersResponse {
  items: AccountUser[]
  totalItems: number
  page: number
  limit: number
  totalPages: number
}

export interface FetchAccountUsersParams {
  search?: string
  roleIds?: number[]
  entityIds?: string[]
  isActive?: boolean
  orderBy?: UserOrderBy
  page?: number
  limit?: number
  includeDirectUsers?: boolean
}
