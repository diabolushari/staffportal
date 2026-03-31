import React from 'react'

interface Properties {
  svgStyle?: string
  svgSize?: string
}

export default function Spinner({ svgStyle = '', svgSize = 'w-8 h-8' }: Properties) {
  return (
    <span className={svgStyle}>
      <svg
        className={`highlight-spinner ${svgSize}`}
        viewBox='0 0 100 100'
      >
        <circle
          className='highlight-spinner-track'
          cx='50'
          cy='50'
          r='45'
        />
        <circle
          className='highlight-spinner-line'
          cx='50'
          cy='50'
          r='45'
        />
      </svg>
    </span>
  )
}
