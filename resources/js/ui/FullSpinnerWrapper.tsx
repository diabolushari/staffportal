import React from 'react'
import FullSpinner from './FullSpinner'

interface Props {
  processing?: boolean
  children: React.ReactNode
}

const FullSpinnerWrapper = ({ children, processing = false }: Props) => {
  return (
    <>
      {processing && <FullSpinner />}
      {!processing && <>{children}</>}
    </>
  )
}

export default FullSpinnerWrapper
