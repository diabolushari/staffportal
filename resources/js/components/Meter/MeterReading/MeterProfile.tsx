import { Meter, MeterTransformer, MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import StrongText from '@/typography/StrongText'
import SelectList from '@/ui/form/SelectList'
import { useMemo } from 'react'
import MeterProfileList from './MeterProfileList'

interface Props {
  meterIdx: number
  meterWithTimezoneAndProfile: MeterWithTimezoneAndProfile
  formData: any
  updateMeterHealth: (value: number, meter: Meter) => void
  updateCTPTHealth: (meterId: number, ctptId: number, healthId: number, meter: Meter) => void
  setActiveProfile: (
    profile: {
      meterIdx: number
      profileIdx: number
    } | null
  ) => void
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
}

export default function MeterProfile({
  meterIdx,
  meterWithTimezoneAndProfile,
  formData,
  updateMeterHealth,
  updateCTPTHealth,
  setActiveProfile,
  meterHealthTypes,
  ctptHealthTypes,
}: Props) {
  const findMeterHealthValue = useMemo(() => {
    return (
      formData.meter_health.find((m: any) => m.meter_id === meterWithTimezoneAndProfile.meter_id)
        ?.meter_health_id ?? ''
    )
  }, [formData])

  const findCTPTHealthValue = useMemo(() => {
    return (
      formData?.ctpt_health.find((m: any) => m.meter_id === meterWithTimezoneAndProfile.meter_id)
        ?.meter_health_id ?? ''
    )
  }, [formData])

  return (
    <div
      key={meterWithTimezoneAndProfile.meter_id}
      className='flex flex-col gap-4'
    >
      <StrongText className='mb-2 block'>
        Meter {meterWithTimezoneAndProfile.meter.meter_serial}
      </StrongText>
      <div className='flex gap-2'>
        {meterHealthTypes && (
          <SelectList
            label='Meter Health'
            value={findMeterHealthValue}
            setValue={(value) =>
              updateMeterHealth(Number(value), meterWithTimezoneAndProfile.meter)
            }
            list={meterHealthTypes}
            dataKey='id'
            displayKey='parameter_value'
            required
          />
        )}

        {meterWithTimezoneAndProfile.meter.transformers.map((ctpt: MeterTransformer) => (
          <div
            key={ctpt.meter_ctpt_id}
            className='mb-2 flex items-center gap-4'
          >
            <SelectList
              label={`CT/PT Health ${ctpt.ctpt_serial}`}
              value={findCTPTHealthValue}
              setValue={(value) =>
                updateCTPTHealth(
                  meterWithTimezoneAndProfile.meter_id,
                  ctpt.meter_ctpt_id,
                  Number(value),
                  meterWithTimezoneAndProfile.meter
                )
              }
              list={ctptHealthTypes}
              dataKey='id'
              displayKey='parameter_value'
              required
            />
          </div>
        ))}
      </div>

      {meterWithTimezoneAndProfile.reading_parameters.map((profile: any, pIdx: number) => (
        <MeterProfileList
          key={pIdx}
          profile={profile}
          hasData={formData.readings_by_meter.some(
            (r: any) => r.meter_parameter_id === profile.meter_parameter_id
          )}
          readings={formData.readings_by_meter}
          timezones={meterWithTimezoneAndProfile.timezones}
          onClick={() => setActiveProfile({ meterIdx, profileIdx: pIdx })}
          meterId={meterWithTimezoneAndProfile.meter_id}
        />
      ))}
    </div>
  )
}
