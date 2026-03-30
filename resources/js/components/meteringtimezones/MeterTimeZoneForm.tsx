import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterValues } from '@/interfaces/parameter_types'
import { MeteringTimezone } from '@/pages/MeteringTimezones/MeteringTimezoneIndexPage'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import dayjs from 'dayjs'
import { Dispatch, SetStateAction, useState } from 'react'

interface Props {
  timezoneGroup: ParameterValues
  pricingTypes: ParameterValues[]
  timezoneNames: ParameterValues[]
  switchForm: Dispatch<SetStateAction<boolean>>
  timezone?: MeteringTimezone | undefined | null
  onComplete?: () => void
}

export default function MeterTimeZoneForm({
  timezoneGroup,
  pricingTypes,
  timezoneNames,
  switchForm,
  timezone,
  onComplete,
}: Props) {
  const [timeSummary, setTimeSummary] = useState<string>('')
  const { formData, setFormValue } = useCustomForm({
    timezone_type_id: timezoneGroup.id?.toString() ?? '',
    timezone_name_id: timezone?.timezone_name.id?.toString() ?? '',
    from_hrs: timezone?.from_hrs.toString() ?? '',
    from_mins: timezone?.from_mins.toString() ?? '',
    to_hrs: timezone?.to_hrs.toString() ?? '',
    to_mins: timezone?.to_mins.toString() ?? '',
    _method: timezone ? 'PUT' : 'POST',
  })
  const { post, errors, loading } = useInertiaPost<typeof formData>(
    timezone
      ? route('timezone-groups.update', timezone?.metering_timezone_id)
      : route('timezone-groups.store'),
    {
      onComplete: () => {
        onComplete?.()
      },
    }
  )
  const formatTime = (hrs: string, mins: string) =>
    `${hrs.padStart(2, '0')}:${mins.padStart(2, '0')}`

  // Compute time difference — supports next-day scenario
  const computeTimeSummary = (fromH: string, fromM: string, toH: string, toM: string) => {
    if (!fromH || !fromM || !toH || !toM) return ''

    const start = dayjs(`2000-01-01 ${formatTime(fromH, fromM)}`)
    let end = dayjs(`2000-01-01 ${formatTime(toH, toM)}`)

    // Handle "next day" scenario (e.g. 22:00 → 06:00)
    if (end.isBefore(start)) {
      end = end.add(1, 'day')
    }

    const duration = end.diff(start, 'minutes')
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60

    const nextDayText = end.isAfter(start, 'day') ? ' (next day)' : ''
    return `From ${formatTime(fromH, fromM)} to ${formatTime(toH, toM)}${nextDayText} — Duration: ${hours}h ${minutes}m`
  }

  // Update preview whenever user types
  const handleTimeChange = (key: string, value: string) => {
    setFormValue(key)(value)
    const { from_hrs, from_mins, to_hrs, to_mins } = {
      ...formData,
      [key]: value,
    }
    const summary = computeTimeSummary(from_hrs, from_mins, to_hrs, to_mins)
    setTimeSummary(summary)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-4'>
        <div>
          <SelectList
            label='Timezone'
            list={timezoneNames}
            dataKey='id'
            displayKey='parameter_value'
            value={formData.timezone_name_id}
            setValue={setFormValue('timezone_name_id')}
            error={errors.timezone_name_id}
          />
          <div className='flex justify-end'>
            <Button
              label='Add meter timezone'
              variant='link'
              onClick={() => switchForm(false)}
            />
          </div>
        </div>

        <StrongText className='text-sm font-medium text-gray-700'>From Time</StrongText>
        <div className='grid grid-cols-2 gap-4'>
          <Input
            label='Hours (00-23)'
            type='number'
            min={0}
            max={23}
            setValue={(val) => handleTimeChange('from_hrs', val)}
            value={formData.from_hrs}
            placeholder='00'
            required
            error={errors.from_hrs}
          />
          <Input
            label='Minutes (00-59)'
            type='number'
            min={0}
            max={59}
            setValue={(val) => handleTimeChange('from_mins', val)}
            value={formData.from_mins}
            placeholder='00'
            required
            error={errors.from_mins}
          />
        </div>

        <StrongText className='text-sm font-medium text-gray-700'>To Time</StrongText>
        <div className='grid grid-cols-2 gap-4'>
          <Input
            label='Hours (00-24)'
            type='number'
            min={0}
            max={24}
            setValue={(val) => handleTimeChange('to_hrs', val)}
            value={formData.to_hrs}
            placeholder='00'
            required
            error={errors.to_hrs}
          />
          <Input
            label='Minutes (00-59)'
            type='number'
            min={0}
            max={59}
            setValue={(val) => handleTimeChange('to_mins', val)}
            value={formData.to_mins}
            placeholder='00'
            required
            error={errors.to_mins}
          />
        </div>

        <div className='text-sm text-gray-600'>{timeSummary}</div>
        <Button
          type='submit'
          label='Save'
          variant={loading ? 'loading' : 'primary'}
          processing={loading}
          disabled={loading}
        />
      </div>
    </form>
  )
}
