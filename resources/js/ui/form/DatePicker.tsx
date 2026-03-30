import ErrorText from '@/typography/ErrorText'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface DatePickerProp {
  value: string | null | undefined
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  error?: string
  styles?: string
  placeholder?: string
  setValue: (value: string) => unknown
  disabled?: boolean
  readonly?: boolean
  isDate?: boolean
  isTime?: boolean
  preventFormSubmit?: boolean
  style?: string
  required?: boolean
  formatter?: (value: string) => string
  showClearButton?: boolean
  min?: string
  max?: string
  className?: string
}

const convertToDate = (dateString: string | undefined | null): Date | null => {
  if (dateString == null || dateString === '') {
    return null
  }
  const parsed = dayjs(dateString, 'YYYY-MM-DD', true)
  return parsed.isValid() ? parsed.toDate() : null
}

export default function Datepicker({
  label,
  value,
  error,
  setValue,
  placeholder,
  min,
  max,
  disabled = false,
  required,
}: Readonly<DatePickerProp>) {
  const { dateObject, minDate, maxDate } = useMemo(() => {
    return {
      dateObject: convertToDate(value),
      minDate: convertToDate(min),
      maxDate: convertToDate(max),
    }
  }, [value, min, max])

  const formatForDB = (date: Date): string => {
    return dayjs(date).format('YYYY-MM-DD')
  }

  return (
    <div className='flex flex-col'>
      {label != null && (
        <label className='text-sm leading-6 font-normal text-[#252c32]'>
          {required ? `${label} *` : label}
        </label>
      )}

      <DatePicker
        selected={dateObject}
        onChange={(date: Date | null) => setValue(date ? formatForDB(date) : '')}
        placeholderText={placeholder ?? 'dd/mm/yyyy'}
        minDate={minDate ?? undefined}
        maxDate={maxDate ?? undefined}
        disabled={disabled}
        dateFormat='dd/MM/yyyy'
        className='rounded border px-3 py-2'
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}
