import { Listbox } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import ErrorText from '@/typography/ErrorText'
import { useMemo } from 'react'

export interface MultiSelectProps<
  K extends keyof T,
  G extends keyof T,
  U extends string | number,
  V extends string | number | null,
  T extends Record<K, U> & Record<G, V>,
> {
  value: U[]
  setValue: (value: U[]) => void
  label?: string
  error?: string
  list: T[]
  dataKey: K
  displayKey: G
  displayKey2?: G
  disabled?: boolean
  required?: boolean
  className?: string
}

export default function MultiSelectList<
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
  disabled = false,
  required = false,
  className = '',
}: MultiSelectProps<K, G, U, V, T>) {
  const safeList = Array.isArray(list) ? list : []

  const selectedItems = useMemo(
    () => safeList.filter((item) => value.map(String).includes(item[dataKey]?.toString())),
    [safeList, value, dataKey]
  )

  const buttonText =
    selectedItems.length > 0
      ? selectedItems
          .map((item) => `${item[displayKey]}${displayKey2 ? ` - ${item[displayKey2]}` : ''}`)
          .join(', ')
      : `Select ${label ?? 'options'}`

  return (
    <div className='space-y-1'>
      {label && (
        <label className='text-sm font-normal text-[#252c32]'>
          {required ? `${label} *` : label}
        </label>
      )}

      <Listbox
        value={value}
        onChange={setValue}
        multiple
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
            <span className='block truncate'>{buttonText}</span>
            <ChevronDown className='absolute top-3 right-3 h-4 w-4 text-gray-500' />
          </Listbox.Button>

          <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white shadow-md focus:outline-none'>
            {safeList.map((item) => (
              <Listbox.Option
                key={item[dataKey]}
                value={item[dataKey]}
                className={({ active }) =>
                  cn(
                    'flex cursor-pointer items-center justify-between px-3 py-2 text-sm',
                    active ? 'bg-kseb-primary text-white' : 'text-gray-900'
                  )
                }
              >
                {({ selected }) => (
                  <>
                    <span>
                      {item[displayKey]}
                      {displayKey2 && ` - ${item[displayKey2]}`}
                    </span>
                    {selected && <Check className='h-4 w-4' />}
                  </>
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
