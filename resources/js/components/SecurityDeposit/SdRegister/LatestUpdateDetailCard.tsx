import { Card } from '@/components/ui/card'
import { SdRegister } from '@/interfaces/data_interfaces'
import { getDisplayDate } from '@/utils'
import { FileText, Banknote, Undo2 } from 'lucide-react'

interface Props {
  sdRegister?: SdRegister[]
}

const LatestUpdateDetailCard = ({ sdRegister }: Props) => {
  const collections = sdRegister?.flatMap((item) => item.sd_demand?.collections ?? []) ?? []

  const sortedCollections = [...collections].sort(
    (a, b) => new Date(b.collection_date).getTime() - new Date(a.collection_date).getTime()
  )

  const latestCollection = sortedCollections[0]

  const latestRefundCollection =
    sortedCollections?.find((c) => c.status?.parameter_value.toLowerCase() === 'refund') ?? null

  return (
    <Card className='rounded-xl p-6'>
      <div className='space-y-6'>
        {/* Latest Demand */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 text-gray-600'>
            <FileText className='h-5 w-5' />
            <span className='text-sm font-medium'>Latest Demand</span>
          </div>

          <div className='text-right'>
            <p className='text-sm font-semibold text-gray-800'>
              ₹{sdRegister?.[0].sd_demand?.total_sd_amount}
            </p>
            <p className='text-xs text-gray-400'>
              {getDisplayDate(sdRegister?.[0].generated_date)}
            </p>
          </div>
        </div>

        {/* Latest Collection */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 text-gray-600'>
            <Banknote className='h-5 w-5' />
            <span className='text-sm font-medium'>Latest Collection</span>
          </div>

          <div className='text-right'>
            <p className='text-sm font-semibold text-green-600'>
              ₹{latestCollection?.collection_amount}
            </p>
            <p className='text-xs text-gray-400'>
              {getDisplayDate(latestCollection?.collection_date)}
            </p>
          </div>
        </div>

        {/* Latest Refund */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 text-gray-600'>
            <Undo2 className='h-5 w-5' />
            <span className='text-sm font-medium'>Latest Refund</span>
          </div>

          <div className='text-right'>
            <p className='text-sm font-semibold text-orange-500'>
              ₹{latestRefundCollection?.collection_amount}
            </p>
            <p className='text-xs text-gray-400'>
              {latestRefundCollection
                ? getDisplayDate(latestRefundCollection?.collection_date)
                : '--'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default LatestUpdateDetailCard
