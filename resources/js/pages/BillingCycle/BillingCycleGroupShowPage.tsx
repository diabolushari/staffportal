import { billingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'

export default function BillingCycleGroupShowPage() {
  return (
    <MainLayout
      breadcrumb={[]}
      navItems={billingNavItems}
    >
      <div>
        <h1>Billing Cycle Group Show Page</h1>
      </div>
    </MainLayout>
  )
}
