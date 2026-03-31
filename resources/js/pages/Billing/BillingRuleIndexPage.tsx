import BillingRuleList from '@/components/Billing/BillingRuleList'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { BillingRule } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Pagination from '@/ui/Pagination/Pagination'
import ListSearch from '@/ui/Search/ListSearch'
import { Paginator } from '@/ui/ui_interfaces'

interface PageProps {
  billingRules: Paginator<BillingRule>
  filters: {
    search: string
  }
}

export default function BillingRuleIndexPage({ billingRules, filters }: PageProps) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Settings',
      href: '/settings-page',
    },
    {
      title: 'Billing',
      href: '/billing-rules',
    },
  ]

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      leftBarTitle='Billing Rule'
      navItems={meteringBillingNavItems}
      selectedItem='Billing Rule'
      addBtnText='Billing Rule'
      addBtnUrl='/billing-rules/create'
      selectedTopNav='Billing'
      title='Billing Rule'
    >
      <ListSearch
        title=''
        placeholder='Search Billing Rule'
        url='/billing-rules'
        filters={filters}
      />
      {billingRules && billingRules.data.length > 0 ? (
        <>
          <BillingRuleList billingRules={billingRules.data} />
          <Pagination pagination={billingRules} />
        </>
      ) : (
        <div className='flex h-full items-center justify-center'>No Billing Rules Found</div>
      )}
    </MainLayout>
  )
}
