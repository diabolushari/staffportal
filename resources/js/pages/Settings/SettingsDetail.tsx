import { metadataNavItems, meteringBillingNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { Database, Navigation, Newspaper, User } from 'lucide-react'
import { useState } from 'react'

const settingCardItems = [
  {
    title: 'Metadata',
    value: 'metadata',
    href: '/settings/metadata',
    icon: Database,
    navItems: metadataNavItems,
  },
  {
    title: 'Metering & Billing',
    value: 'metering-billing',
    href: '/settings/metering-billing',
    icon: Newspaper,
    navItems: meteringBillingNavItems,
  },
  {
    title: 'User & Roles',
    value: 'user-roles',
    href: '/settings/user-roles',
    icon: User,
    navItems: metadataNavItems,
  },
  {
    title: 'Modules & Navigation',
    value: 'modules-navigation',
    href: '/settings/modules-navigation',
    icon: Navigation,
    navItems: metadataNavItems,
  },
]

const breadcrumb: BreadcrumbItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Settings', href: '/settings-page' },
]

const SettingsDetail = () => {
  const [selectedItem, setSelectedItem] = useState(settingCardItems[0])

  return (
    <MainLayout
      title='Settings'
      navItems={selectedItem.navItems}
      breadcrumb={breadcrumb}
    >
      <div className='mt-6 flex gap-6'>
        {settingCardItems.map((item) => {
          const isSelected = selectedItem.value === item.value
          const Icon = item.icon

          return (
            <Card
              key={item.value}
              onClick={() => setSelectedItem(item)}
              className={`flex h-44 w-40 cursor-pointer flex-col items-center justify-center rounded-xl border p-4 text-center transition-all ${
                isSelected
                  ? 'border-kseb-primary scale-105 bg-[#EEF5FF] shadow-xl'
                  : 'border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:shadow-md'
              } `}
            >
              <div
                className={`mb-3 rounded-lg p-2 ${isSelected ? 'text-kseb-primary' : 'text-gray-700'}`}
              >
                <Icon className='h-8 w-8' />
              </div>

              <p
                className={`text-sm font-medium ${isSelected ? 'text-kseb-primary' : 'text-gray-800'}`}
              >
                {item.title}
              </p>
            </Card>
          )
        })}
      </div>
    </MainLayout>
  )
}

export default SettingsDetail
