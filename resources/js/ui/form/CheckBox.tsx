import { CheckboxProp } from '../ui_interfaces'
import ErrorText from '@/typography/ErrorText'

export default function CheckBox({
  required = false,
  label,
  value,
  toggleValue,
  disabled = false,
  error,
}: CheckboxProp) {
  return (
    <>
      <div className='flex items-center text-sm'>
        <div className='relative flex h-5 w-5 shrink-0 items-center justify-center rounded-xs border border-gray-400 bg-white'>
          <input
            type='checkbox'
            checked={value}
            onChange={() => toggleValue()}
            disabled={disabled}
            className='checkbox absolute h-full w-full cursor-pointer'
          />
          <div className='check-icon bg-primary-500 hidden rounded-xs text-white'>
            <svg
              className='icon icon-tabler icon-tabler-check'
              xmlns='http://www.w3.org/2000/svg'
              width={20}
              height={20}
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path
                stroke='none'
                d='M0 0h24v24H0z'
              />
              <path d='M5 12l5 5l10 -10' />
            </svg>
          </div>
        </div>
        <p className='small-1stop ml-1 leading-4'>{required ? `${label} *` : label}</p>
        {/* Code block ends */}
        <style>
          {`.checkbox:checked + .check-icon {
                            display: flex;
            }`}
        </style>
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </>
  )
}
