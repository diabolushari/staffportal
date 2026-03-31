import React, { useCallback } from 'react'
import { Paginator } from '../ui_interfaces'

interface PaginationProps<T> {
  pagination: Paginator<T>
  onNewPage: (page: number) => void
}

export default function RestPagination<T>({ pagination, onNewPage }: PaginationProps<T>) {
  const onPagePrev = useCallback(() => {
    if (pagination.current_page > 1) {
      onNewPage(pagination.current_page - 1)
    }
  }, [pagination, onNewPage])

  const onPageNext = useCallback(() => {
    if (pagination.current_page < pagination.last_page) {
      onNewPage(pagination.current_page + 1)
    }
  }, [pagination, onNewPage])

  const selectPage = useCallback(
    (index: number) => {
      const pageValue = Number(pagination.links[index].label)
      if (!isNaN(pageValue)) {
        onNewPage(pageValue)
      }
    },
    [onNewPage, pagination]
  )

  return (
    <div className='my-2 flex w-full flex-wrap items-center justify-between gap-y-4 py-2'>
      <p className='small-1stop mt-auto self-center text-gray-700'>
        Showing <span className='small-1stop'>{pagination.from}</span> to{' '}
        <span className='small-1stop'>{pagination.to}</span> of {pagination.total}
      </p>

      <div className='border-t border-gray-200 print:hidden'>
        <nav
          className='relative flex flex-wrap rounded-md shadow-sm'
          aria-label='Pagination'
        >
          {pagination.links.map((link, index) => {
            return (
              <React.Fragment key={index.toString() + '_' + link.label}>
                {index === 0 && (
                  <div
                    onClick={onPagePrev}
                    className='flex cursor-pointer items-center pt-3 text-gray-600 hover:text-indigo-700'
                  >
                    <svg
                      width={14}
                      height={8}
                      viewBox='0 0 14 8'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M1.1665 4H12.8332'
                        stroke='currentColor'
                        strokeWidth='1.25'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M1.1665 4L4.49984 7.33333'
                        stroke='currentColor'
                        strokeWidth='1.25'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M1.1665 4.00002L4.49984 0.666687'
                        stroke='currentColor'
                        strokeWidth='1.25'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <p className='small-1stop mr-4 ml-2'>Previous</p>
                  </div>
                )}
                {index !== 0 && index !== pagination.links.length - 1 && (
                  <div
                    onClick={() => selectPage(index)}
                    className={`small-1stop mr-4 hidden border-t px-2 pt-3 md:flex ${
                      link.label === '...'
                        ? 'border-transparent'
                        : 'cursor-pointer hover:border-indigo-400 hover:text-indigo-700'
                    } ${
                      link.active
                        ? 'border-blue-500 text-blue-500'
                        : 'border-transparent text-gray-600'
                    } `}
                  >
                    {link.label}
                  </div>
                )}
                {index === pagination.links.length - 1 && (
                  <div
                    onClick={onPageNext}
                    className='flex cursor-pointer items-center pt-3 text-gray-600 hover:text-indigo-700'
                  >
                    <p className='small-1stop mr-3'>Next</p>
                    <svg
                      width={14}
                      height={8}
                      viewBox='0 0 14 8'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M1.1665 4H12.8332'
                        stroke='currentColor'
                        strokeWidth='1.25'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M9.5 7.33333L12.8333 4'
                        stroke='currentColor'
                        strokeWidth='1.25'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M9.5 0.666687L12.8333 4.00002'
                        stroke='currentColor'
                        strokeWidth='1.25'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
