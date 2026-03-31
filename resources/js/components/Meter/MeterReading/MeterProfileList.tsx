import { Card } from '@/components/ui/card'
import StrongText from '@/typography/StrongText'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'
import MeterReadingValueTooltip from './MeterReadingValueTooltip'

interface Props {
  profile: any
  hasData: boolean
  readings: any[]
  timezones: any[]
  onClick: () => void
  meterId: number
}

export default function MeterProfileCard({
  profile,
  hasData,
  readings,
  timezones,
  onClick,
  meterId,
}: Props) {
  return (
    <Card
      className={`hover:ring-primary relative cursor-pointer p-4 transition-all hover:ring-2 ${
        hasData ? 'border-green-500 shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <StrongText>
        {profile.display_name} {profile.is_export ? '(Export)' : ''}
      </StrongText>

      <div
        className={`mt-2 space-y-1 text-sm text-gray-600 ${
          timezones.length > 2
            ? 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent max-h-[60px] overflow-y-auto pr-1'
            : ''
        }`}
      >
        {readings?.map(
          (r: any) =>
            r.values?.diff && (
              <div
                key={r.timezone_id}
                className='flex justify-between border-b border-gray-100 py-1 last:border-0'
              >
                <span>{r.timezone_name}</span>
                <span className='font-medium text-gray-800'>{r.values.diff}</span>
              </div>
            )
        )}
      </div>

      <Tooltip>
        <TooltipTrigger>
          <Info className='absolute top-2 right-2 h-5 w-5 text-gray-400 hover:text-gray-600' />
        </TooltipTrigger>
        <TooltipContent
          side='top'
          className='bg-white'
        >
          <MeterReadingValueTooltip
            meterId={meterId}
            parameterId={profile.meter_parameter_id}
            readingsByMeter={readings}
          />
        </TooltipContent>
      </Tooltip>
    </Card>
  )
}
