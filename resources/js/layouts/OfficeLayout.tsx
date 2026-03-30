import { BreadcrumbItem } from '@/types'
import { navItem } from '@/components/Navbar/navitems'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import { TabsContent } from '@radix-ui/react-tabs'
import StrongText from '@/typography/StrongText'
import { Card } from '@/components/ui/card'
import { Zap, Users, Calendar } from 'lucide-react'
import React from 'react'
import { Office } from '@/interfaces/data_interfaces'
import MainLayout from './main-layout'

interface OfficeLayoutProps {
  children: React.ReactNode
  breadcrumbs: BreadcrumbItem[]
  officeNavItems: navItem[]
  office: Office
  value: string
  heading: string
  subHeading: string
  onEdit?: () => void
  selectedItem?: string
}

/* -------------------------
   TAB DEFINITIONS 
   LIKE ConnectionsLayout
-------------------------- */
const officeTabs = (office: Office) => [
  {
    value: 'details',
    label: 'Details',
    href: route('offices.show', office.office_id), // has page → children render
  },
  {
    value: 'billing',
    label: 'Billing',
    href: route('offices.billings', office.office_code),
  },

  // // NO href → rendered inside layout
  // { value: 'substations', label: 'Substations' },
  // { value: 'consumers', label: 'Consumers' },
  // { value: 'activity', label: 'Activity' },
]

/* -------------------------
   INTERNAL TAB COMPONENTS
-------------------------- */

const SubstationTab = () => (
  <Card className='p-6'>
    <div className='mb-6 flex items-center justify-between'>
      <StrongText className='text-lg font-semibold text-gray-900'>Substations</StrongText>
    </div>
    <div className='py-12 text-center'>
      <Zap className='mx-auto mb-4 h-12 w-12 text-gray-400' />
      <p className='text-gray-600'>Substation data will be displayed here</p>
      <p className='mt-2 text-sm text-gray-500'>Feature coming soon</p>
    </div>
  </Card>
)

const ConsumersTab = () => (
  <Card className='p-6'>
    <div className='mb-6 flex items-center justify-between'>
      <StrongText className='text-lg font-semibold text-gray-900'>Consumers</StrongText>
    </div>
    <div className='py-12 text-center'>
      <Users className='mx-auto mb-4 h-12 w-12 text-gray-400' />
      <p className='text-gray-600'>Consumer data will be displayed here</p>
      <p className='mt-2 text-sm text-gray-500'>Feature coming soon</p>
    </div>
  </Card>
)

const ActivityTab = () => (
  <Card className='p-6'>
    <div className='mb-6 flex items-center justify-between'>
      <StrongText className='text-lg font-semibold text-gray-900'>Activity History</StrongText>
    </div>
    <div className='py-12 text-center'>
      <Calendar className='mx-auto mb-4 h-12 w-12 text-gray-400' />
      <p className='text-gray-600'>Activity history will be displayed here</p>
      <p className='mt-2 text-sm text-gray-500'>Feature coming soon</p>
    </div>
  </Card>
)

/* -------------------------
   OFFICE LAYOUT
-------------------------- */

export default function OfficeLayout({
  children,
  breadcrumbs,
  officeNavItems,
  office,
  value,
  heading,
  subHeading,
  onEdit,
  selectedItem,
}: Readonly<OfficeLayoutProps>) {
  const tabs = officeTabs(office)

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={officeNavItems}
      selectedItem={selectedItem}
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        {/* HEADER */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-col gap-2'>
            <StrongText className='text-2xl font-semibold text-[#252c32]'>{heading}</StrongText>
            <span className='text-sm text-gray-600'>{subHeading}</span>
          </div>

          {onEdit && (
            <button
              onClick={onEdit}
              className='flex items-center gap-2 rounded-lg bg-[#0078d4] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#106ebe]'
            >
              Edit
            </button>
          )}
        </div>

        {/* TABS */}
        <TabGroup
          tabs={tabs}
          defaultValue={value}
        >
          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
            >
              {/* CASE 1: href present → show children */}
              {tab.href ? (
                value === tab.value ? (
                  children
                ) : null
              ) : (
                <>
                  {/* CASE 2: no href → internal component */}
                  {tab.value === 'substations' && <SubstationTab />}
                  {tab.value === 'consumers' && <ConsumersTab />}
                  {tab.value === 'activity' && <ActivityTab />}
                </>
              )}
            </TabsContent>
          ))}
        </TabGroup>
      </div>
    </MainLayout>
  )
}

export { officeTabs }
