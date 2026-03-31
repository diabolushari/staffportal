import { FormFieldProp as FormFieldProperty } from '@/ui/ui_interfaces'
import React, { useMemo } from 'react'
import ErrorText from '@/typography/ErrorText'

export interface Properties<
  K extends keyof T,
  G extends keyof T,
  U extends number | string,
  V extends number | string | null,
  T extends Record<K, U> & Record<G, V>,
> extends FormFieldProperty {
  list: T[]
  dataKey: K
  displayKey: G
  showLabel?: boolean
}

export default function RadioGroup<
  K extends keyof T,
  G extends keyof T,
  U extends number | string,
  V extends number | string | null,
  T extends Record<K, U> & Record<G, V>,
>({
  label,
  list,
  error,
  displayKey,
  dataKey,
  setValue,
  showLabel = true,
  value,
}: Properties<K, G, U, V, T>) {
  const selectedOption = useMemo(() => {
    const index = list.findIndex((item) => {
      return item[dataKey] == value
    })
    return index === -1 ? '' : value
  }, [value, dataKey, list])

  return (
    <div className='flex flex-col gap-1'>
      {label != null && showLabel && <label className='standard-label small-1stop'>{label}</label>}
      <div className='flex-col-4 flex gap-2'>
        {list.map((item: T) => (
          <label
            className='flex cursor-pointer items-center gap-2'
            key={item[dataKey]}
          >
            <input
              type='radio'
              value={item[dataKey]}
              checked={item[dataKey] == selectedOption}
              onChange={(event) => setValue(event.target.value)}
            />
            {item[displayKey]}
          </label>
        ))}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}
