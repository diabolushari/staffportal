import MainLayout from '@/layouts/main-layout'
import BillingForm from '@/components/Billing/BillingForm'
import { BreadcrumbItem } from '@/types'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import StrongText from '@/typography/StrongText'
import { BillingRule } from '@/interfaces/data_interfaces'

export default function BillingRuleCreatePage({ billingRule }: { billingRule?: BillingRule }) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Settings',
      href: '/settings-page',
    },
    { title: 'Billing', href: '/billing-rules' },
    { title: 'Create', href: '/billing-rules/create' },
  ]
  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={meteringBillingNavItems}
      selectedItem='Billing Rule'
      selectedTopNav='Billing'
      title={billingRule ? 'Edit Billing Rule' : 'Add Billing Rule'}
    >
      {' '}
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-2'>
        <BillingForm billingRule={billingRule} />
      </div>
    </MainLayout>
  )
}
