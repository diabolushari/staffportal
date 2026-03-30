import React, { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'

interface Properties {
  children: React.ReactNode
  title: string
  changeState: boolean
  setChangeState: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

const AccordionItem = ({ title, children, changeState, setChangeState, className }: Properties) => {
  // const [open, setOpen] = useState(changeState ?? false)

  return (
    <div className={className}>
      <div className='shadow-2xl transition duration-200 ease-in-out'>
        <div
          className={`${
            changeState ? 'border-b-2' : ''
          } body-1stop text-s flex w-full justify-between border-b px-4 py-3`}
          onClick={() => setChangeState(!changeState)}
        >
          <div className='flex flex-col gap-2 md:flex-row md:gap-10'>
            <span className='text-sm font-medium'>{title}</span>
          </div>
          <ChevronDownIcon
            className={`${
              changeState
                ? 'rotate-180 transition-transform duration-200 ease-linear'
                : 'transition-transform duration-200 ease-linear'
            } ml-auto h-5 w-5 self-center rounded-lg`}
          />
        </div>
        {changeState && (
          <div className='flex flex-col gap-3 px-4 pt-4 pb-4 text-sm'>{children}</div>
        )}
      </div>
    </div>
  )
}

export default AccordionItem
