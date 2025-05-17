/**
 * Dependencies
 */
import { useBreadcrumb } from '@/hooks/ui/useBreadcrumb'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'

/**
 * Components
 */
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/shadcn/tabs'
import { AccountOverview } from './account-overview'
import { AccountUsers } from './account-users'

/**
 * React declaration
 */
export function AccountManagement() {
  const { t: tAccount } = useTranslation('account')
  const [searchParams] = useSearchParams()
  const { setBreadcrumb } = useBreadcrumb()
  const navigate = useNavigate()
  const currentTab = searchParams.get('tab') || 'overview'

  useEffect(() => {
    setBreadcrumb([
      { label: tAccount('tk_title_') },
      {
        label: tAccount(`tabs.tk_${currentTab}_`),
        description: tAccount(`tabs.tk_${currentTab}-description_`)
      }
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab])

  const handleTabChange = (value: string) => {
    navigate(`/account?tab=${value}`, { replace: true })
  }

  const tabTriggerClass = `
      transition-all duration-300
      flex-1 py-1.5 rounded-sm uppercase opacity-70 border border-dashed border-gray-400 border-opacity-0
      hover:opacity-100 hover:border-opacity-60
      data-[state=active]:opacity-100 data-[state=active]:border-opacity-0 data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:text-sm data-[state=active]:text-muted-foreground data-[state=active]:shadow-sm
    `

  return (
    <div className="container mx-auto">
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="flex h-10 w-full justify-between space-x-1 rounded-md bg-muted">
          {['overview', 'users', 'entities', 'roles'].map((tab) => (
            <TabsTrigger key={tab} value={tab} className={tabTriggerClass}>
              {tAccount(`tabs.tk_${tab}_`)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <AccountOverview />
        </TabsContent>

        <TabsContent value="users">
          <AccountUsers />
        </TabsContent>

        <TabsContent value="entities">{/* Entities tab content will go here */}</TabsContent>

        <TabsContent value="roles">{/* Roles tab content will go here */}</TabsContent>
      </Tabs>
    </div>
  )
}
