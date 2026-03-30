import { cn } from '@/utils'
import React from 'react'

interface Props {
  className?: string
  children: React.ReactNode
}

export default function Paragraph({ className = '', children }: Props) {
  return <p className={cn('break-all', className)}>{children}</p>
}
