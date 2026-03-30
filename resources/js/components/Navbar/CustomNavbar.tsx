import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/utils'
import { router } from '@inertiajs/react'
import { Button } from '../ui/button'
// Using local wrapped NavigationMenu (supports viewport prop)

interface Props {
  selectedTopNav?: string
}
export const NAV_ITEMS = [
  {
    title: 'Consumers & Services',
    value: 'Consumers',
    href: '/connections',
    description: 'Customer data and tools',
    // children: [
    //   { title: 'Connections', href: '/connections', description: 'Manage connections' },
    //   // { title: 'Meters', href: '/meters', description: 'Manage meters' },
    //   // { title: 'Meter CTPT', href: '/meter-ctpt', description: 'Manage meter CTPT' },
    // ],
  },
  {
    title: 'Metering & Billing',
    value: 'Billing',
    href: '/billing-groups',
    description: 'Invoices and payments',
    // children: [
    //   {
    //     title: 'Meter Readings',
    //     href: '/meter-readings',
    //     description: 'Manage meter readings',
    //     disabled: true,
    //   },
    //   { title: 'Billing', href: '/billing', description: 'Manage billing', disabled: true },
    // ],
  },

  // {
  //   title: 'Admin',
  //   href: '/offices',
  //   description: '',
  //   children: [
  //     { title: 'Offices', href: '/offices', description: 'Manage office locations' },
  //     {
  //       title: 'Meta data Management',
  //       href: '/parameter-value',
  //       description: 'Manage meta data',
  //     },
  //     {
  //       title: 'Meters',
  //       href: '/meters',
  //       description: 'Manage meters',
  //     },
  //     {
  //       title: 'Metering Time Zones',
  //       href: '/metering-timezone',
  //       description: 'Manage metering time zones',
  //     },
  //     {
  //       title: 'Tariff Management',
  //       href: '/tariff-orders',
  //       description: 'Manage tariff',
  //     },
  //     {
  //       title: 'Billing',
  //       href: '/billing-rules',
  //       description: 'Manage billing',
  //     },
  //   ],
  // },
]

export function CustomNavbar({ selectedTopNav }: Props) {
  return (
    <NavigationMenu
      viewport={false}
      className='w-full'
    >
      <NavigationMenuList className='flex gap-4 bg-white px-4 dark:border-gray-700 dark:bg-gray-900'>
        {NAV_ITEMS.map((item) => {
          const isActive = selectedTopNav === item.value

          return (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink
                asChild
                className='rounded-none'
              >
                <Button
                  variant='ghost'
                  onClick={() => router.get(item.href)}
                  className={cn(
                    'border-b-8 border-transparent',
                    isActive && 'border-b-kseb-bg-blue'
                  )}
                >
                  {item.title}
                </Button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
