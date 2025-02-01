/**
 * Resources & configs
 */
import * as React from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

/**
 * Icons
 */
import {
  ClipboardList,
  Package,
  AudioWaveform,
  FileText,
  Command,
  GalleryVerticalEnd,
  Users,
  Handshake,
  ContactRound,
  Building,
  ShoppingBag,
  HandCoins,
  Car,
  Signature,
  Coins,
  ChartNoAxesCombined
} from 'lucide-react'

/**
 * Components
 */
import { useSidebar, Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

import { TeamSwitcher } from '@/components/layout/team-switcher'
import { NavSection } from '@/components/nav/nav-section'
import { NavUser } from '@/components/nav/nav-user'

/**
 * TS Types
 */
import type { NavSectionItem } from '@/components/nav/nav-section'

type User = {
  firstname: string
  lastname: string
  email: string
  avatar: string
}

type TeamItem = {
  name: string
  logo: React.ComponentType
  plan: string
}

type NavigationItem = {
  title: string
  items: NavSectionItem[]
}

type SideBarConfig = {
  user: User
  teams: TeamItem[]
  navigation: NavigationItem[]
}

/**
 * Config
 */
const data: SideBarConfig = {
  user: {
    firstname: 'Anthony',
    lastname: 'Gachet',
    email: 'anthony.gachet@diamondforge.fr',
    avatar: '/avatars/shadcn.jpg'
  },
  teams: [
    {
      name: 'BillMate',
      logo: GalleryVerticalEnd,
      plan: 'Free version'
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup'
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free'
    }
  ],
  navigation: [
    {
      title: 'main-navigation.tk_sales-management_',
      items: [
        {
          title: 'main-navigation.tk_summary_',
          url: '#',
          icon: ClipboardList,
          isActive: true
        },
        {
          title: 'main-navigation.tk_products_',
          url: '#',
          icon: Package,
          isActive: true
        },
        {
          title: 'main-navigation.tk_services_',
          url: '#',
          icon: Handshake,
          isActive: true
        },
        {
          title: 'main-navigation.tk_quotes_',
          url: '#',
          icon: Signature,
          isActive: true
        },
        {
          title: 'main-navigation.tk_invoices_',
          url: '#',
          icon: FileText,
          isActive: true
        },
        {
          title: 'main-navigation.tk_credit-notes_',
          url: '#',
          icon: Coins,
          isActive: true
        }
      ]
    },
    {
      title: 'main-navigation.tk_customer-management_',
      items: [
        {
          title: 'main-navigation.tk_summary_',
          url: '#',
          icon: ClipboardList,
          isActive: true
        },
        {
          title: 'main-navigation.tk_customers_',
          url: '#',
          icon: Users,
          isActive: true
        },
        {
          title: 'main-navigation.tk_leads_',
          url: '#',
          icon: ContactRound,
          isActive: true
        }
      ]
    },
    {
      title: 'main-navigation.tk_cost-management_',
      items: [
        {
          title: 'main-navigation.tk_summary_',
          url: '#',
          icon: ClipboardList,
          isActive: true
        },
        {
          title: 'main-navigation.tk_providers_',
          url: '#',
          icon: Building,
          isActive: true
        },
        {
          title: 'main-navigation.tk_product-costs_',
          url: '#',
          icon: ShoppingBag,
          isActive: true
        },
        {
          title: 'main-navigation.tk_service-costs_',
          url: '#',
          icon: HandCoins,
          isActive: true
        },
        {
          title: 'main-navigation.tk_travel-costs_',
          url: '#',
          icon: Car,
          isActive: true
          // subItems: [
          //   {
          //     title: "Genesis",
          //     url: "#",
          //   },
          //   {
          //     title: "Explorer",
          //     url: "#",
          //   },
          //   {
          //     title: "Quantum",
          //     url: "#",
          //   },
          // ],
        }
      ]
    }
  ]
}

/**
 * React declaration
 */
export const LayoutSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { state } = useSidebar()
  const { t } = useTranslation('nav')
  const isCollapsed = state === 'collapsed'

  const buttonClassName = cn('mt-6', isCollapsed ? 'mx-2 overflow-hidden px-2 text-xs' : 'mx-6 text-base')

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <Button className={buttonClassName}>
          <ChartNoAxesCombined className="cursor-pointer" />
          {!isCollapsed && t('main-navigation.tk_dashboard_')}
        </Button>
        {data.navigation.map((section, index) => (
          <NavSection key={`nav-section-${index}`} section={section} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
