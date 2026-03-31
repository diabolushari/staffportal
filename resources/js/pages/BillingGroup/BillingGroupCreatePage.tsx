import BillingGroupForm from '@/components/Billing/BillingGroup/BillingGroupForm'
import { billingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { BillingGroup } from '@/interfaces/data_interfaces'

export default function BillingGroupCreatePage({
  billingGroup,
}: {
  billingGroup: BillingGroup | null
}) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Billing Groups',
      href: route('billing-groups.index'),
    },
    {
      title: 'Billing Group Create',
      href: route('billing-groups.create'),
    },
  ]

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      selectedTopNav='Billing'
      selectedItem='Billing Groups'
      navItems={billingNavItems}
      title='Billing Groups'
    >
      <div className='flex flex-col gap-4'>
        <BillingGroupForm billing_group={billingGroup} />
        {/* <BillingGroupMembersList /> */}
      </div>
    </MainLayout>
  )
}
