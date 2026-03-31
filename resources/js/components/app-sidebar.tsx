import { NavFooter } from '@/components/nav-footer'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { type NavItem } from '@/types'
import { BuildingIcon, ListTreeIcon, SettingsIcon } from 'lucide-react'

const mainNavItems: NavItem[] = [
  {
    title: 'Offices',
    href: '/offices',
    icon: ListTreeIcon,
  },
  {
    title: 'Connections',
    href: '/',
    icon: BuildingIcon,
    children: [
      {
        title: 'Parties',
        href: '/parties',
      },
      {
        title: 'Connections',
        href: '/connections',
      },
    ],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: SettingsIcon,
    children: [
      {
        title: 'Parameter Master',
        href: '/parameter-domain',
        children: [
          { title: 'Domain', href: '/parameter-domain' },
          { title: 'Definition', href: '/parameter-definition' },
          { title: 'Values', href: '/parameter-value' },
        ],
      },
      {
        title: 'System modules',
        href: '/system-module',
      },
    ],
  },
]

const footerNavItems: NavItem[] = []

export function AppSidebar() {
  return (
    <Sidebar
      collapsible='icon'
      variant='inset'
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              asChild
            >
              <h1>KSEB MBC</h1>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter
          items={footerNavItems}
          className='mt-auto'
        />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
