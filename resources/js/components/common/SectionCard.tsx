import React from 'react'
import { Card } from '@/components/ui/card'
import StrongText from '@/typography/StrongText'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { router } from '@inertiajs/react'

interface SectionCardProps {
  title: string
  children: React.ReactNode
  editUrl?: string
  onEdit?: () => void
  deleteUrl?: string
  onDelete?: () => void
  deleteConfirmMessage?: string
  className?: string
}

export default function SectionCard({
  title,
  children,
  editUrl,
  onEdit,
  deleteUrl,
  onDelete,
  deleteConfirmMessage = 'Are you sure you want to delete this item?',
  className = '',
}: Readonly<SectionCardProps>) {
  const handleEdit = () => {
    if (onEdit != null) {
      onEdit()
    } else if (editUrl != null) {
      router.visit(editUrl)
    }
  }

  const handleDelete = () => {
    if (confirm(deleteConfirmMessage)) {
      if (onDelete != null) {
        onDelete()
      } else if (deleteUrl != null) {
        router.delete(deleteUrl)
      }
    }
  }

  const hasActions = editUrl != null || onEdit != null || deleteUrl != null || onDelete != null

  return (
    <Card className={`rounded-lg p-7 ${className}`}>
      <div className='mb-6 flex items-center justify-between'>
        <StrongText className='text-base font-semibold text-[#252c32]'>{title}</StrongText>
        {hasActions && (
          <div className='flex items-center gap-2'>
            {(editUrl || onEdit) && (
              <button
                onClick={handleEdit}
                className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0078d4] hover:bg-gray-50'
              >
                <PencilIcon className='h-4 w-4' />
                Edit
              </button>
            )}
            {(deleteUrl || onDelete) && (
              <button
                onClick={handleDelete}
                className='flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3.5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50'
              >
                <Trash2Icon className='h-4 w-4' />
                Delete
              </button>
            )}
          </div>
        )}
      </div>
      <hr className='mb-6 border-[#e5e9eb]' />
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>{children}</div>
    </Card>
  )
}
