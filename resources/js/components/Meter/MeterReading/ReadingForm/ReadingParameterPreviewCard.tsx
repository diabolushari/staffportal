import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { MeterProfileParameter, MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import { useMemo } from 'react'
import { MeterReadingFormState } from './useMeterReadingForm'

interface Props {
  meterWithTimezoneAndProfile: MeterWithTimezoneAndProfile
  readingValues: MeterReadingFormState[]
  profile: MeterProfileParameter
  children: React.ReactNode
  isOpen: boolean
  onToggle: (open: boolean) => void
  hasError: boolean
}

export default function ReadingParameterPreviewCard({
  meterWithTimezoneAndProfile,
  readingValues,
  profile,
  children,
  isOpen,
  hasError,
  onToggle,
}: Readonly<Props>) {
  const meterData = useMemo(() => {
    return readingValues.find((m) => m.meter_id === meterWithTimezoneAndProfile.meter_id)
  }, [readingValues, meterWithTimezoneAndProfile])

  const paramData = meterData?.parameters?.find(
    (p) => p.meter_parameter_id === profile.meter_parameter_id
  )

  const hasData = paramData?.readings?.some((r) => r.values?.final || r.values?.diff)

  const accordionValue = `${meterWithTimezoneAndProfile.meter_id}-${profile.meter_parameter_id}`

  const totalValue =
    profile.is_cumulative && paramData?.readings?.length
      ? paramData.readings.reduce((sum, r) => {
          return sum + Number(r.values?.value ?? 0)
        }, 0)
      : null

  return (
    <Accordion
      type='single'
      collapsible
      value={isOpen ? accordionValue : ''}
      onValueChange={(value) => onToggle(value === accordionValue)}
    >
      <AccordionItem
        value={accordionValue}
        className='border-none'
      >
        {/* ---------- HEADER ---------- */}
        <AccordionTrigger className='p-0 hover:no-underline'>
          <Card
            key={profile.meter_parameter_id}
            className={`hover:ring-primary bg-kseb-bg-blue relative w-full cursor-pointer p-4 transition-all hover:ring-2 ${hasError ? 'border-red-500' : `${hasData ? 'border-green-500 shadow-md' : ''}`} `}
          >
            <div className='flex items-center gap-2'>
              <StrongText>{profile.display_name}</StrongText>
              <Badge
                variant='secondary'
                className='text-xs'
              >
                {profile.is_export ? 'Export' : 'Import'}
              </Badge>
            </div>
            <div
              className={`mt-2 text-sm text-gray-600 ${
                meterWithTimezoneAndProfile?.timezones?.length > 2
                  ? 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-1'
                  : ''
              }`}
              style={{ scrollBehavior: 'smooth' }}
            >
              {!isOpen && (
                <>
                  {profile.is_cumulative ? (
                    <>
                      {/* Header */}
                      <div className='grid grid-cols-4 gap-2 border-b border-gray-200 pb-1 font-medium text-gray-700'>
                        <span></span>
                        <span className='text-right'>IR</span>
                        <span className='text-right'>FR</span>
                        <span className='text-right'>DIFF x MF</span>
                      </div>
                      {/* Rows */}
                      {paramData?.readings?.map((r) => {
                        return (
                          <div
                            key={r.timezone_id}
                            className='grid grid-cols-4 gap-2 border-b border-gray-100 py-1 last:border-0'
                          >
                            <span>{r.timezone_name}</span>

                            <span className='text-right font-medium text-gray-800'>
                              {r.values?.initial == '' ? '-' : r.values?.initial}
                            </span>

                            <span className='text-right font-medium text-gray-800'>
                              {r.values?.final == '' ? '-' : r.values?.final}
                            </span>

                            <span className='text-right font-medium'>
                              {r.values?.value == null ? '-' : r.values?.value.toFixed(2)}
                            </span>
                          </div>
                        )
                      })}
                      {profile.is_cumulative && totalValue !== null && (
                        <div className='mt-2 grid grid-cols-4 gap-2 pt-2 font-semibold text-gray-800'>
                          <span>Total</span>

                          <span className='text-right'></span>
                          <span className='text-right'></span>

                          <span className='text-right'>{totalValue.toFixed(2) ?? '-'}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Header */}
                      <div className='grid grid-cols-3 gap-2 border-b border-gray-200 pb-1 font-medium text-gray-700'>
                        <span></span>
                        <span className='text-right'>Reading</span>
                        <span className='text-right'>Reading x MF</span>
                      </div>
                      {/* Rows */}
                      {paramData?.readings?.map((r) => {
                        return (
                          <div
                            key={r.timezone_id}
                            className='grid grid-cols-3 gap-2 border-b border-gray-100 py-1 last:border-0'
                          >
                            <span>{r.timezone_name}</span>

                            <span className='text-right font-medium text-gray-800'>
                              {r.values?.final == '' ? '-' : r.values?.final}
                            </span>

                            <span className='text-right font-medium'>
                              {r.values?.value == null ? '-' : r.values?.value.toFixed(2)}
                            </span>
                          </div>
                        )
                      })}
                    </>
                  )}
                </>
              )}
            </div>
          </Card>
        </AccordionTrigger>

        {/* ---------- CONTENT BELOW CARD ---------- */}
        <AccordionContent
          className='pt-3'
          forceMount
        >
          <div className={isOpen ? 'block' : 'hidden'}>
            <div className='rounded-lg border bg-slate-50 p-4'>{children}</div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
