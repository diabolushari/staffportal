import { cn } from '@/utils'
import React from 'react'

interface Props extends React.HTMLProps<HTMLElement> {
  children: React.ReactNode
}

const StrongText = React.forwardRef<HTMLElement, Props>(
  ({ className = '', children, ...props }: Props, ref) => {
    return (
      <strong
        ref={ref}
        className={cn('break-all', className)}
        {...props}
      >
        {children}
      </strong>
    )
  }
)

export default StrongText
