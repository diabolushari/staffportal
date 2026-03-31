import { Meter, MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import StrongText from '@/typography/StrongText'
import SelectList from '@/ui/form/SelectList'
import { MeterHealthFormData } from './useMeterHealthForm'

interface Props {
  meterWithTimezoneAndProfile: MeterWithTimezoneAndProfile
  healthData: MeterHealthFormData[]
  updateMeterHealth: (statusId: number, meter: Meter) => void
  updateCTPTHealth: (meterId: number, ctptId: number, statusId: string) => void
  meterHealthTypes: ParameterValues[]
  ctHealthTypes: ParameterValues[]
}

export default function MeterReadingHealthForm({
  meterWithTimezoneAndProfile,
  healthData,
  updateMeterHealth,
  updateCTPTHealth,
  meterHealthTypes,
  ctHealthTypes,
}: Readonly<Props>) {
  const meterHealth = healthData.find(
    (item) => item.meter_id === meterWithTimezoneAndProfile.meter_id
  )

  return (
    <div className='flex flex-col gap-2'>
      {meterHealthTypes.length > 0 && (
        <div className='flex items-center gap-2'>
          <SelectList
            label='Meter Health'
            value={meterHealth?.meter_health_id ?? ''}
            setValue={(value) =>
              updateMeterHealth(Number(value), meterWithTimezoneAndProfile.meter)
            }
            list={meterHealthTypes}
            dataKey='id'
            displayKey='parameter_value'
          />
        </div>
      )}

      <StrongText className='mt-4 mb-2 block'>CT / PT Transformers</StrongText>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        {meterWithTimezoneAndProfile.meter.transformers.map((ctpt) => {
          const existingHealth = meterHealth?.ctpts?.find(
            (item) => item.ctpt_id === ctpt.ctpt?.meter_ctpt_id
          )?.health

          return (
            <div
              key={ctpt.ctpt?.meter_ctpt_id}
              className='rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm'
            >
              <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
                <div className='flex flex-wrap items-center gap-4 text-sm'>
                  <div className='flex items-center gap-1'>
                    <span className='font-medium text-slate-700'>Serial:</span>
                    <span className='text-slate-600'>{ctpt.ctpt?.ctpt_serial ?? 'N/A'}</span>
                  </div>

                  <div className='flex items-center gap-1'>
                    <span className='font-medium text-slate-700'>Type:</span>
                    <span className='text-slate-600'>
                      {ctpt.ctpt?.type?.parameter_value ?? 'N/A'}
                    </span>
                  </div>

                  {ctpt.ctpt?.ratio_primary_value != null &&
                    ctpt.ctpt?.ratio_secondary_value != null && (
                      <div className='flex items-center gap-1'>
                        <span className='font-medium text-slate-700'>Ratio:</span>
                        <span className='text-slate-600'>
                          {ctpt.ctpt?.ratio_primary_value} / {ctpt.ctpt?.ratio_secondary_value}
                        </span>
                      </div>
                    )}
                </div>

                <div className='flex shrink-0 gap-2'>
                  <SelectList
                    label='CT/PT Health'
                    value={existingHealth ?? ''}
                    setValue={(value) =>
                      updateCTPTHealth(
                        meterWithTimezoneAndProfile.meter_id,
                        ctpt.ctpt?.meter_ctpt_id ?? 0,
                        value
                      )
                    }
                    list={ctHealthTypes}
                    dataKey='id'
                    displayKey='parameter_value'
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
