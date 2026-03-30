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

interface MultiComboBoxProps<
  K extends keyof T,
  G extends keyof T,
  U extends number | string,
  V extends number | string | null,
  T extends Record<K, U> & Record<G, V>,
> {
  label?: string
  required?: boolean
  error?: string
  disabled?: boolean
  value: T[]
  setValue: (value: T[]) => void
  dataKey: G
  displayKey: K
  displayValue2?: K
  url: string
  placeholder?: string
  className?: string
}

const MultiSelectComboBox = <
  K extends keyof T,
  G extends keyof T,
  U extends number | string,
  V extends number | string | null,
  T extends Record<K, U> & Record<G, V>,
>({
  label,
  required,
  error,
  disabled,
  value,
  setValue,
  dataKey,
  displayKey,
  displayValue2,
  url,
  placeholder,
  className,
}: MultiComboBoxProps<K, G, U, V, T>) => {
  const [text, setText] = useState('')
  const [list, setList] = useState<T[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const listRef = useRef<HTMLDivElement | null>(null)
  const [clickTarget] = useClick()

  useEffect(() => {
    if (listRef.current?.contains(clickTarget) !== true) {
      setList([])
    }
  }, [clickTarget])

  const fetchData = useCallback(async () => {
    if (!text) {
      setList([])
      return
    }
    try {
      const res = await axios.get(`${url}${text}`)
      const filtered = res.data.filter(
        (item: T) => !value.some((v) => v[dataKey] === item[dataKey])
      )
      setList(filtered)
      setHighlightedIndex(-1)
    } catch (e) {
      handleHttpErrors(e)
    }
  }, [text, url, value, dataKey])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const addItem = (item: T) => {
    setValue([...value, item])
    setText('')
    setList([])
    setHighlightedIndex(-1)
  }

  const removeItem = (key: U) => {
    setValue(value.filter((v) => v[dataKey] !== key))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((i) => (i + 1 >= list.length ? 0 : i + 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((i) => (i - 1 < 0 ? list.length - 1 : i - 1))
    }
    if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault()
      addItem(list[highlightedIndex])
    }
  }

  return (
    <div className='space-y-1'>
      {label && <label className='text-sm text-gray-800'>{required ? `${label} *` : label}</label>}

      {/* Selected chips */}
      <div className='flex flex-wrap gap-2'>
        {value.map((item) => (
          <div
            key={item[dataKey]}
            className='flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-sm'
          >
            <span>
              {item[displayKey]}
              {displayValue2 && ` - ${item[displayValue2]}`}
            </span>
            {!disabled && (
              <button
                type='button'
                onClick={() => removeItem(item[dataKey])}
              >
                <XIcon className='h-3 w-3' />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        className='relative'
        ref={listRef}
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn('w-full border border-gray-200 text-sm', className)}
        />

        {/* Dropdown */}
        {list.length > 0 && (
          <div className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white shadow-md'>
            {list.map((item, index) => (
              <div
                key={item[dataKey]}
                className={cn(
                  'cursor-pointer px-3 py-2 text-sm',
                  highlightedIndex === index && 'bg-gray-200'
                )}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => addItem(item)}
              >
                <SubHeading>{item[displayKey]}</SubHeading>
                {displayValue2 && (
                  <NormalText className='text-xs text-gray-500'>{item[displayValue2]}</NormalText>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}

export default MultiSelectComboBox
