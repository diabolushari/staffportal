import { billingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import ListSearch from '@/ui/Search/ListSearch'
import { BillingGroup } from '@/interfaces/data_interfaces'
import BillingGroupList from '@/components/Billing/BillingGroup/BillingGroupList'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'

interface PageProps {
  billingGroups: Paginator<BillingGroup>
  filters: {
    search: string
  }
}
export default function BillingGroupIndexPage({ billingGroups, filters }: PageProps) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Billing',
      href: '/billing-groups',
    },
  ]

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      leftBarTitle='Billing'
      selectedItem='Billing Groups'
      navItems={billingNavItems}
      addBtnText='Billing Group'
      addBtnUrl='/billing-groups/create'
      title='Billing Group'
      selectedTopNav='Billing'
    >
      <ListSearch
        title=''
        placeholder='Find Billing Group'
        url='/billing-groups'
        filters={filters}
      />
      {billingGroups && billingGroups?.data?.length > 0 ? (
        <>
          <BillingGroupList billingGroups={billingGroups.data} />
          <Pagination
            pagination={billingGroups}
            filters={filters}
          />
        </>
      ) : (
        <div className='flex h-full items-center justify-center'>No Billing Groups Found</div>
      )}
    </MainLayout>
  )
}
