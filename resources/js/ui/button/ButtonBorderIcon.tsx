import { Button } from '@/Components/ui/button'
import React, { useMemo } from 'react'

export const chooseBorderButtonColor = (type: string): [string, string] => {
  switch (type) {
    case 'success': {
      return [
        `text-success-500 bg-transparent border-success-500 focus:ring-success-500 focus:ring-offset-1 hover:bg-success-500
          hover:text-white transition duration-150 ease-in-out`,
        'text-success-500',
      ]
    }
    case 'accent': {
      return [
        'bg-transparent border-accent-dark text-accent-dark focus:ring-accent-dark hover:bg-accent-hover hover:text-white',
        'text-accent-dark',
      ]
    }
    case 'secondary': {
      return ['bg-gray-100 hover:bg-gray-200 focus:ring-gray-200 text-gray-700', 'text-gray-500']
    }
    case 'info': {
      return [
        `text-blue-600 bg-transparent border-blue-600 focus:ring-blue-600 focus:ring-offset-1 hover:bg-blue-600
          hover:text-white transition duration-150 ease-in-out`,
        'text-blue-600',
      ]
    }
    case 'danger': {
      return [
        'bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
        'text-red-500',
      ]
    }
    case 'highlight': {
      return [
        `text-primary-700 bg-transparent border-primary-700 focus:ring-primary-700 focus:ring-offset-1 
         hover:bg-1stop-highlight hover:text-white transition duration-150 ease-in-out`,
        'text-primary-700',
      ]
    }

    default: {
      return [
        `text-primary-700 bg-transparent border-primary-700 focus:ring-primary-700 focus:ring-offset-1 hover:bg-primary
          hover:text-white transition duration-150 ease-in-out`,
        'text-primary-700',
      ]
    }
  }
}

interface Properties {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  type?: string
  processing?: boolean
  disabled?: boolean
  children: React.ReactNode
}

const ButtonBorderIcon = ({
  onClick,
  type = 'primary',
  processing = false,
  disabled = false,
  children,
}: Properties) => {
  const [buttonStyle, svgStyle] = useMemo(() => chooseBorderButtonColor(type), [type])

  return (
    <>
      {!processing && (
        <button
          type='button'
          onClick={onClick}
          disabled={disabled}
          className={`flex items-center justify-center rounded-lg border px-2 py-2 text-left text-sm tracking-wider ring-offset-2 transition duration-150 ease-in-out focus:ring-1 focus:outline-hidden ${buttonStyle}`}
        >
          {children}
        </button>
      )}
      {processing && (
        <span className={svgStyle}>
          <svg
            className='spinner_svg h-8 w-8'
            viewBox='0 0 100 100'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle
              className='spinner_circle'
              stroke='currentColor'
              cx='50'
              cy='50'
              r='45'
            />
          </svg>
        </span>
      )}
    </>
  )
}

export default ButtonBorderIcon
