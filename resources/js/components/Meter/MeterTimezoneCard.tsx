import Button from '@/ui/button/Button'
import { Card } from '../ui/card'
import { Meter, MeterTimezoneType } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterValues } from '@/interfaces/parameter_types'
import useCustomForm from '@/hooks/useCustomForm'
import SelectList from '@/ui/form/SelectList'
interface StoreForm {
  meter_id: number | string
  timezone_type_id: number | string
  _method?: 'PUT' | undefined
}
export default function MeterTimezoneCard({
  meter,
  currentTimezone,
  timezoneTypes,
}: {
  meter: Meter
  currentTimezone: MeterTimezoneType | null
  timezoneTypes: ParameterValues[]
}) {
  const { formData, setFormValue } = useCustomForm<StoreForm>({
    timezone_type_id: currentTimezone?.timezone_type?.id ?? '',
    meter_id: meter.meter_id,
    _method: currentTimezone ? 'PUT' : undefined,
  })

  const { post, loading } = useInertiaPost<StoreForm>(
    currentTimezone
      ? route('meter-timezone-rel.update', Number(currentTimezone?.rel_id))
      : route('meter-timezone-rel.store'),
    {}
  )
  const handleSave = () => {
    post(formData)
  }

  return (
    <Card className='rounded-lg p-7'>
      <div className='mb-6 flex items-center justify-between'>
        <StrongText className='text-base font-semibold text-[#252c32]'>
          Timezone Information
        </StrongText>
      </div>
      <hr className='bg-kseb-line mb-6 h-[2px] border-0' />
      {
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <SelectList
            label='Timezone Type'
            list={timezoneTypes}
            value={formData.timezone_type_id}
            setValue={setFormValue('timezone_type_id')}
            displayKey={'parameter_value'}
            dataKey={'id'}
          />
          <div className='flex gap-2'>
            <Button
              label='Save Changes'
              onClick={handleSave}
              disabled={loading}
            />
          </div>
        </div>
      }
    </Card>
  )
}
