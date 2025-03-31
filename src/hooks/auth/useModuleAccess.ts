/**
 * Resources
 */
import { useQueryClient } from '@tanstack/react-query'

/**
 * Dependencies
 */
import type { GuestResponseDto, MeResponseDto } from '@/hooks/api/auth'

/**
 * Hook declaration
 */
export const useModuleAccess = () => {
  const queryClient = useQueryClient()
  const me = queryClient.getQueryData<MeResponseDto>(['authMe'])
  const guestAccess = queryClient.getQueryData<GuestResponseDto>(['guestAccess'])

  const hasModuleAccess = (module: string): boolean => {
    return !!me?.modules?.includes(module) || !!guestAccess?.modules?.includes(module)
  }

  const hasPermission = (permission: string): boolean => {
    return !!me?.permissions?.includes(permission) || !!guestAccess?.permissions?.includes(permission)
  }

  return {
    hasModuleAccess,
    hasPermission
  }
}
