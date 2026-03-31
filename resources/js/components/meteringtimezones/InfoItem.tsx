import { Label } from '@/components/ui/label'
import { ReactNode } from 'react'

interface InfoItemProps {
  label: string
  value: string | number | undefined
  icon?: ReactNode
}

export const InfoItem = ({ label, value, icon }: InfoItemProps) => (
  <div className='flex flex-col gap-1'>
    <div className='flex items-center gap-1'>
      {icon && <span className='text-slate-500'>{icon}</span>}
      <Label className='text-sm font-medium text-gray-500'>{label}</Label>
    </div>
    <p className='text-base text-gray-800'>{value ?? '-'}</p>
  </div>
)
