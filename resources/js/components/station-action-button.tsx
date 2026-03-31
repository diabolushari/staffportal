import { ArrowUpDown, Ban, MoreVertical, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface Props {
  onReprioritize?: () => void
  onInactive?: () => void
  onDeleteStation?: () => void
}

const StationActionButton = ({ onReprioritize, onInactive, onDeleteStation }: Props) => {
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
        <div className='border-kseb-line bg-kseb-bg-blue absolute right-0 z-20 mt-2 w-44 rounded-md border shadow-lg'>
          {onReprioritize && (
            <button
              onClick={() => {
                setOpen(false)
                onReprioritize()
              }}
              className='context-menu-item hover:bg-kseb-primary hover:border-kseb-line flex w-full items-center gap-2 px-4 py-2'
            >
              <ArrowUpDown className='h-4 w-4' />
              Re-prioritize
            </button>
          )}

          {onInactive && (
            <button
              onClick={() => {
                setOpen(false)
                onInactive()
              }}
              className='context-menu-item hover:bg-kseb-primary hover:border-kseb-line flex w-full items-center gap-2 px-4 py-2'
            >
              <Ban className='h-4 w-4' />
              Inactivate
            </button>
          )}

          {/* {onDeleteStation && (
            <button
              onClick={() => {
                setOpen(false)
                onDeleteStation()
              }}
              className='context-menu-item hover:bg-kseb-primary hover:border-kseb-line flex w-full items-center gap-2 px-4 py-2 text-red-600'
            >
              <Trash2 className='h-4 w-4' />
              Delete Station
            </button>
          )} */}
        </div>
      )}
    </div>
  )
}

export default StationActionButton
