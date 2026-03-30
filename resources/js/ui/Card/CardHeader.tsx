import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Heading from '@/typography/Heading'
import BackButton from '@/ui/button/BackButton'
import DeleteButton from '@/ui/button/DeleteButton'
import EditButton from '@/ui/button/EditButton'
import { router } from '@inertiajs/react'
import { PlusIcon } from 'lucide-react'
import React from 'react'
import AddExistingUser from '../button/AddExistingUser'

interface Props {
  title: string
  backUrl?: string
  addUrl?: string
  editUrl?: string
  deleteUrl?: string | null
  existingUserUrl?: string
  onFolderIconClick?: () => unknown
  onAddClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown
  onBackClick?: () => unknown
  onEditClick?: () => unknown
  onDeleteClick?: () => unknown
  subheading?: string
  breadCrumb?: any
  titleClassName?: string
  isDualHeading?: string
  showAddButton?: boolean
}

export default function CardHeader({
  title,
  backUrl,
  addUrl,
  onAddClick,
  onBackClick,
  editUrl,
  onEditClick,
  deleteUrl,
  onDeleteClick,
  subheading,
  breadCrumb,
  titleClassName,
  onFolderIconClick,
  existingUserUrl,
  isDualHeading,
  showAddButton = true,
}: Props) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (addUrl != null) {
      router.get(addUrl)
      return
    }
    if (onAddClick != null) {
      onAddClick(event)
    }
  }

  return (
    <div className=''>
      <div className='flex flex-wrap items-center justify-between gap-5 py-4'>
        <Heading className={`subheader-1stop uppercase ${titleClassName}`}>{title}</Heading>
        <div className='flex items-center gap-5'>
          <TooltipProvider>
            {(backUrl != null || onBackClick != null) && (
              <Tooltip>
                <TooltipTrigger className='p-2'>
                  <BackButton
                    link={backUrl}
                    onClick={onBackClick}
                  />
                </TooltipTrigger>
                <TooltipContent>Go Back</TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
        <TooltipProvider>
          <div className='flex flex-wrap gap-2'>
            {(editUrl != null || onEditClick != null) && (
              <Tooltip>
                <TooltipTrigger className='p-2'>
                  <EditButton
                    link={editUrl}
                    onClick={onEditClick}
                  />
                </TooltipTrigger>
                <TooltipContent>Edit Data</TooltipContent>
              </Tooltip>
            )}
            {(deleteUrl != null || onDeleteClick != null) && (
              <Tooltip>
                <TooltipTrigger className='pr-2'>
                  <DeleteButton
                    link={deleteUrl || undefined}
                    onClick={onDeleteClick}
                  />
                </TooltipTrigger>
                <TooltipContent>Delete Data</TooltipContent>
              </Tooltip>
            )}
            {(addUrl != null || onAddClick != null) && showAddButton && (
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant='default'
                    size='icon'
                    className='transition-transform hover:scale-105'
                    onClick={handleClick}
                  >
                    <PlusIcon className='h-6 w-6' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Item</TooltipContent>
              </Tooltip>
            )}
            {(existingUserUrl != null || onFolderIconClick != null) && (
              <AddExistingUser
                link={existingUserUrl}
                onClick={onFolderIconClick}
              />
            )}
          </div>
        </TooltipProvider>
      </div>
      <div className='small-1stop text-1stop-highlight p-4'>{subheading ?? ''}</div>
    </div>
  )
}
