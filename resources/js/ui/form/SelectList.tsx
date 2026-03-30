import { Listbox } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import ErrorText from '@/typography/ErrorText'
import { useMemo } from 'react'
import { FormFieldProp as FormFieldProperty } from '../ui_interfaces'

export interface Properties<
  K extends keyof T,
  G extends keyof T,
  U extends string | number,
  V extends string | number | null,
  T extends Record<K, U> & Record<G, V>,
> extends FormFieldProperty {
  list: T[]
  dataKey: K
  displayKey: G
  displayKey2?: G
  showLabel?: boolean
  disabled?: boolean
  required?: boolean
  showAllOption?: boolean
  allOptionText?: string
  className?: string
}

export default function SelectList<
  K extends keyof T,
  G extends keyof T,
  U extends string | number,
  V extends string | number | null,
  T extends Record<K, U> & Record<G, V>,
>({
  value,
  setValue,
  label,
  error,
  list,
  dataKey,
  displayKey,
  displayKey2,
  showLabel = true,
  disabled = false,
  required = false,
  showAllOption = false,
  allOptionText = 'All',
  className = '',
}: Properties<K, G, U, V, T>) {
  const safeList = Array.isArray(list) ? list : []

  const selectedItem = useMemo(
    () => safeList.find((item) => item[dataKey]?.toString() === value?.toString()),
    [safeList, dataKey, value]
  )

  const buttonText = selectedItem
    ? `${selectedItem[displayKey]}${displayKey2 ? ` - ${selectedItem[displayKey2]}` : ''}`
    : showAllOption
      ? allOptionText
      : `Select ${label ?? 'option'}`

  return (
    <div className='space-y-1'>
      {label && showLabel && (
        <label className='text-sm font-normal text-[#252c32]'>
          {required ? `${label} *` : label}
        </label>
      )}

      <Listbox
        value={value}
        onChange={setValue}
        disabled={disabled}
      >
        <div className='relative'>
          <Listbox.Button
            className={cn(
              'w-full rounded border border-gray-200 bg-white px-3 py-2 pr-10 text-left text-sm',
              'focus:ring-kseb-primary focus:border-kseb-primary focus:ring-1 focus:outline-none',
              'disabled:cursor-not-allowed disabled:bg-gray-50',
              className
            )}
          >
            <span>{buttonText}</span>
            <ChevronDown className='absolute top-3 right-3 h-4 w-4 text-gray-500' />
          </Listbox.Button>

          <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white shadow-md focus:outline-none'>
            {showAllOption && (
              <Listbox.Option
                value={'' as U}
                className={({ active }) =>
                  cn(
                    'cursor-pointer px-3 py-2 text-sm',
                    active ? 'bg-kseb-primary text-white' : 'text-gray-900'
                  )
                }
              >
                {({ selected }) => (
                  <div className='flex items-center justify-between'>
                    <span>{allOptionText}</span>
                    {selected && <Check className='h-4 w-4 text-white' />}
                  </div>
                )}
              </Listbox.Option>
            )}

            {safeList.map((item) => (
              <Listbox.Option
                key={item[dataKey]}
                value={item[dataKey]}
                className={({ active }) =>
                  cn(
                    'cursor-pointer px-3 py-2 text-sm',
                    active ? 'bg-kseb-primary text-white' : 'text-gray-900'
                  )
                }
              >
                {({ selected }) => (
                  <div className='flex items-center justify-between'>
                    <span>
                      {item[displayKey]}
                      {displayKey2 && ` - ${item[displayKey2]}`}
                    </span>
                    {selected && <Check className='h-4 w-4 text-white' />}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}
