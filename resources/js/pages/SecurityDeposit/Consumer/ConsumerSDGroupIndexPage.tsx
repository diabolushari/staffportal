import { billingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import ListSearch from '@/ui/Search/ListSearch'
import { BillingGroup } from '@/interfaces/data_interfaces'
import BillingGroupList from '@/components/Billing/BillingGroup/BillingGroupList'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'
import { User, Users } from 'lucide-react'
import IconSingleTab from '@/components/ui/icon-single-tab'

interface PageProps {
  groups: Paginator<BillingGroup>
  filters?: {
    search: string
  }
}
const Tabs = [
  {
    value: 'individual',
    label: 'Individual',
    icon: <User />,
    href: '/consumer-sd',
  },
  {
    value: 'group',
    label: 'Group',
    icon: <Users />,
    href: '/consumer-sd/group',
  },
]
export default function ConsumerSDGroupIndexPage({ groups, filters }: PageProps) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Security Deposit',
      href: '/consumer-sd',
    },
    {
      title: 'Consumer SD Groups',
      href: '/consumer-sd/group',
    },
  ]

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      leftBarTitle='Billing'
      selectedItem='Consumers'
      navItems={billingNavItems}
      addBtnText='Groups'
      title='Consumer SD Groups'
      selectedTopNav='Billing'
      description='Manage & Search Consumers for security deposit assessment'
    >
      <IconSingleTab
        tabs={Tabs}
        defaultValue='group'
      />
      <ListSearch
        title=''
        placeholder='Find Consumer SD Group'
        url='/consumer-sd-groups'
        filters={filters}
      />

      {groups && groups?.data?.length > 0 ? (
        <>
          <BillingGroupList
            billingGroups={groups.data}
            listOnSD={true}
          />
          <Pagination
            pagination={groups}
            filters={filters}
          />
        </>
      ) : (
        <div className='flex h-full items-center justify-center'>No Groups Found</div>
      )}
    </MainLayout>
  )
}
