/**
 * Resources
 */
import { Outlet } from 'react-router-dom'

/**
 * Components
 */
import { Separator } from '@/components/ui/separator'
import { LayoutSidebar } from '@/components/layout/layout-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

/**
 * React declaration
 */
export const LayoutLogged = () => {
  const renderBreadcrumbItems = () => (
    <BreadcrumbList>
      <BreadcrumbItem className="hidden md:block">
        <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator className="hidden md:block" />
      <BreadcrumbItem>
        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  )

  const renderHeader = () => (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>{renderBreadcrumbItems()}</Breadcrumb>
      </div>
    </header>
  )

  const renderPlaceholderGrid = () => (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="aspect-video rounded-xl bg-muted/50" />
      ))}
    </div>
  )

  return (
    <SidebarProvider>
      <LayoutSidebar />
      <SidebarInset>
        {renderHeader()}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <main>
            <Outlet />
          </main>
          {renderPlaceholderGrid()}
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
