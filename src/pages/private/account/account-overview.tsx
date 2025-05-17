/**
 * Resources
 */
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

/**
 * Dependencies
 */
import { useAccount } from '@/hooks/api/accounts'
import { useSignOut } from '@/hooks/api/auth'

/**
 * Components
 */
import { Badge } from '@/components/ui/shadcn/badge'
import { Button } from '@/components/ui/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { Skeleton } from '@/components/ui/shadcn/skeleton'
import { Building2, Check, Copy, Plus, ShieldCheck, UserPlus, Users } from 'lucide-react'

/**
 * Types
 */
import type { AccountResponseDto } from '@/hooks/api/accounts/queries/useAccount'
import type { MeResponseDto } from '@/hooks/api/auth'
type AccountDto = MeResponseDto['accounts'][0]
type UserDto = AccountResponseDto['users']['values'][0]
type EntityDto = AccountResponseDto['entities']['values'][0]
type RoleDto = AccountResponseDto['roles']['values'][0]
type UserRoleDto = {
  id: number
  name: string
}

/**
 *  Constants for colors and icons
 */
const ICONS = {
  users: <Users size={28} className="text-[#3B82F6]" />,
  entities: <Building2 size={28} className="text-[#A259FF]" />,
  roles: <ShieldCheck size={28} className="text-[#FBBF24]" />
}

const ICON_BG = {
  users: 'bg-[#D6E6FF]',
  entities: 'bg-[#E5D8FF]',
  roles: 'bg-[#FFE6A7]'
}

/**
 * Reusable component for the section header with icon
 */
type SectionHeaderProps = {
  icon?: React.ReactNode
  iconBg?: string
  title: string
  description?: string
  cta?: React.ReactNode
}

function SectionHeader({ icon, iconBg, title, description, cta }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        {icon && <div className={`flex h-12 w-12 items-center justify-center rounded-md ${iconBg}`}>{icon}</div>}
        <div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </div>
      {cta}
    </div>
  )
}

/**
 * Component to copy an ID with visual feedback
 */
function CopyAccountIdButton({ accountId }: { accountId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(accountId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button onClick={handleCopy} className="ml-1 rounded p-1 transition hover:bg-accent" title="Copier l'ID" type="button">
      {copied ? <Check className="text-green-600" size={16} /> : <Copy size={16} />}
    </button>
  )
}

/**
 * Component to copy an ID with visual feedback
 */
type AccountListProps = {
  accounts: AccountDto[]
  account: AccountResponseDto
  tAccount: (key: string) => string
  tCommon: (key: string) => string
}

function AccountList({ accounts, account, tAccount, tCommon }: AccountListProps) {
  return (
    <div className="flex flex-col gap-4">
      {accounts.map((acc) => (
        <div key={acc.id} className="relative flex min-w-0 flex-col gap-2 rounded-md border border-muted bg-muted/50 p-4">
          {/* Badge Active à droite */}
          {acc.isActive && (
            <div className="absolute right-4 top-4">
              <Badge variant="success">{tCommon('status.tk_active_')}</Badge>
            </div>
          )}

          {/* Account Name */}
          <div className="flex flex-col">
            <span className="mb-1 text-xs font-medium text-muted-foreground">{tAccount('overview.accountInfo.tk_account-name_')}</span>
            <span className="truncate text-lg font-bold">{acc.name}</span>
          </div>

          {/* Account ID + bouton copier */}
          <div className="mt-2 flex flex-col">
            <span className="mb-1 text-xs font-medium text-muted-foreground">{tAccount('overview.accountInfo.tk_account-id_')}</span>
            <div className="flex items-center gap-2">
              <span className="select-all rounded border bg-background px-2 py-1 font-mono text-xs">{acc.id}</span>
              <CopyAccountIdButton accountId={acc.id} />
            </div>
          </div>

          {/* Dates du compte actif (useAccount) */}
          {account && acc.isActive && (
            <div className="mt-2 flex flex-col gap-2 md:flex-row">
              <div className="flex flex-1 flex-col">
                <span className="mb-1 text-xs font-medium text-muted-foreground">{tAccount('overview.accountInfo.tk_account-created-at_')}</span>
                <span className="text-xs">{new Date(account.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex flex-1 flex-col">
                <span className="mb-1 text-xs font-medium text-muted-foreground">{tAccount('overview.accountInfo.tk_account-updated-at_')}</span>
                <span className="text-xs">{new Date(account.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Component for the statistics
 */
type StatisticsCardsProps = {
  account: AccountResponseDto
  tCommon: (key: string) => string
}

function StatisticsCards({ account, tCommon }: StatisticsCardsProps) {
  return (
    <div className="flex h-full min-h-[120px] w-full gap-4">
      {/* Users */}
      <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-muted bg-muted/50 p-8">
        <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${ICON_BG.users}`}>
          <Users className="text-[#3B82F6]" size={24} />
        </div>
        <span className="text-2xl font-bold">{account.users.count}</span>
        <span className="mt-1 text-sm text-muted-foreground">{tCommon('items.tk_users_')}</span>
      </div>
      {/* Entities */}
      <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-muted bg-muted/50 p-8">
        <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${ICON_BG.entities}`}>
          <Building2 className="text-[#A259FF]" size={24} />
        </div>
        <span className="text-2xl font-bold">{account.entities.count}</span>
        <span className="mt-1 text-sm text-muted-foreground">{tCommon('items.tk_entities_')}</span>
      </div>
      {/* Roles */}
      <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-muted bg-muted/50 p-8">
        <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${ICON_BG.roles}`}>
          <ShieldCheck className="text-[#FBBF24]" size={24} />
        </div>
        <span className="text-2xl font-bold">{account.roles.count}</span>
        <span className="mt-1 text-sm text-muted-foreground">{tCommon('items.tk_roles_')}</span>
      </div>
    </div>
  )
}

/**
 * Component for the list of recent users
 */
type RecentUsersProps = {
  users: UserDto[]
  tAccount: (key: string) => string
}

function RecentUsers({ users, tAccount }: RecentUsersProps) {
  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-md border border-dashed border-gray-300/50 p-6">
        <Users className="text-muted-foreground opacity-40" size={18} />
        <span className="text-sm text-muted-foreground opacity-50">{tAccount('overview.recentUsers.tk_no-users_')}</span>
      </div>
    )
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id} className="flex items-center justify-between rounded-md border border-muted bg-muted/50 p-4">
          <div className="flex items-center gap-4">
            <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-lg">
              <span className="flex h-full w-full items-center justify-center rounded-lg bg-gray-200">
                {user.people?.firstname?.[0] || ''}
                {user.people?.lastname?.[0] || ''}
              </span>
            </span>
            <div>
              <span className="font-medium">
                {user.people?.firstname} {user.people?.lastname}
              </span>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {user.roles.slice(0, 3).map((role: UserRoleDto) => (
              <Badge key={role.id} variant="outline" className="px-2 py-1 text-xs capitalize">
                {role.name}
              </Badge>
            ))}
            {user.roles.length > 3 && <span className="text-xs text-muted-foreground">...</span>}
          </div>
        </li>
      ))}
    </ul>
  )
}

/**
 * Component for the list of recent entities
 */
type RecentEntitiesProps = {
  entities: EntityDto[]
  tAccount: (key: string) => string
  tCommon: (key: string) => string
}

function RecentEntities({ entities, tAccount, tCommon }: RecentEntitiesProps) {
  if (entities.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-md border border-dashed border-gray-300/50 p-6">
        <Building2 className="text-muted-foreground opacity-40" size={18} />
        <span className="text-sm text-muted-foreground opacity-50">{tAccount('overview.recentEntities.tk_no-entity_')}</span>
      </div>
    )
  }

  return (
    <ul>
      {entities.map((entity) => (
        <li key={entity.id} className="flex items-center justify-between py-1">
          <div>
            <span className="font-medium">{entity.name}</span>
            <div className="text-xs text-muted-foreground">{entity.organization?.name}</div>
          </div>
          {entity.isActive && <Badge variant="default">{tCommon('status.tk_active_')}</Badge>}
        </li>
      ))}
    </ul>
  )
}

/**
 * Component for the list of roles
 */
type RecentRolesProps = {
  roles: RoleDto[]
  tCommon: (key: string) => string
}

function RecentRoles({ roles, tCommon }: RecentRolesProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {roles.map((role) => (
        <div key={role.id} className="flex flex-col gap-2 rounded-md border border-muted bg-muted/50 p-4">
          <div className="mb-1 flex items-center gap-2">
            <ShieldCheck className="text-primary" size={18} />
            <span className="font-semibold capitalize">{role.name}</span>
            {role.isGlobal && <Badge variant="outline">{tCommon('status.tk_global_')}</Badge>}
            {role.isActive && <Badge variant="success">{tCommon('status.tk_active_')}</Badge>}
          </div>
          <div className="text-xs text-muted-foreground">{role.description}</div>
        </div>
      ))}
    </div>
  )
}

/**
 * Main component - Account Overview
 */
export function AccountOverview() {
  const { t: tAccount } = useTranslation('account')
  const { t: tCommon } = useTranslation('common')
  const queryClient = useQueryClient()
  const { submit: signOut } = useSignOut()

  // Get accountId from authMe
  const authMe = queryClient.getQueryData<MeResponseDto>(['authMe'])!
  const activeAccount = authMe.accounts.find((acc) => acc.isActive)
  const accountId = activeAccount?.id

  // Fetch account data
  const { data: account, isLoading, error } = useAccount(accountId as string)

  // Memoized values for display
  const recentUsers = useMemo(() => account?.users.values.slice(0, 5) ?? [], [account])
  const recentEntities = useMemo(() => account?.entities.values.slice(0, 5) ?? [], [account])
  const availableRoles = useMemo(() => account?.roles.values ?? [], [account])

  useEffect(() => {
    if (!accountId) {
      signOut()
    }
  }, [accountId, signOut])

  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (error) return <div className="text-red-500">{tAccount('overview.error')}</div>
  if (!account) return null

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <SectionHeader title={tAccount('overview.accountInfo.tk_title_')} description={tAccount('overview.accountInfo.tk_description_')} />
          </CardHeader>
          <CardContent>
            <AccountList accounts={authMe.accounts} account={account} tAccount={tAccount} tCommon={tCommon} />
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="flex flex-col">
          <CardHeader>
            <SectionHeader title={tAccount('overview.statistics.tk_title_')} description={tAccount('overview.statistics.tk_description_')} />
          </CardHeader>
          <CardContent>
            <StatisticsCards account={account} tCommon={tCommon} />
          </CardContent>
        </Card>
      </div>

      {/* Statistics & Lists */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Recent Users */}
        <Card className="flex flex-col">
          <CardHeader>
            <SectionHeader
              icon={ICONS.users}
              iconBg={ICON_BG.users}
              title={tAccount('overview.recentUsers.tk_title_')}
              description={tAccount('overview.recentUsers.tk_description_')}
              cta={
                <Button
                // onClick={handleInviteUser} // Décommente et implémente cette fonction selon ton besoin
                >
                  <UserPlus size={18} />
                  {tAccount('overview.recentUsers.tk_invite-user_')}
                </Button>
              }
            />
          </CardHeader>
          <CardContent className="flex h-full flex-col justify-between">
            <RecentUsers users={recentUsers} tAccount={tAccount} />
            <div className="mt-5 flex justify-end px-1">
              <Link to="/account?tab=users" className="text-primary transition hover:opacity-80">
                {tAccount('overview.recentUsers.tk_view-all-users_')}
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Entities */}
        <Card className="flex flex-col">
          <CardHeader>
            <SectionHeader
              icon={ICONS.entities}
              iconBg={ICON_BG.entities}
              title={tAccount('overview.recentEntities.tk_title_')}
              description={tAccount('overview.recentEntities.tk_description_')}
              cta={
                <Button
                // onClick={handleCreateEntity}
                >
                  <Plus size={18} />
                  {tAccount('overview.recentEntities.tk_create-entity_')}
                </Button>
              }
            />
          </CardHeader>
          <CardContent className="h-full">
            <RecentEntities entities={recentEntities} tAccount={tAccount} tCommon={tCommon} />
            <div className="mt-5 flex justify-end px-1">
              <Link to="/account?tab=entities" className="text-primary transition hover:opacity-80">
                {tAccount('overview.recentEntities.tk_view-all-entities_')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Roles */}
      <Card>
        <CardHeader>
          <SectionHeader icon={ICONS.roles} iconBg={ICON_BG.roles} title={tAccount('overview.recentRoles.tk_title_')} description={tAccount('overview.recentRoles.tk_description_')} />
        </CardHeader>
        <CardContent>
          <RecentRoles roles={availableRoles} tCommon={tCommon} />
          <div className="mt-5 flex justify-end px-1">
            <Link to="/account?tab=roles" className="text-primary transition hover:opacity-80">
              {tAccount('overview.recentRoles.tk_view-all-roles_')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
