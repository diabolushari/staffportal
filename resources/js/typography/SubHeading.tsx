import { cn } from '@/utils'
import React from 'react'

interface Props extends React.HTMLProps<HTMLHeadingElement> {
  children: React.ReactNode
}

const SubHeading = React.forwardRef<HTMLHeadingElement, Props>(
  ({ className = '', children, ...props }: Props, ref) => {
    return (
      <h2
        ref={ref}
        className={cn('body-1stop break-all', className)}
        {...props}
      >
        {children}
      </h2>
    )
  }
)

export default SubHeading
