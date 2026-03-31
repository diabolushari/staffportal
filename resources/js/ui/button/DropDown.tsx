import React, { useEffect, useRef, useState } from 'react'

import { FormFieldProp } from '../ui_interfaces'
import useClick from '../../hooks/useClick'
import { ChevronsUpDownIcon } from 'lucide-react'

export interface Props<K extends keyof T, U extends number | string, T extends Record<K, U>>
  extends FormFieldProp {
  list: T[]
  dataKey: K
  displayKey: K
  showAllOption?: boolean
  allOptionText?: string
}

export default function Dropdown<
  K extends keyof T,
  U extends number | string,
  T extends Record<K, U>,
>({
  value,
  label,
  error,
  setValue,
  list,
  dataKey,
  displayKey,
  showAllOption = false,
  allOptionText = 'All',
}: Props<K, U, T>) {
  const [showList, setShowList] = useState(false)
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const [clickTarget] = useClick()

  useEffect(() => {
    if (listRef.current?.contains(clickTarget) !== true) {
      setShowList(false)
    }
  }, [clickTarget])

  useEffect(() => {
    if (value !== '') {
      const item = list.find((item) => `${item[dataKey]}` === value)
      setSelectedItem(item != null ? item : null)
      return
    }
    setSelectedItem(null)
  }, [list, value, dataKey])

  const toggleList = () => {
    setShowList((oldValue) => !oldValue)
  }

  const handleChange = (value: string | number) => {
    setValue(`${value}`)
    setShowList(false)
  }

  return (
    <>
      <label className='mb-1 bg-gray-200 text-sm tracking-normal text-gray-800'>{label}</label>
      <div
        className='relative w-full'
        ref={listRef}
      >
        <button
          onClick={toggleList}
          className='flex w-full items-center justify-between rounded-lg border border-gray-300 px-3 py-3 text-sm text-gray-800 shadow-xs focus:border-indigo-700 focus:outline-hidden disabled:bg-gray-100'
        >
          <span>
            {value === '' && showAllOption
              ? allOptionText
              : selectedItem != null
                ? selectedItem[displayKey]
                : `Select ${label ?? ''}`}
          </span>
          <ChevronsUpDownIcon className='h-6 w-6' />
        </button>
        {showList && (
          <div className='absolute top-full z-10 w-full rounded-b bg-white shadow-sm'>
            {showAllOption && (
              <div
                className='flex cursor-pointer flex-wrap p-2 text-sm hover:bg-gray-200 hover:font-semibold'
                onClick={() => handleChange('')}
              >
                {allOptionText}
              </div>
            )}
            {list.map((item: T) => {
              return (
                <div
                  key={item[dataKey]}
                  className='flex cursor-pointer flex-wrap p-2 text-sm transition duration-300 ease-in hover:bg-gray-300'
                  onClick={() => handleChange(item[dataKey])}
                >
                  {item[displayKey]}
                </div>
              )
            })}
          </div>
        )}
      </div>
      {error && <div className='error-text'>{error}</div>}
    </>
  )
}
