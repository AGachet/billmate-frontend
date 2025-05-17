/**
 * Dependencies
 */
import { useQuery } from '@tanstack/react-query'
import { LinkIcon, MailIcon, MoreVertical, SearchIcon, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Components
 */
import { Avatar, AvatarFallback } from '@/components/ui/shadcn/avatar'
import { Badge } from '@/components/ui/shadcn/badge'
import { Button } from '@/components/ui/shadcn/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { Checkbox } from '@/components/ui/shadcn/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/shadcn/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/shadcn/dropdown-menu'
import { Input } from '@/components/ui/shadcn/input'
import { Label } from '@/components/ui/shadcn/label'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/shadcn/pagination'
import { ScrollArea } from '@/components/ui/shadcn/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/shadcn/select'
import { Skeleton } from '@/components/ui/shadcn/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/shadcn/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/shadcn/tooltip'

/**
 * Services & Utils
 */
import { formatDate, getInitials } from '@/lib/utils'

/**
 * Types
 */
import { AccountUser, PaginatedUsersResponse, UserOrderBy } from '@/types/account.types'

/**
 * Mocks
 */
import { getUsersForAccount, inviteUser, mockEntities, mockRoles } from '@/mocks/accountUsers'

/**
 * Constants
 */
const ENTITIES_ICON_BG = 'bg-[#E5D8FF]'
const ENTITIES_ICON_COLOR = 'text-[#A259FF]'
const ROLES_ICON_BG = 'bg-[#FFE6A7]'
const ROLES_ICON_COLOR = 'text-[#B45309]'

/**
 * React declaration
 */
export function AccountUsers() {
  const { t: tAccount } = useTranslation('account')
  const { t: tCommon } = useTranslation('common')
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined)
  const [roleFilter] = useState<number[]>([]) // Nous n'utilisons pas le setter pour l'instant
  const [orderBy, setOrderBy] = useState<UserOrderBy>(UserOrderBy.CREATED_AT)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10) // Nous gardons une référence à cette valeur mais ne la modifions pas pour l'instant

  // Get users with pagination and filters
  const {
    data: usersData,
    isLoading,
    refetch
  } = useQuery<PaginatedUsersResponse>({
    queryKey: ['account-users', searchTerm, activeFilter, roleFilter, orderBy, currentPage, pageSize],
    queryFn: () =>
      getUsersForAccount({
        search: searchTerm,
        isActive: activeFilter,
        roleIds: roleFilter.length > 0 ? roleFilter : undefined,
        orderBy,
        page: currentPage,
        limit: pageSize
      })
  })

  // Form state for invitation
  const [inviteForm, setInviteForm] = useState({
    email: '',
    firstname: '',
    lastname: '',
    roleIds: [] as number[],
    entityIds: [] as string[]
  })

  // Handle form changes
  const handleInviteFormChange = (field: string, value: string | number[] | string[]) => {
    setInviteForm((prev) => ({ ...prev, [field]: value }))
  }

  // Handle role toggle in invitation form
  const handleRoleToggle = (roleId: number) => {
    setInviteForm((prev) => {
      const newRoleIds = [...prev.roleIds]
      if (newRoleIds.includes(roleId)) {
        return { ...prev, roleIds: newRoleIds.filter((id) => id !== roleId) }
      } else {
        return { ...prev, roleIds: [...newRoleIds, roleId] }
      }
    })
  }

  // Handle entity toggle in invitation form
  const handleEntityToggle = (entityId: string) => {
    setInviteForm((prev) => {
      const newEntityIds = [...prev.entityIds]
      if (newEntityIds.includes(entityId)) {
        return { ...prev, entityIds: newEntityIds.filter((id) => id !== entityId) }
      } else {
        return { ...prev, entityIds: [...newEntityIds, entityId] }
      }
    })
  }

  // Handle invitation submission
  const handleInviteSubmit = async () => {
    try {
      await inviteUser(inviteForm)
      setIsInviteDialogOpen(false)
      setInviteForm({
        email: '',
        firstname: '',
        lastname: '',
        roleIds: [],
        entityIds: []
      })
      refetch()
    } catch (error) {
      console.error('Failed to invite user:', error)
    }
  }

  // Get full name
  const getFullName = (user: AccountUser) => {
    if (!user.people) return tCommon('status.tk_unknown_')
    return [user.people.firstname, user.people.lastname].filter(Boolean).join(' ') || user.email
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{tAccount('users.tk_title_')}</h2>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              {tAccount('users.tk_invite-new-user_')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{tAccount('users.tk_invite-new-user_')}</DialogTitle>
              <DialogDescription>{tAccount('users.tk_invite-description_')}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">{tCommon('user.tk_email_')}</Label>
                <Input id="email" type="email" value={inviteForm.email} onChange={(e) => handleInviteFormChange('email', e.target.value)} placeholder="user@example.com" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstname">{tCommon('user.tk_firstName_')}</Label>
                  <Input id="firstname" value={inviteForm.firstname} onChange={(e) => handleInviteFormChange('firstname', e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastname">{tCommon('user.tk_lastName_')}</Label>
                  <Input id="lastname" value={inviteForm.lastname} onChange={(e) => handleInviteFormChange('lastname', e.target.value)} />
                </div>
              </div>

              {/* Roles selection */}
              <div>
                <Label>{tCommon('items.tk_roles_')}</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {mockRoles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <Checkbox id={`role-${role.id}`} checked={inviteForm.roleIds.includes(role.id)} onCheckedChange={() => handleRoleToggle(role.id)} />
                      <Label htmlFor={`role-${role.id}`} className="cursor-pointer">
                        {role.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Entities selection */}
              <div>
                <Label>{tCommon('items.tk_entities_')}</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {mockEntities.map((entity) => (
                    <div key={entity.id} className="flex items-center space-x-2">
                      <Checkbox id={`entity-${entity.id}`} checked={inviteForm.entityIds.includes(entity.id)} onCheckedChange={() => handleEntityToggle(entity.id)} />
                      <Label htmlFor={`entity-${entity.id}`} className="cursor-pointer">
                        {entity.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                {tCommon('actions.tk_cancel_')}
              </Button>
              <Button onClick={handleInviteSubmit} disabled={!inviteForm.email}>
                <MailIcon className="mr-2 h-4 w-4" />
                {tCommon('actions.tk_send_')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{tCommon('filters.tk_title_')}</CardTitle>
          <CardDescription>{tAccount('users.tk_filters-description_')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder={tAccount('users.tk_filters-search-placeholder_')} className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select
              value={activeFilter === undefined ? 'all' : activeFilter.toString()}
              onValueChange={(value) => {
                if (value === 'all') setActiveFilter(undefined)
                else setActiveFilter(value === 'true')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={tCommon('filters.tk_status_')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tCommon('other.tk_all_')}</SelectItem>
                <SelectItem value="true">{tCommon('status.tk_active_')}</SelectItem>
                <SelectItem value="false">{tCommon('status.tk_inactive_')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={orderBy} onValueChange={(value: string) => setOrderBy(value as UserOrderBy)}>
              <SelectTrigger>
                <SelectValue placeholder={tCommon('filters.tk_sort-by_')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserOrderBy.CREATED_AT}>{tCommon('date.tk_created-at_')}</SelectItem>
                <SelectItem value={UserOrderBy.UPDATED_AT}>{tCommon('date.tk_updated-at_')}</SelectItem>
                <SelectItem value={UserOrderBy.NAME}>{tCommon('user.tk_firstName_')}</SelectItem>
                <SelectItem value={UserOrderBy.LASTNAME}>{tCommon('user.tk_lastName_')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">{tCommon('items.tk_users_')}</TableHead>
                  <TableHead>{tCommon('status.tk_title_')}</TableHead>
                  <TableHead>{tCommon('items.tk_entities_')}</TableHead>
                  <TableHead>{tCommon('items.tk_roles_')}</TableHead>
                  <TableHead>{tCommon('date.tk_created-at_')}</TableHead>
                  <TableHead className="w-16 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        {Array(6)
                          .fill(0)
                          .map((_, cellIndex) => (
                            <TableCell key={`cell-${index}-${cellIndex}`}>
                              <Skeleton className="h-6 w-full" />
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                ) : usersData?.items.length ? (
                  usersData.items.map((user) => (
                    <TableRow key={user.id}>
                      {/* Column user */}
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <Avatar className="mt-1 h-8 w-8 bg-muted">
                            <AvatarFallback>{user.people ? getInitials(user.people.firstname, user.people.lastname) : 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <p className="font-medium">{getFullName(user)}</p>
                              {user.isDirectlyLinked && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="cursor-pointer rounded-md p-1 transition-colors hover:bg-primary/10">
                                        <LinkIcon size={12} className="text-primary" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{tAccount('users.tk_direct-account-link_')}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Column status */}
                      <TableCell>
                        {user.isActive ? (
                          <Badge variant="success">{tCommon('status.tk_active_')}</Badge>
                        ) : (
                          <Badge variant="secondary" className="opacity-50">
                            {tCommon('status.tk_inactive_')}
                          </Badge>
                        )}
                      </TableCell>

                      {/* Column entities */}
                      <TableCell className="px-2 py-2">
                        <div className="flex flex-wrap gap-1">
                          {user.entityIds.length > 0 ? (
                            user.entityIds.map((entityId) => {
                              const entity = mockEntities.find((e) => e.id === entityId)
                              return (
                                <Badge key={entityId} variant="outline" className={`${ENTITIES_ICON_BG} gap-1 border-none text-xs`}>
                                  <span className={ENTITIES_ICON_COLOR}>{entity?.name}</span>
                                </Badge>
                              )
                            })
                          ) : (
                            <Badge variant="secondary" className="opacity-50">
                              {tAccount('users.tk_table-no-entities_')}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Column roles */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <Badge key={role.id} variant="outline" className={`${ROLES_ICON_BG} gap-1 border-none text-xs`}>
                              <span className={ROLES_ICON_COLOR}>{role.name}</span>
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      {/* Column created at */}
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="p-0 pr-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{tCommon('actions.tk_title_')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>{tCommon('actions.tk_edit_')}</DropdownMenuItem>
                            <DropdownMenuItem className={user.isActive ? 'text-destructive' : 'text-green-600'}>
                              {user.isActive ? tCommon('actions.tk_deactivate_') : tCommon('actions.tk_activate_')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {tAccount('users.tk_table-no-users_')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex items-center justify-between py-4">
          <div className="flex gap-1 text-sm text-muted-foreground">
            {usersData && (
              <>
                {tCommon('status.tk_showing_')} <strong>{Math.min((currentPage - 1) * pageSize + 1, usersData.totalItems)}</strong> {tCommon('other.tk_to_')}{' '}
                <strong>{Math.min(currentPage * pageSize, usersData.totalItems)}</strong> {tCommon('other.tk_of_')} <strong>{usersData.totalItems}</strong> {tCommon('items.tk_users_')}
              </>
            )}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <PaginationPrevious className="h-4 w-4" />
                </Button>
              </PaginationItem>

              {usersData &&
                [...Array(Math.min(5, Math.ceil(usersData.totalItems / pageSize)))].map((_, i) => {
                  const pageNumber = i + 1
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink isActive={currentPage === pageNumber} onClick={() => setCurrentPage(pageNumber)}>
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => (usersData ? (p < Math.ceil(usersData.totalItems / pageSize) ? p + 1 : p) : p))}
                  disabled={!usersData || currentPage >= Math.ceil(usersData.totalItems / pageSize)}
                >
                  <PaginationNext className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  )
}
