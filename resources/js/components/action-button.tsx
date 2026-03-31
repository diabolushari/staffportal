import { Edit, Download, MoreVertical, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface Props {
  onEdit?: () => void
  onDownload?: () => void
  onDelete?: () => void
}

const ActionButton = ({ onEdit, onDownload, onDelete }: Props) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div
      ref={ref}
      className='relative'
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className='hover:border-kseb-primary hover:bg-kseb-bg-blue cursor-pointer rounded-md border border-transparent p-2 text-gray-600'
      >
        <MoreVertical className='h-5 w-5' />
      </button>

      {open && (
        <div className='border-kseb-line bg-kseb-bg-blue absolute right-0 z-20 mt-2 w-40 rounded-md border shadow-lg'>
          {onEdit && (
            <button
              onClick={() => {
                setOpen(false)
                onEdit()
              }}
              className='context-menu-item hover:bg-kseb-primary hover:border-kseb-line flex w-full items-center gap-2 px-4 py-2'
            >
              <Edit className='h-4 w-4' />
              Edit
            </button>
          )}

          {onDownload && (
            <button
              onClick={() => {
                setOpen(false)
                onDownload()
              }}
              className='context-menu-item hover:bg-kseb-primary hover:border-kseb-line flex w-full items-center gap-2 px-4 py-2'
            >
              <Download className='h-4 w-4' />
              Download
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => {
                setOpen(false)
                onDelete()
              }}
              className='context-menu-item hover:bg-kseb-primary hover:border-kseb-line flex w-full items-center gap-2 px-4 py-2 text-red-600'
            >
              <Trash2 className='h-4 w-4' />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ActionButton
