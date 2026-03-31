import { Card } from '@/components/ui/card'
import { BillGenerationJobStatus } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import { getDisplayDate } from '@/utils'
import dayjs from 'dayjs'
import { AlertTriangleIcon, CalendarDaysIcon } from 'lucide-react'

export default function BillListCard({
  status,
  onView,
}: {
  status: BillGenerationJobStatus
  onView: () => void
}) {
  const bill = status?.bill
  const connection = status?.connection

  return (
    <Card
      className='cursor-pointer transition-all duration-150 ease-in-out hover:scale-101'
      onClick={onView}
    >
      <div className='flex justify-between'>
        <div className='w-full'>
          {/* ================= BILL HEADER ================= */}
          <div className='flex flex-wrap items-center gap-2'>
            <div className='flex items-center gap-2'>
              <StrongText>{status?.bill_generation_job?.billing_group?.name}</StrongText>
            </div>
            |
            <div className='flex items-center gap-2'>
              <StrongText>{dayjs(bill?.bill_year_month).format('MMM YYYY')}</StrongText>
            </div>
            |
            <div className='flex items-center gap-2'>
              <div className='font-inter text-base leading-normal text-black'>
                <StrongText>#{connection.consumer_number}</StrongText>
              </div>
            </div>
            |
            <div className='flex items-center gap-2'>
              <StrongText>{connection.consumer_legacy_code}</StrongText>
            </div>
            |
            <div>
              {connection.consumer_profiles?.[0]?.organization_name && (
                <span className='font-inter text-base leading-normal text-black'>
                  <StrongText>{connection.consumer_profiles?.[0]?.organization_name}</StrongText>
                </span>
              )}
              {connection.consumer_profiles?.[0]?.consumer_name && (
                <span className='font-inter text-base leading-normal text-black'>
                  <StrongText>{connection.consumer_profiles?.[0]?.consumer_name}</StrongText>
                </span>
              )}
            </div>
          </div>

          {/* ================= EXCEPTION (TOP – AFTER HEADER) ================= */}
          {status.is_exception && (
            <div className='mt-3 flex items-start gap-2 rounded-md bg-red-50 p-2 text-sm text-red-700'>
              <AlertTriangleIcon
                size={16}
                className='mt-0.5'
              />
              <span>{status.exception || 'Exception occurred during bill generation'}</span>
            </div>
          )}

          {/* ================= BILL DETAILS ================= */}
          <div className='mt-4 space-y-1 text-sm text-gray-600'>
            <div className='flex gap-4'>
              <div className='flex items-center gap-2'>
                <div className='space-y-1 text-sm font-medium text-gray-600'>Reading Month: </div>
                <StrongText>{dayjs(bill?.reading_year_month).format('MMM YYYY')}</StrongText>
              </div>
            </div>

            <div className='flex gap-2'>
              <span className='font-medium'>Bill Amount:</span>
              <span className='font-semibold text-gray-900'>
                ₹ {bill?.bill_amount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className='flex gap-2'>
              <span className='font-medium'>Due Date:</span>
              <span className='text-orange-700'>{getDisplayDate(bill?.due_date)}</span>
            </div>

            <div className='flex gap-2'>
              <span className='font-medium'>Bill Date:</span>
              <span>{getDisplayDate(bill?.bill_date)}</span>
            </div>
          </div>

          {/* ================= GENERATED INFO ================= */}
          {status.job_completed_ts && (
            <div className='mt-3 flex items-center gap-2 text-gray-500'>
              <CalendarDaysIcon size={16} />
              <span className='text-sm'>
                Generated: {dayjs(status?.job_completed_ts).format('DD MMM YYYY, HH:mm')}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
