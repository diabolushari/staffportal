import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import StrongText from '@/typography/StrongText'
import AddButton from '../button/AddButton'
import EditButton from '../button/EditButton'

interface CardButton {
  title: string
  url: string
}

interface CustomCardProps {
  title?: string
  addButton?: CardButton
  editButton?: CardButton
  children?: ReactNode
  className?: string
  addButtonText?: string
  onAddClick?: () => void
  onEditClick?: () => void
  searchSlot?: ReactNode
}

export default function CustomCard({
  title,
  addButton,
  addButtonText,
  editButton,
  children,
  className = '',
  onAddClick,
  onEditClick,
  searchSlot,
}: CustomCardProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {(title || addButton || editButton) && (
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          {title && (
            <StrongText className='text-2xl font-semibold text-[#252c32]'>{title}</StrongText>
          )}

          <div className='flex cursor-pointer gap-2'>
            {(addButton || onAddClick) && (
              <AddButton
                buttonText={addButtonText ?? addButton?.title}
                link={addButton?.url}
                onClick={onAddClick}
              />
            )}

            {(editButton || onEditClick) && (
              <EditButton
                link={editButton?.url}
                onClick={onEditClick}
              />
            )}
          </div>
        </div>
      )}

      {searchSlot && (
        <div className='flex w-full items-center justify-center'>
          <div className='w-full max-w-sm'>{searchSlot}</div>
        </div>
      )}

      {children && <Card className='rounded-lg p-7'>{children}</Card>}
    </div>
  )
}
