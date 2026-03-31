import StrongText from '@/typography/StrongText'
import { PencilIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { router } from '@inertiajs/react'
import EditButton from '../button/EditButton'

export default function ShowPageCard({
  title,
  children,
  className = '',
  editUrl,
}: {
  title: string
  children: ReactNode
  className?: string
  editUrl?: string
}) {
  return (
    <Card className='rounded-lg p-7'>
      <div className='mb-6 flex items-center justify-between'>
        <StrongText className='text-base font-semibold text-[#252c32]'>
          Basic Information
        </StrongText>
        {editUrl && <EditButton onClick={() => router.visit(editUrl)} />}
      </div>
      <hr className='mb-6 border-[#e5e9eb]' />
      {children}
    </Card>
  )
}
