import { BillGenerationJobStatus } from '@/interfaces/data_interfaces'
import BillingJobCard from './BillingJobCard'
import { router } from '@inertiajs/react'

interface Props {
  billGenerationJobStatus: BillGenerationJobStatus[]
  isGroupNameVisible?: boolean
}

export default function BillingJobList({
  billGenerationJobStatus,
  isGroupNameVisible = true,
}: Props) {
  const handleView = (item: BillGenerationJobStatus) => {
    console.log(item)
    router.get(`/bills/job-status/${item.id}`)
  }
  return (
    <div className='flex flex-col gap-4 p-8'>
      {billGenerationJobStatus.map((job, index) => (
        <BillingJobCard
          key={index}
          month={job.reading_year_month}
          groupName={isGroupNameVisible ? job.billing_group?.name : undefined}
          completed={job.total_bills}
          total={job.total_connections}
          billYearMonth={job.bill_year_month}
          onView={() => handleView(job)}
          initializedDate={job?.initilized_date}
          exceptions={job.total_connections - job.total_bills}
        />
      ))}
    </div>
  )
}
