import { Clock } from 'lucide-react'

interface Props {
  timeWindow: string
  timezone: string
  availableUnits: number
}

export default function StationBalanceCard({ timeWindow, timezone, availableUnits }: Props) {
  return (
    <div className='rounded-lg border bg-gray-50 p-4 shadow-sm'>
      <div className='flex flex-col gap-2 text-sm'>
        {/* <div className='flex justify-between'>
          <span className='text-gray-500'>Time Window</span>
          <span className='font-medium'>{timeWindow}</span>
        </div> */}

        <div className='flex justify-between'>
          <span className='text-gray-500'>Time Zone</span>
          <span className='flex items-center gap-1 font-medium'>
            <Clock className='h-3.5 w-3.5' />
            {timezone}
          </span>
        </div>

        <div className='flex justify-between'>
          <span className='text-gray-500'>Available Units</span>
          <span className='font-semibold'>{availableUnits}</span>
        </div>
      </div>
    </div>
  )
}
