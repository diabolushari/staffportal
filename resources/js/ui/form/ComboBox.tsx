import ErrorText from '@/typography/ErrorText'
import NormalText from '@/typography/NormalText'
import SubHeading from '@/typography/SubHeading'
import axios from 'axios'
import { XIcon } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useClick from '../../hooks/useClick'
import { handleHttpErrors } from '../alerts'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Properties<
  K extends keyof T,
  G extends keyof T,
  U extends number | string,
  V extends number | string | null,
  T extends Record<K, U> & Record<G, V>,
> {
  required?: boolean
  label?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  value: T | null
  setValue: (value: T | null) => unknown
  dataKey: G
  displayKey: K
  displayValue2?: K
  url: string
  linkText?: string
  redirectLink?: string
  placeholder?: string
  className?: string
}

const ComboBox = <
  K extends keyof T,
  G extends keyof T,
  U extends number | string,
  V extends number | string | null,
  T extends Record<K, U> & Record<G, V>,
>({
  label,
  required,
  value,
  error,
  setValue,
  dataKey,
  displayKey,
  displayValue2,
  disabled,
  url,
  linkText,
  redirectLink,
  placeholder,
  className,
}: Properties<K, G, U, V, T>) => {
  const [textFieldValue, setTextFieldValue] = useState<string>('')
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [list, setList] = useState<T[]>([])
  const listRef = useRef<HTMLDivElement | null>(null)
  const [clickTarget] = useClick()

  useEffect(() => {
    if (listRef.current?.contains(clickTarget) !== true) {
      setList([])
    }
  }, [clickTarget])

  const fetchData = useCallback(async () => {
    if (textFieldValue === '') {
      setList([])
      return
    }
    try {
      const res = await axios.get(`${url}${textFieldValue}`)
      setList(res.data)
      setHighlightedIndex(-1)
    } catch (error) {
      handleHttpErrors(error)
    }
  }, [textFieldValue, url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    setTextFieldValue('')
  }, [value])

  const handleSelection = (item: T | null) => {
    setValue(item)
    setList([])
    setHighlightedIndex(-1)
  }

  // navigate through list with arrow keys
  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedIndex((prev) => {
        if (prev + 1 >= list.length) {
          return -1
        }
        return prev + 1
      })
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((prev) => {
        if (prev - 1 < -1) {
          return list.length - 1
        }
        return prev - 1
      })
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (list.length > 0 && highlightedIndex >= 0 && highlightedIndex < list.length) {
        handleSelection(list[highlightedIndex])
      }
    }
  }

  return (
    <>
      {value != null && (
        <div className='flex flex-col gap-2'>
          <div className='small-1stop flex items-center justify-between bg-gray-100 px-3 py-2 text-sm text-gray-800'>
            <span>
              {label}
              <br />
              <b>{value[displayKey]}</b>
              {displayValue2 != null && (
                <>
                  <br />
                  <b>{value[displayValue2]}</b>
                </>
              )}
            </span>
            {!disabled && (
              <button
                className='cursor-pointer rounded-full p-1 hover:bg-gray-50'
                onClick={() => handleSelection(null)}
                type='button'
              >
                <XIcon />
              </button>
            )}
          </div>
          {error != null && <ErrorText>{error}</ErrorText>}
        </div>
      )}
      {value == null && (
        <div
          className='relative w-full'
          ref={listRef}
        >
          <div className='flex flex-col'>
            <div className='flex justify-between'>
              <label className='small-1stop mb-1 text-sm tracking-normal text-gray-800'>
                {required ? `${label} *` : label}
              </label>

              <a
                className={`link small-1stop flex flex-col justify-center text-xs ${linkText != null ? '' : 'hidden'}`}
                href={redirectLink ?? ''}
                target='_blank'
                rel='noreferrer'
              >
                {linkText}
              </a>
            </div>
            <Input
              type='text'
              value={textFieldValue}
              onKeyDown={handleKeydown}
              placeholder={placeholder}
              onChange={(event) => setTextFieldValue(event.target.value)}
              className={cn(
                'w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm font-normal text-black',
                'focus-visible:border-[#0078d4] focus-visible:ring-1 focus-visible:ring-[#0078d4] focus-visible:outline-none',
                'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-black disabled:opacity-100',
                'placeholder:text-gray-400',
                className
              )}
              disabled={disabled}
              readOnly={disabled}
            />
            {error && <ErrorText>{error}</ErrorText>}
          </div>
          <div className='absolute top-full z-10 max-h-60 w-full overflow-y-auto rounded-sm bg-white shadow-xl'>
            {list.length > 0 &&
              list.map((item, index) => (
                <div
                  key={`${item[dataKey]}-${index}`}
                  className={`flex cursor-pointer flex-col px-2 py-3 text-sm ${
                    highlightedIndex === index ? 'subheader-sm-1stop bg-gray-200' : ''
                  }`}
                  onClick={() => handleSelection(item)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <SubHeading>{item[displayKey]}</SubHeading>
                  {displayValue2 != null && (
                    <NormalText className='text-xs text-gray-500'>{item[displayValue2]}</NormalText>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  )
}

export default ComboBox
