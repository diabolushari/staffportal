import React, { ReactNode } from 'react'
import { cn } from '@/utils'

interface Props extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode
}

const Card = React.forwardRef<HTMLDivElement, Props>(
  ({ className = '', children, ...props }: Props, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-full rounded-sm bg-white shadow-sm', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

export default Card
