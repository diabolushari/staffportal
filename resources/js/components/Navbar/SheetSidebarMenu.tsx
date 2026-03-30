import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import NormalText from '@/typography/NormalText'
import { Link, usePage } from '@inertiajs/react'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NAV_ITEMS } from './CustomNavbar'

export function SheetSidebarMenu() {
  const page = usePage()
  const activePath = page.url
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    NAV_ITEMS.forEach((item) => {
      if (item.children?.some((c) => c.href === activePath)) {
        setOpenMap((prev) => ({ ...prev, [item.title]: true }))
      }
    })
  }, [activePath])

  return (
    <SidebarMenu className='p-2'>
      {NAV_ITEMS.map((item) =>
        item.children && item.children.length > 0 ? (
          <Collapsible
            key={item.title}
            className='group/collapsible'
            open={openMap[item.title]}
            onOpenChange={(o) => setOpenMap((prev) => ({ ...prev, [item.title]: o }))}
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <NormalText className='font-normal'>{item.title}</NormalText>
                  <ChevronDown className='ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.children.map((child) => {
                    const isActive = activePath.startsWith(child.href || '')
                    return (
                      <SidebarMenuSubItem key={child.title}>
                        <Link
                          href={child.href || '#'}
                          className={`block rounded px-2 py-1 text-sm ${
                            isActive
                              ? 'bg-blue-500 text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {child.title}
                        </Link>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ) : (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link
                href={item.href || '#'}
                className={`w-full text-left ${
                  activePath.startsWith(item.href || '')
                    ? 'bg-[#D7EDFF] text-[#0E73F6]'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <NormalText className='font-normal'>{item.title}</NormalText>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      )}
    </SidebarMenu>
  )
}
