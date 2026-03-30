import { Button } from '@/components/ui/button'
import { router } from '@inertiajs/react'
import { Trash } from 'lucide-react'
import React from 'react'

interface Props {
  link?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown
}

export default function DeleteButton({ link, onClick }: Props) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (link != null) {
      router.get(link)
      return
    }
    if (onClick != null) {
      onClick(event)
    }
  }

  return (
    <Button
      variant='outline'
      size='icon'
      className='cursor-pointer border-red-500 transition-transform hover:scale-105'
      onClick={handleClick}
    >
      <Trash className='h-6 w-6 text-red-500' />
    </Button>
  )
}
