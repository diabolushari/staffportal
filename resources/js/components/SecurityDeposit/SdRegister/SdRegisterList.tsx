import { Connection } from '@/interfaces/data_interfaces'
import { router } from '@inertiajs/react'
import { getAssessmentYear } from './LastAssessmentCard'
import { getDisplayDate } from '@/utils'

interface Props {
  connections: Connection[]
}

const SdRegisterList = ({ connections }: Props) => {
  return (
    <>
      {connections.map((connection) => (
        <div
          key={connection.connection_id}
          className='border-kseb-line mb-4 w-full cursor-pointer border bg-white shadow-sm'
          onClick={() => router.get(route('sd-register.show', connection.connection_id))}
        >
          <div className='flex items-start justify-between p-4'>
            <div className='flex flex-col gap-1 text-sm'>
              <span className='font-semibold'>
                {connection.consumer_profiles?.[0]?.consumer_name}
              </span>
              <span>Consumer Number: {connection.consumer_number}</span>
              <span>Legacy Code: {connection.consumer_legacy_code}</span>
            </div>

            <span className='rounded bg-gray-200 px-3 py-1 text-xs font-medium'>
              {connection.billing_group?.name}
            </span>
          </div>

          <div className='bg-kseb-bg-blue grid grid-cols-4 items-center px-4 py-3 text-sm'>
            <div className='flex flex-col'>
              <span className='text-gray-600'>SD Assessed</span>
              <span className='font-semibold'>
                {connection?.sd_balance_summary?.[0]?.sd_principal_required
                  ? `₹ ${connection.sd_balance_summary[0].sd_principal_required}`
                  : '-'}
              </span>
            </div>

            <div className='flex flex-col'>
              <span className='text-gray-600'>SD Available</span>
              <span className='font-semibold'>
                {connection?.sd_balance_summary?.[0]?.sd_principal_on_file
                  ? `₹ ${connection.sd_balance_summary[0].sd_principal_on_file}`
                  : '-'}
              </span>
            </div>

            <div className='flex flex-col'>
              <span className='text-gray-600'>Difference</span>
              <span
                className={`font-semibold ${Number(connection?.sd_balance_summary?.[0]?.sd_principal_variance) < 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                {connection?.sd_balance_summary?.[0]?.sd_principal_variance
                  ? `₹ ${Math.abs(Number(connection.sd_balance_summary[0].sd_principal_variance))}`
                  : '-'}
              </span>
            </div>
          </div>

          <div className='flex gap-12 p-4 text-sm'>
            <div className='flex flex-col'>
              <span className='text-gray-600'>Assessment Period</span>
              <span>
                {' '}
                {connection.latest_sd_register
                  ? getAssessmentYear(connection.latest_sd_register)
                  : '-'}
              </span>
            </div>

            <div className='flex flex-col'>
              <span className='text-gray-600'>Assessment Date</span>
              <span>
                {connection.latest_sd_register
                  ? getDisplayDate(connection.latest_sd_register.generated_date)
                  : '-'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default SdRegisterList
