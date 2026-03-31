import { Button } from '@/components/ui/button'
import { router } from '@inertiajs/react'
import { ArrowLeftIcon } from 'lucide-react'
import React from 'react'

interface Properties {
  link?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown
}

export default function BackButton({ onClick, link }: Properties) {
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
      size='icon'
      className='transition-transform hover:scale-105'
      onClick={handleClick}
      variant='destructive'
    >
      <ArrowLeftIcon className='h-6 w-6' />
    </Button>
  )
}
