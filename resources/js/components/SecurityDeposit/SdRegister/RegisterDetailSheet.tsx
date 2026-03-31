import { Card } from '@/components/ui/card'
import { SdCollection, SdRegister } from '@/interfaces/data_interfaces'
import { getDisplayDate } from '@/utils'
import { getAssessmentYear } from './LastAssessmentCard'

interface Props {
  sdRegister: SdRegister
}

const RegisterDetailSheet = ({ sdRegister }: Props) => {
  return (
    <div className='space-y-4 p-2'>
      {/* Top Summary */}
      <Card className='space-y-3 rounded-xl border bg-gray-50 p-4'>
        <div className='flex justify-between text-xs font-semibold text-gray-500'>
          <span>FIN YEAR {getAssessmentYear(sdRegister)}</span>

          <span className='flex items-center gap-2'>
            {sdRegister.is_fully_settled ? (
              <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700'>
                SETTLED
              </span>
            ) : (
              <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700'>
                NOT SETTLED
              </span>
            )}
          </span>
        </div>

        <div className='flex justify-between text-sm'>
          <span className='text-gray-500'>SD Type</span>
          <span className='font-medium text-gray-800'>{sdRegister?.sd_type?.name}</span>
        </div>

        <div className='flex justify-between text-sm'>
          <span className='text-gray-500'>Assessment Date</span>
          <span className='font-medium text-gray-800'>
            {getDisplayDate(sdRegister?.generated_date)}
          </span>
        </div>

        <div className='flex justify-between text-sm'>
          <span className='text-gray-500'>SD Amount</span>
          <span className='font-semibold text-gray-900'>
            {sdRegister?.sd_demand?.total_sd_amount}
          </span>
        </div>
      </Card>

      {/* Collection Details */}
      <div className='text-xs font-semibold tracking-wide text-gray-500'>COLLECTION DETAILS</div>

      {sdRegister?.sd_demand?.collections?.map((collection: SdCollection) => (
        <Card
          key={collection.sd_collection_id}
          className='space-y-1 rounded-xl border bg-gray-50 p-2'
        >
          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Collection Date</span>
            <span className='font-medium text-gray-800'>
              {getDisplayDate(collection.collection_date)}
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Status</span>
            <span className='font-medium text-gray-800'>{collection.status.parameter_value}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Payment Mode</span>
            <span className='font-medium text-gray-800'>
              {collection?.payment_mode.parameter_value}
            </span>
          </div>

          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Collection Amount</span>
            <span className='font-semibold text-gray-900'>₹{collection?.collection_amount}</span>
          </div>

          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Receipt Number</span>
            <span className='font-medium text-gray-800'>{collection?.receipt_number}</span>
          </div>

          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Collected By</span>
            <span className='font-medium text-gray-800'>{collection?.collected_by}</span>
          </div>

          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Collected At</span>
            <span className='font-medium text-gray-800'>{collection?.collected_at}</span>
          </div>

          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Transaction Ref</span>
            <span className='font-medium text-gray-800'>{collection?.transaction_ref}</span>
          </div>

          {collection?.remarks && (
            <div className='border-t pt-2'>
              <div className='mb-1 text-xs font-semibold text-gray-500'>REMARKS</div>
              <div className='text-sm text-gray-600'>{collection?.remarks}</div>
            </div>
          )}
        </Card>
      ))}
      {!sdRegister?.sd_demand?.collections?.length && (
        <Card className='rounded-xl border bg-gray-50 p-4 text-center text-sm text-gray-500'>
          No collection records found
        </Card>
      )}
    </div>
  )
}

export default RegisterDetailSheet
