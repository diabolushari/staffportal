import { Card } from '@/components/ui/card'
import { SdRegister } from '@/interfaces/data_interfaces'
import { getDisplayDate } from '@/utils'

interface Props {
  sdRegister?: SdRegister[]
}

export const getAssessmentYear = (sdRegister: SdRegister) => {
  const periodFrom = sdRegister.period_from
  const periodTo = sdRegister.period_to

  return `${periodFrom.split('-')[0]} - ${periodTo.split('-')[0]}`
}

const LastAssessmentCard = ({ sdRegister }: Props) => {
  return (
    <Card className='rounded-xl border bg-white p-6'>
      {/* Header */}
      <div className='mb-4 flex items-center justify-between'>
        <span className='text-xs font-semibold tracking-wider text-gray-500'>
          LAST ASSESSMENT SUMMARY
        </span>
        {!sdRegister?.[0].is_fully_settled ? (
          <span className='rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600'>
            Not Settled
          </span>
        ) : (
          <span className='rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600'>
            Settled
          </span>
        )}
      </div>

      {/* Assessment details */}
      <div className='mb-6 flex gap-16'>
        <div>
          <p className='mb-1 text-xs text-gray-500'>Assessed On</p>
          <p className='text-sm font-medium'>{getDisplayDate(sdRegister?.[0].generated_date)}</p>
        </div>

        <div>
          <p className='mb-1 text-xs text-gray-500'>Assessment Period</p>
          <p className='text-sm font-medium'>
            {sdRegister ? getAssessmentYear(sdRegister[0]) : '-'}
          </p>
        </div>
      </div>
      <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

      {/* Amount */}
      <div>
        <p className='mb-1 text-xs text-gray-500'>Security Deposit Required</p>
        <p className='text-kseb-primary text-2xl font-semibold'>
          ₹{sdRegister?.[0].sd_demand?.total_sd_amount}
        </p>
      </div>
    </Card>
  )
}

export default LastAssessmentCard
