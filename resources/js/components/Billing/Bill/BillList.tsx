import { BillGenerationJobStatus } from '@/interfaces/data_interfaces'
import { router } from '@inertiajs/react'
import BillListCard from './BillListCard'

export default function BillList({ data }: { data: BillGenerationJobStatus[] }) {
  if (!data?.length) {
    return <div className='mt-10 text-center text-gray-500'>No bills found</div>
  }

  const sortedData = [...data].sort((a, b) => {
    const aHasBill = Boolean(a.bill?.bill_id)
    const bHasBill = Boolean(b.bill?.bill_id)

    return Number(bHasBill) - Number(aHasBill)
  })

  const handleCardClick = (status: BillGenerationJobStatus) => {
    if (!status.bill?.bill_id) {
      router.get(`connection/${Number(status?.connection?.connection_id)}/meter-reading`)
    } else {
      window.open(`/bills/${status?.bill?.bill_id}`, '_blank')
    }
  }

  return (
    <div className='space-y-4'>
      {sortedData.map((status) => (
        <BillListCard
          key={status.bill?.bill_id ?? status.id}
          status={status}
          onView={() => handleCardClick(status)}
        />
      ))}
    </div>
  )
}
