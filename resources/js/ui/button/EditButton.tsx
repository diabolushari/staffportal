import { Button } from '@/components/ui/button'
import { router } from '@inertiajs/react'
import { EditIcon } from 'lucide-react'
import React from 'react'

interface Props {
  link?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown
}

export default function EditButton({ link, onClick }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (link != null) {
      router.get(link)
      return
    }
    if (onClick != null) {
      onClick(e)
    }
  }

  return (
    <Button
      className='border-kseb-primary flex cursor-pointer items-center gap-2 border-b-2 transition-transform hover:border-blue-500'
      onClick={handleClick}
      variant='outline'
    >
      <EditIcon className='h-6 w-6' />
    </Button>
  )
}
