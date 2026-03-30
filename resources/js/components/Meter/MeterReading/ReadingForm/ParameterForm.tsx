import { Card } from '@/components/ui/card'
import { Meter, MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import MeterReadingValueForm from './MeterReadingValueForm'

export default function ParameterForm({
  activeProfile,
  metersWithTimezonesAndProfiles,
  formData,
  updateReading,
  setActiveProfile,
}: {
  activeProfile: {
    meterIdx: number
    profileIdx: number
  } | null
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
  formData: any
  updateReading: (
    meterId: number,
    meterParameterId: number,
    timezoneId: number,
    rowKey: string,
    value: any,
    meter: Meter
  ) => void
  setActiveProfile: (
    profile: {
      meterIdx: number
      profileIdx: number
    } | null
  ) => void
}) {
  if (activeProfile !== null) {
    const meter = metersWithTimezonesAndProfiles[activeProfile.meterIdx]
    const profile = meter.reading_parameters[activeProfile.profileIdx]
    const meterData = formData.readings_by_meter.find((m: any) => m.meter_id === meter.meter_id)
    const paramData = meterData?.parameters.find(
      (p: any) => p.meter_parameter_id === profile.meter_parameter_id
    )

    return (
      <div className='flex flex-col gap-4'>
        <Card className='p-4'>
          <StrongText>{profile?.display_name}</StrongText>
          <div
            className={`mt-2 ${
              paramData?.readings?.length > 2 ? 'max-h-64 overflow-y-auto pr-2' : ''
            }`}
          >
            <MeterReadingValueForm
              timeZoneNames={meter?.timezones?.map((tz: any) => ({
                id: tz.timezone_id,
                name: tz.timezone_name,
              }))}
              parameterReadingValues={paramData?.readings || []}
              onChange={(rowKey, tzId, val) =>
                updateReading(
                  meter.meter_id,
                  profile.meter_parameter_id,
                  tzId,
                  rowKey,
                  val,
                  meter.meter
                )
              }
              onMultiplierChange={(tzId, val) =>
                updateReading(
                  meter.meter_id,
                  profile.meter_parameter_id,
                  tzId,
                  'mf',
                  val,
                  meter.meter
                )
              }
              meter={meter.meter}
            />
          </div>

          <div className='mt-4 flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={() => setActiveProfile(null)}
              label='Cancel'
            />
            <Button
              onClick={() => setActiveProfile(null)}
              label='Save'
            />
          </div>
        </Card>
      </div>
    )
  }
  return null
}
