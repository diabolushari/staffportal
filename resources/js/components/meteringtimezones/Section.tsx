import { ReactNode } from 'react'

interface SectionProps {
  title: string
  children: ReactNode
}

export const Section = ({ title, children }: SectionProps) => (
  <div className='py-6'>
    <h3 className='mb-6 text-lg font-semibold text-gray-700'>{title}</h3>
    <div className='grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3'>{children}</div>
  </div>
)
