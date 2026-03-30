import { billingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import ListSearch from '@/ui/Search/ListSearch'
import { BillGenerationJobStatus, BillingGroup } from '@/interfaces/data_interfaces'
import BillingGroupList from '@/components/Billing/BillingGroup/BillingGroupList'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'
import BillSearchForm from '@/components/Billing/Bill/BillSearchForm'
import BillList from '@/components/Billing/Bill/BillList'

interface PageProps {
  billGenerationJobStatuses: Paginator<BillGenerationJobStatus>
  filters: {
    search: string
    billingGroupId: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
  }
}
export default function BillIndexPage({ billGenerationJobStatuses, filters }: PageProps) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Billing',
      href: '/bills',
    },
  ]

  console.log(billGenerationJobStatuses, 'sdjfd')

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      leftBarTitle='Billing'
      selectedItem='Bill'
      navItems={billingNavItems}
      title='Bills'
      selectedTopNav='Bill'
    >
      <BillSearchForm filters={filters} />
      <BillList data={billGenerationJobStatuses?.data ?? []} />
      {billGenerationJobStatuses?.data?.length > 0 && (
        <Pagination pagination={billGenerationJobStatuses} />
      )}
    </MainLayout>
  )
}
