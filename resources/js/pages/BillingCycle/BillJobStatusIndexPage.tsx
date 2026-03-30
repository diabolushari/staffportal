import BillingJobList from '@/components/Billing/BillingCycle/BillingJobList'
import BillingJobStatusSearchForm from '@/components/Billing/BillingCycle/BillingJobStatusSearchForm'
import { billingNavItems } from '@/components/Navbar/navitems'
import { BillGenerationJobStatus } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'

interface Props {
  bill_generation_job_status: Paginator<BillGenerationJobStatus>
  filters: {
    search: string
  }
}
export default function BillJobStatusIndexPage({ bill_generation_job_status, filters }: Props) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Billing',
      href: '/billing-groups',
    },
    {
      title: 'Bill Jobs',
      href: '/bills/job-status',
    },
  ]
  console.log(bill_generation_job_status)
  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={billingNavItems}
      title='Bill Jobs'
      selectedTopNav='Billing'
      selectedItem='Jobs'
    >
      <BillingJobStatusSearchForm filters={filters} />
      {bill_generation_job_status && bill_generation_job_status?.data?.length > 0 ? (
        <>
          <BillingJobList billGenerationJobStatus={bill_generation_job_status?.data} />
          <Pagination
            pagination={bill_generation_job_status}
            filters={filters}
          />
        </>
      ) : (
        <div className='flex h-full items-center justify-center'>No Billing Groups Found</div>
      )}
    </MainLayout>
  )
}
