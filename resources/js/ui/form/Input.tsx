import { Input as ShadcnInput } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import ErrorText from '@/typography/ErrorText'
import React from 'react'
import { FormFieldProp } from '../ui_interfaces'

export default function Input({
  label,
  value,
  error,
  setValue,
  placeholder,
  disabled = false,
  readonly = false,
  preventFormSubmit = false,
  style = 'default',
  required = false,
  type = 'text',
  formatter,
  showClearButton = false,
  className = '',
  min,
  max,
  step,
}: Readonly<FormFieldProp>) {
  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (preventFormSubmit && event.key === 'Enter') {
      event.preventDefault()
    }
  }

  // Figma-based styling as default - clean white background with subtle border
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

      <div className='relative'>
        <ShadcnInput
          type={type}
          value={value}
          min={min ?? undefined}
          max={max ?? undefined}
          onKeyDown={handleKeydown}
          onChange={(event) =>
            formatter ? setValue(formatter(event.target.value)) : setValue(event.target.value)
          }
          placeholder={placeholder}
          className={figmaInputClasses}
          disabled={disabled}
          readOnly={readonly}
          required={required}
          step={step ?? undefined}
        />

        {showClearButton && value && (
          <button
            type='button'
            onClick={() => setValue('')}
            className='absolute top-1/2 right-2 -translate-y-1/2 text-xl text-gray-500 hover:text-red-500'
          >
            ✕
          </button>
        )}
      </div>

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}
