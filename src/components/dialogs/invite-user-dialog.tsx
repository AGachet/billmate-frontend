/**
 * Ressources
 */
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Mail } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

/**
 * Components
 */
import { Button } from '@/components/ui/shadcn/button'
import { Checkbox } from '@/components/ui/shadcn/checkbox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/shadcn/command'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/shadcn/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/shadcn/form'
import { Input } from '@/components/ui/shadcn/input'
import { ScrollArea } from '@/components/ui/shadcn/scroll-area'

/**
 * Hooks
 */
import { useInviteUser } from '@/hooks/api/accounts/mutations/useInviteUserCreate'
import { useAccountEntities } from '@/hooks/api/accounts/queries/useAccountEntities'
import { useAccountRoles } from '@/hooks/api/accounts/queries/useAccountRoles'
import { useInvitedUsers } from '@/hooks/api/invitations/queries/useInvitedUsers'

/**
 * Types
 */
import type { InviteUserPayloadDto } from '@/hooks/api/accounts/mutations/useInviteUserCreate'
import type { MeResponseDto } from '@/hooks/api/auth'

const formSchema = z
  .object({
    email: z.string().email(),
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    roleIds: z.array(z.number()).min(1),
    entityIds: z.array(z.string()),
    isDirectlyLinked: z.boolean().default(false),
    accountIds: z.array(z.string()).default([])
  })
  .refine(
    (data) => {
      // At least one of the two fields must be filled
      return data.isDirectlyLinked || data.entityIds.length > 0
    },
    {
      message: 'Vous devez sélectionner au moins une entité ou rattacher directement au compte',
      path: ['entityIds']
    }
  )

type FormValues = z.infer<typeof formSchema>

type InviteUserDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteUserDialog({ isOpen, onOpenChange }: InviteUserDialogProps) {
  const queryClient = useQueryClient()
  const [searchRoles, setSearchRoles] = useState('')
  const [searchEntities, setSearchEntities] = useState('')
  const { t: tAccount } = useTranslation('account')
  const { t: tCommon } = useTranslation('common')

  // Get accountId from authMe
  const authMe = queryClient.getQueryData<MeResponseDto>(['authMe'])!
  const activeAccount = authMe.accounts.find((acc) => acc.isActive)
  const accountId = activeAccount?.id

  // Get roles and entities
  const { data: rolesData } = useAccountRoles(accountId as string, {
    search: searchRoles,
    limit: 10
  })

  const { data: entitiesData } = useAccountEntities(accountId as string, {
    search: searchEntities,
    limit: 10
  })

  // Invite user mutation
  const inviteUser = useInviteUser()

  const { refetch: refreshInvitations } = useInvitedUsers()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      firstname: '',
      lastname: '',
      roleIds: [],
      entityIds: [],
      isDirectlyLinked: false,
      accountIds: []
    }
  })

  // Watch isDirectlyLinked to update accountIds
  const isDirectlyLinked = form.watch('isDirectlyLinked')
  React.useEffect(() => {
    if (isDirectlyLinked && accountId) {
      form.setValue('accountIds', [accountId])
    } else {
      form.setValue('accountIds', [])
    }
  }, [isDirectlyLinked, accountId, form])

  const handleSubmit = async (data: FormValues) => {
    const finalPayload: InviteUserPayloadDto = {
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      roleIds: data.roleIds,
      entityIds: data.entityIds,
      accountIds: data.accountIds,
      locale: navigator.language.split('-')[0].toUpperCase() as 'FR' | 'EN'
    }

    try {
      await inviteUser.submitAsync(finalPayload)
      refreshInvitations()
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to invite user:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{tAccount('users.tk_invite-new-user_')}</DialogTitle>
          <DialogDescription>{tAccount('users.tk_invite-description_')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tCommon('user.tk_email_')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{tCommon('user.tk_firstName_')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{tCommon('user.tk_lastName_')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="roleIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tCommon('items.tk_roles_')}</FormLabel>
                  <FormControl>
                    <Command className="rounded-md border">
                      <CommandInput placeholder={tCommon('filters.tk_search-placeholder_')} value={searchRoles} onValueChange={setSearchRoles} />
                      <CommandEmpty className="flex h-[153px] items-center justify-center text-muted-foreground">{tAccount('roles.tk_table-no-roles_')}</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className={`${rolesData && rolesData.items.length > 0 ? 'h-[145px]' : ''}`}>
                          {rolesData?.items
                            .filter((role) => role.name.toLowerCase() !== 'guest')
                            .map((role) => (
                              <CommandItem
                                key={role.id}
                                onSelect={() => {
                                  const newRoleIds = field.value.includes(role.id) ? field.value.filter((id) => id !== role.id) : [...field.value, role.id]
                                  field.onChange(newRoleIds)
                                }}
                                className="flex cursor-pointer items-center justify-between"
                              >
                                <div className="flex flex-1 flex-col">
                                  <span className="font-medium capitalize">{role.name}</span>
                                  {role.description && <span className="text-xs text-muted-foreground">{role.description}</span>}
                                </div>
                                {field.value.includes(role.id) && <Checkbox checked className="ml-2" />}
                              </CommandItem>
                            ))}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isDirectlyLinked"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{tAccount('users.tk_direct-account-link_')}</FormLabel>
                    <p className="text-sm text-muted-foreground">{tAccount('users.tk_direct-account-link-description_')}</p>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="entityIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tCommon('items.tk_entities_')}</FormLabel>
                  <FormControl>
                    <Command className="rounded-md border">
                      <CommandInput placeholder={tCommon('filters.tk_search-placeholder_')} value={searchEntities} onValueChange={setSearchEntities} />
                      <CommandEmpty className="flex h-[153px] items-center justify-center text-muted-foreground">{tAccount('entities.tk_table-no-entities_')}</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className={`${entitiesData && entitiesData.items.length > 0 ? 'h-[145px]' : ''}`}>
                          {entitiesData?.items.map((entity) => (
                            <CommandItem
                              key={entity.id}
                              onSelect={() => {
                                const newEntityIds = field.value.includes(entity.id) ? field.value.filter((id) => id !== entity.id) : [...field.value, entity.id]
                                field.onChange(newEntityIds)
                              }}
                              className="flex cursor-pointer items-center justify-between"
                            >
                              <div className="flex flex-1 flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium capitalize">{entity.organization?.name}</span>
                                  <span className="text-xs text-muted-foreground">{entity.name}</span>
                                </div>
                                {entity.description && <span className="text-xs text-muted-foreground">{entity.description}</span>}
                              </div>
                              {field.value.includes(entity.id) && <Checkbox checked className="ml-2" />}
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={inviteUser.isLoading}>
                <Mail />
                {inviteUser.isLoading ? tCommon('actions.tk_loading_') : tAccount('users.tk_invite-new-user_')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
