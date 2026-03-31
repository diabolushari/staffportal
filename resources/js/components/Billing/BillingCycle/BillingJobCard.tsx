import { Card } from '@/components/ui/card'
import Button from '@/ui/button/Button'
import { cn, getDisplayDate, getDisplayMonthYear } from '@/utils'
import dayjs from 'dayjs'
import { CalendarDaysIcon } from 'lucide-react'

interface BillingJobCardProps {
  month: string // e.g., "Nov 2025"
  groupName?: string // e.g., "Group 1"
  completed: number
  total: number
  initializedDate?: string
  onView: () => void
  billYearMonth?: string
  exceptions?: number
  pending?: number
}

export default function BillingJobCard({
  month,
  groupName,
  completed,
  total,
  exceptions,
  pending,
  initializedDate,
  onView,
  billYearMonth,
}: BillingJobCardProps) {
  return (
    <Card className='cursor-pointer transition-all duration-150 ease-in-out hover:scale-101'>
      {/* Header */}
      <div
        className='flex items-center justify-between'
        onClick={onView}
      >
        <div>
          <div className='text-lg font-semibold text-gray-900'>
            {dayjs(month).format('MMM YYYY')} | {groupName ? groupName : ''}
          </div>

          {/* Status Info */}
          <div className='mt-3 space-y-1 text-sm text-gray-600'>
            <div className='flex gap-2'>
              <span className='font-medium'>Completed:</span>
              <span className={cn('text-orange-800', completed === total && 'text-green-600')}>
                {completed}/{total}
              </span>
            </div>
            <div className='flex gap-2'>
              <span className='font-medium'>Pending:</span>
              <span className='text-orange-600'>{pending ?? 0}</span>
            </div>

            <div className='flex gap-2'>
              <span className='font-medium'>Exceptions:</span>
              <span className='text-red-600'>{exceptions ?? 0}</span>
            </div>

            {initializedDate && (
              <div className='mt-2 flex items-center gap-2 text-gray-500'>
                <CalendarDaysIcon size={16} />
                <span className='text-sm'>Initialized: {getDisplayDate(initializedDate)}</span>
              </div>
            )}
          </div>
        </div>
        {/* View Button */}
      </div>
    </Card>
  )
}
