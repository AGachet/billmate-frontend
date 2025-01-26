/**
 * Resources
 */
import { useTranslation } from 'react-i18next'

/**
 * Icons
 */
import { ChevronRight } from 'lucide-react'

/**
 * Components
 */
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar'

/**
 * TS Types
 */
import type { LucideIcon } from 'lucide-react'

export type NavSectionItem = {
  title: string
  url?: string
  icon?: LucideIcon
  isActive?: boolean
  subItems?: {
    title: string
    url: string
  }[]
}

interface NavSectionProps {
  section: {
    title: string
    items: NavSectionItem[]
  }
}

/**
 * React declaration
 */
export const NavSection = ({ section }: NavSectionProps) => {
  const { t } = useTranslation('nav')

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(section.title)}</SidebarGroupLabel>
      <SidebarMenu>
        {section.items.map((item) =>
          item.subItems ? (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={t(item.title)}>
                    {item.icon && <item.icon />}
                    <span>{t(item.title)}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.subItems?.map((subItem) => (
                      <SidebarMenuSubItem key={`${item.title}-${subItem.title}`}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{t(subItem.title)}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuButton key={item.title} asChild>
              <a href={item.url}>
                {item.icon && <item.icon />}
                <span>{t(item.title)}</span>
              </a>
            </SidebarMenuButton>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
