import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { type NavItem } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const renderNavItems = (navItems: NavItem[], level = 0) => {
    return navItems.map((item) => {
      const isOpen = openMenus[item.title]
      const hasChildren = !!item.children?.length

      const isActive =
        (item.href && page.url.startsWith(item.href)) ||
        (hasChildren && item.children.some((child) => page.url.startsWith(child.href)))

      return (
        <div
          key={item.title}
          className={level > 0 ? 'ml-6' : ''}
        >
          <SidebarMenuItem>
            {hasChildren ? (
              <SidebarMenuButton
                onClick={() => toggleMenu(item.title)}
                isActive={isActive}
                tooltip={{ children: item.title }}
              >
                <div className='flex w-full items-center justify-between'>
                  <span className='flex items-center gap-2'>
                    {item.icon && <item.icon className='mr-2' />}
                    {item.title}
                  </span>
                  {isOpen ? (
                    <ChevronDown className='h-4 w-4' />
                  ) : (
                    <ChevronRight className='h-4 w-4' />
                  )}
                </div>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={{ children: item.title }}
              >
                <Link
                  href={item.href || '#'}
                  prefetch
                >
                  <div className='flex items-center gap-2'>
                    {item.icon && <item.icon className='mr-2' />}
                    {item.title}
                  </div>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>

          {hasChildren && isOpen && renderNavItems(item.children, level + 1)}
        </div>
      )
    })
  }

  return (
    <SidebarGroup className='px-2 py-0'>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>{renderNavItems(items)}</SidebarMenu>
    </SidebarGroup>
  )
}
