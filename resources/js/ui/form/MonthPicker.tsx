import React from 'react'
import { Input as ShadcnInput } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import ErrorText from '@/typography/ErrorText'
import { FormFieldProp } from '../ui_interfaces'

interface MonthPickerProp {
  label?: string
  value: string
  error?: string
  setValue: (value: string) => void
  placeholder?: string
  min?: string // format: YYYY-MM
  max?: string // format: YYYY-MM
  disabled?: boolean
  required?: boolean
  className?: string
}

export default function MonthPicker({
  label,
  value,
  error,
  setValue,
  placeholder,
  min,
  max,
  disabled = false,
  required = false,
  className = '',
}: Readonly<MonthPickerProp>) {
  const figmaInputClasses = cn(
    'w-full bg-white px-3 py-2 rounded border border-gray-200 text-sm font-normal text-black',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0078d4] focus-visible:border-kseb-primary',
    'disabled:bg-gray-50 disabled:text-black disabled:cursor-not-allowed disabled:opacity-100',
    'placeholder:text-gray-400',
    className
  )

  return (
    <div className='space-y-1'>
      {label != null && (
        <label className='text-sm leading-6 font-normal text-[#252c32]'>
          {required ? `${label} *` : label}
        </label>
      )}

      <ShadcnInput
        type='month'
        value={value}
        min={min ?? undefined}
        max={max ?? undefined}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={figmaInputClasses}
        disabled={disabled}
        required={required}
      />

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}
