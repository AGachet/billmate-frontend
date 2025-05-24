/**
 * Ressources
 */
import { useQueryClient } from '@tanstack/react-query'
import { ArrowUpDown, Building2, Plus, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Dependencies
 */
import { formatDate } from '@/utils/format'

/**
 * Components
 */
import { CreateEntityDialog } from '@/components/dialogs/create-entity-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/shadcn/avatar'
import { Badge } from '@/components/ui/shadcn/badge'
import { Button } from '@/components/ui/shadcn/button'
import { Card, CardContent, CardFooter } from '@/components/ui/shadcn/card'
import { Input } from '@/components/ui/shadcn/input'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/shadcn/pagination'
import { ScrollArea } from '@/components/ui/shadcn/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/shadcn/select'
import { Skeleton } from '@/components/ui/shadcn/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/shadcn/table'

/**
 * Hooks
 */
import { EntityOrderBy, useAccountEntities } from '@/hooks/api/accounts/queries/useAccountEntities'

/**
 * Types
 */
import type { AccountEntitiesResponseDto } from '@/hooks/api/accounts/queries/useAccountEntities'
import type { MeResponseDto } from '@/hooks/api/auth'

/**
 * Constants
 */
const ENTITIES_ICON_BG = 'bg-[#E5D8FF]'
const ENTITIES_ICON_COLOR = 'text-[#A259FF]'

/**
 * Search Filters Component
 */
type SearchFiltersProps = {
  searchTerm: string
  setSearchTerm: (value: string) => void
  activeFilter: boolean | undefined
  setActiveFilter: (value: boolean | undefined) => void
  tAccount: (key: string) => string
  tCommon: (key: string) => string
}

function SearchFilters({ searchTerm, setSearchTerm, activeFilter, setActiveFilter, tAccount, tCommon }: SearchFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
      <div className="relative md:col-span-8">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={tAccount('entities.tk_filters-search-placeholder_')}
          className={`border-0 pl-9 shadow-none transition-colors placeholder:text-muted-foreground ${
            searchTerm ? 'bg-white ring-1 ring-slate-200' : 'bg-muted-foreground/5'
          } focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-200`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
            onClick={() => setSearchTerm('')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 md:col-span-4">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <div className={`flex h-5 w-5 items-center justify-center rounded-full ${activeFilter === true ? 'bg-green-100' : activeFilter === false ? 'bg-gray-200' : 'bg-blue-100'}`}>
              <span className={`h-2 w-2 rounded-full ${activeFilter === true ? 'bg-green-500' : activeFilter === false ? 'bg-gray-400' : 'bg-blue-500'}`}></span>
            </div>
          </div>
          <Select
            value={activeFilter === undefined ? 'all' : activeFilter.toString()}
            onValueChange={(value) => {
              if (value === 'all') setActiveFilter(undefined)
              else setActiveFilter(value === 'true')
            }}
          >
            <SelectTrigger
              className={`border-0 pl-9 shadow-none transition-colors ${
                activeFilter !== undefined
                  ? 'bg-white ring-1 ring-slate-200 focus:bg-white focus:ring-1 focus:ring-slate-200'
                  : 'bg-muted-foreground/5 hover:bg-white hover:ring-1 hover:ring-slate-200 focus:bg-muted-foreground/5 focus:ring-0'
              }`}
            >
              <SelectValue placeholder={tCommon('filters.tk_status_')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="pr-2">{tCommon('status.tk_all_')}</span>
              </SelectItem>
              <SelectItem value="true">
                <span className="pr-2">{tCommon('status.tk_active_')}</span>
              </SelectItem>
              <SelectItem value="false">
                <span className="pr-2">{tCommon('status.tk_inactive_')}</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

/**
 * Entities Table Component
 */
type EntitiesTableProps = {
  entities: AccountEntitiesResponseDto['items']
  isLoading: boolean
  tCommon: (key: string) => string
  tAccount: (key: string) => string
}

function EntitiesTable({ entities, isLoading, tCommon, tAccount }: EntitiesTableProps) {
  if (isLoading) {
    return (
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[150px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    )
  }

  if (entities.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className="h-[calc(60vh-48px)]">
            <div className="flex h-full flex-1 items-center justify-center gap-2 rounded-md border border-dashed border-gray-300/50 p-6">
              <Building2 className="text-muted-foreground opacity-40" size={18} />
              <span className="text-sm text-muted-foreground opacity-50">{tAccount('overview.recentEntities.tk_no-entity_')}</span>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {entities.map((entity) => (
        <TableRow key={entity.id}>
          {/* Entity Name & Description */}
          <TableCell>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className={ENTITIES_ICON_BG}>
                  <span className={ENTITIES_ICON_COLOR}>
                    <Building2 className="h-5 w-5" />
                  </span>
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{entity.name}</div>
                <div className="text-sm text-muted-foreground">{entity.description || '-'}</div>
              </div>
            </div>
          </TableCell>
          {/* Entity Status */}
          <TableCell>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${entity.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span>{entity.isActive ? tCommon('status.tk_active_') : tCommon('status.tk_inactive_')}</span>
            </div>
          </TableCell>
          {/* Entity Organization */}
          <TableCell>
            <div className="flex flex-wrap gap-1">
              {entity.organization ? (
                <Badge variant="outline" className={`${ENTITIES_ICON_BG} border-none`}>
                  <span className={ENTITIES_ICON_COLOR}>{entity.organization.name}</span>
                </Badge>
              ) : (
                <span className="text-xs text-muted-foreground">-</span>
              )}
            </div>
          </TableCell>
          {/* Entity Created At */}
          <TableCell>
            <div className="text-sm text-muted-foreground">{formatDate(entity.createdAt)}</div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

/**
 * Table Pagination Component
 */
type TablePaginationProps = {
  currentPage: number
  setCurrentPage: (page: number) => void
  totalItems: number
  pageSize: number
}

function TablePagination({ currentPage, setCurrentPage, totalItems, pageSize }: TablePaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) setCurrentPage(currentPage - 1)
            }}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(page)
              }}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) setCurrentPage(currentPage + 1)
            }}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

/**
 * Main Component
 */
export function AccountEntities() {
  const { t: tAccount } = useTranslation('account')
  const { t: tCommon } = useTranslation('common')
  const queryClient = useQueryClient()
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined)
  const [orderBy, setOrderBy] = useState<EntityOrderBy>(EntityOrderBy.CREATED_AT)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Get accountId from authMe
  const authMe = queryClient.getQueryData<MeResponseDto>(['authMe'])!
  const activeAccount = authMe.accounts.find((acc) => acc.isActive)
  const accountId = activeAccount?.id

  // Get entities with pagination and filters
  const { data: entitiesData, isLoading } = useAccountEntities(accountId as string, {
    search: debouncedSearch,
    isActive: activeFilter,
    orderBy,
    page: currentPage,
    limit: pageSize
  })

  // Handle filter changes
  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    setCurrentPage(1)
  }

  const handleActiveFilterChange = (value: boolean | undefined) => {
    setActiveFilter(value)
    setCurrentPage(1)
  }

  const handleOrderByChange = (value: EntityOrderBy) => {
    setOrderBy(value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Filters & new entity */}
      <Card className="overflow-hidden border-none bg-gradient-to-br from-muted to-white">
        <CardContent className="flex justify-between gap-3 p-4">
          <SearchFilters searchTerm={searchInput} setSearchTerm={handleSearchChange} activeFilter={activeFilter} setActiveFilter={handleActiveFilterChange} tAccount={tAccount} tCommon={tCommon} />
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus />
            {tAccount('entities.tk_create-entity_')}
          </Button>
        </CardContent>
      </Card>

      {/* Entities Table */}
      <Card className="overflow-hidden border-none bg-gradient-to-br from-background to-white shadow-sm">
        <CardContent className="p-0">
          <ScrollArea className="h-[60vh]">
            <Table>
              <TableHeader className="bg-muted/30 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[250px] cursor-pointer" onClick={() => handleOrderByChange(EntityOrderBy.NAME)}>
                    <div className="ml-2 flex items-center gap-2">
                      {tCommon('items.tk_entities_')}
                      {orderBy === EntityOrderBy.NAME && <ArrowUpDown size={14} className="text-primary" />}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="ml-2 flex items-center gap-2">
                      {tCommon('status.tk_title_')}
                      {activeFilter !== undefined && <div className={`h-2 w-2 rounded-full ${activeFilter ? 'bg-green-500' : 'bg-gray-400'}`}></div>}
                    </div>
                  </TableHead>
                  <TableHead>{tCommon('items.tk_organization_')}</TableHead>
                  <TableHead className="w-[150px] cursor-pointer" onClick={() => handleOrderByChange(EntityOrderBy.CREATED_AT)}>
                    <div className="flex items-center gap-2">
                      {tCommon('date.tk_created-at_')}
                      {orderBy === EntityOrderBy.CREATED_AT && <ArrowUpDown size={14} className="text-primary" />}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <EntitiesTable entities={entitiesData?.items || []} isLoading={isLoading} tCommon={tCommon} tAccount={tAccount} />
            </Table>
          </ScrollArea>
        </CardContent>
        {entitiesData?.items.length !== 0 && (
          <CardFooter>
            <TablePagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={entitiesData?.meta.pagination.total || 0} pageSize={pageSize} />
          </CardFooter>
        )}
      </Card>

      <CreateEntityDialog isOpen={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
