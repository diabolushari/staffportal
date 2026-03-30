import { Card } from '@/components/ui/card'
import {
  MeterConnectionMapping,
  MeterReading,
  MeterReadingValue,
} from '@/interfaces/data_interfaces'
import { CONSUMPTION_PARAMETER_NAME, KVA_PARAMETER_NAME } from '@/types/constants'
import NormalText from '@/typography/NormalText'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import { router } from '@inertiajs/react'
import dayjs from 'dayjs'
import { useMemo } from 'react'

interface Props {
  meterReading: MeterReading
  meters: MeterConnectionMapping[]
}

export default function MeterReadingCard({ meterReading, meters }: Readonly<Props>) {
  const meterSummaries = useMemo(() => {
    return meters.map((meterWithConn) => {
      const meter = meterWithConn.meter

      const filteredValues =
        meterReading?.values?.filter((v: MeterReadingValue) => v.meter_id === meter?.meter_id) ?? []

      const kvaValues = filteredValues.filter(
        (v) => v.meter_profile_parameter?.name.toLowerCase() == KVA_PARAMETER_NAME.toLowerCase()
      )
      console.log(kvaValues)
      let kvaMax = null
      if (kvaValues?.length > 0) {
        kvaMax = kvaValues.reduce(
          (max: MeterReadingValue | null, curr: MeterReadingValue | null) => {
            return (curr?.value ?? 0) > (max?.value ?? 0) ? curr : max
          },
          null
        )
      }

      const kwhSum = filteredValues
        .filter(
          (v) =>
            v.meter_profile_parameter?.name.toLowerCase() ===
              CONSUMPTION_PARAMETER_NAME.toLowerCase() &&
            v.meter_profile_parameter?.is_export == false
        )
        .reduce((sum, v) => sum + (v.value ?? 0), 0)

      return {
        meterId: meter?.meter_id,
        serial: meter?.meter_serial,
        meter: meter,
        meter_pf: meterReading?.power_factors.filter((pf) => pf.meter_id === meter?.meter_id)[0],
        meterProfile: meterWithConn?.meter_profile,
        kva: kvaMax
          ? {
              value: kvaMax.value ?? 0,
              timezone: kvaMax.time_zone?.parameter_value ?? '-',
            }
          : null,
        kwhSum,
      }
    })
  }, [meterReading, meters])

  return (
    <Card className='mb-4 p-4'>
      <div className='flex justify-between'>
        <div className='flex flex-col'>
          <StrongText className='mb-2 text-lg font-semibold'>
            Meter Reading: {dayjs(meterReading?.metering_date).format('DD-MM-YYYY')}
          </StrongText>
          <NormalText>
            {dayjs(meterReading?.reading_start_date).format('DD-MM-YYYY')} to{' '}
            {dayjs(meterReading?.reading_end_date).format('DD-MM-YYYY')}
          </NormalText>
        </div>
        <Button
          onClick={() =>
            router.visit(
              `/meter-reading/${meterReading.id}?connection_id=${meterReading.connection_id}`
            )
          }
          label='View'
          variant='secondary'
        />
      </div>
      <div className='mt-4 space-y-4'>
        {meterSummaries.map((summary) => (
          <div
            key={summary.meterId}
            className='flex flex-col gap-2 rounded-lg border bg-gray-50 p-3'
          >
            <StrongText className='text-md font-semibold'>
              Meter Serial: {summary.serial}({summary.meterProfile?.parameter_value})
            </StrongText>
            {summary.meter_pf && (
              <NormalText>
                Power Factor:{' '}
                {summary.meter_pf?.average_power_factor != null
                  ? summary.meter_pf?.average_power_factor.toFixed(2)
                  : '-'}
              </NormalText>
            )}

            <div className='mt-1 text-sm text-gray-700'>
              {summary?.kva ? (
                <p>
                  <b>KVA (highest):</b> {summary.kva.value} at timezone {summary.kva.timezone}
                </p>
              ) : (
                <p>No KVA data available</p>
              )}
              <p>
                <b>KWH (sum):</b> {summary.kwhSum}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
