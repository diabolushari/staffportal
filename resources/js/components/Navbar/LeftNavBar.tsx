import NormalText from '@/typography/NormalText'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '../ui/sidebar'
import { useEffect, useState } from 'react'
import Spinner from '@/ui/Spinner'
import { MainNav } from './navitems'

interface Props {
  title: string
  selectedItem?: string
  items?: MainNav
}

export default function LeftNavBar({ items = { label: '', items: [] }, selectedItem }: Props) {
  const [loading, setLoading] = useState(false)

  // Trigger spinner when menu items change
  useEffect(() => {
    setLoading(true)

    const timer = setTimeout(() => {
      setLoading(false)
    }, 400) // adjust duration if needed

    return () => clearTimeout(timer)
  }, [items])

  return (
    <SidebarMenu className='bg-kseb-bg-blue relative h-full p-4 pt-20'>
      {/* Loading Overlay */}
      {loading && (
        <div className='absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm'>
          <Spinner />
        </div>
      )}

      <NormalText className='context-menu-title mb-2 text-lg'>{items.label}</NormalText>

      {items.items.map((item) => {
        const hasChildren = item.children && item.children.length > 0

        return (
          <SidebarMenuItem key={item.title}>
            {/* MAIN HEADING */}
            {hasChildren ? (
              <div className='flex items-center gap-2 py-1'>
                {item.icon}
                <NormalText className='context-menu-subtitle'>{item.title}</NormalText>
              </div>
            ) : (
              <SidebarMenuButton asChild>
                <a
                  href={item.href}
                  className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left ${
                    selectedItem === item.title
                      ? 'bg-[#D7EDFF] text-blue-500'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <NormalText className='context-menu-item'>{item.title}</NormalText>
                </a>
              </SidebarMenuButton>
            )}

            {/* CHILDREN */}
            {hasChildren && (
              <SidebarMenuSub className='mt-1 ml-4'>
                {item.children!.map((child) => {
                  const isActive = selectedItem === child.title

                  return (
                    <SidebarMenuSubItem key={child.title}>
                      <a
                        href={child.href}
                        className={`context-menu-item flex items-center gap-3 rounded px-2 py-1 text-sm ${
                          isActive
                            ? 'bg-[#D7EDFF] text-blue-500'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {child.icon}
                        {child.title}
                      </a>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
