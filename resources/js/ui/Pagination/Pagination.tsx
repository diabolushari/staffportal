import { Link } from '@inertiajs/react'
import React from 'react'
import { Paginator } from '../ui_interfaces'

interface PaginationProps {
  pagination: Paginator<{}>
  filters?: Record<string, string>
}

const appendFiltersToUrl = (url: string | null, filters?: Record<string, string>) => {
  if (!url) return ''
  if (!filters) return url

  const urlObj = new URL(url, window.location.origin)
  Object.entries(filters).forEach(([key, value]) => {
    if (value) urlObj.searchParams.set(key, value)
  })

  return urlObj.toString().replace(window.location.origin, '')
}

const Pagination = ({ pagination, filters }: PaginationProps) => {
  const links = pagination?.links || []

  let index = 0
  const listLength = links.length

  return (
    <div className='flex w-full flex-wrap items-center justify-between gap-y-4 py-2'>
      <p className='mt-auto self-center text-sm text-gray-700'>
        Showing <span className='font-semibold'>{pagination.from}</span> to{' '}
        <span className='font-semibold'>{pagination.to}</span> of {pagination.total}
      </p>

      <div className='border-t border-gray-200'>
        <nav
          className='relative flex flex-wrap rounded-md shadow-xs'
          aria-label='Pagination'
        >
          {links.map((link) => {
            index++
            const href = appendFiltersToUrl(link.url, filters)

            if (index === 1) {
              return (
                <Link
                  as='div'
                  href={href}
                  key={index.toString() + link.label}
                  className={`flex cursor-pointer items-center pt-3 text-gray-600 hover:text-indigo-700 ${
                    !link.url ? 'cursor-not-allowed opacity-50' : ''
                  }`}
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
                  <p className='mr-4 ml-2 leading-none'>Previous</p>
                </Link>
              )
            }

            if (index !== 1 && index !== listLength) {
              return (
                <Link
                  as='a'
                  key={index.toString() + link.label}
                  href={href}
                  className={`mr-4 hidden cursor-pointer border-t border-transparent px-2 pt-3 leading-none hover:border-indigo-400 hover:text-indigo-700 md:flex ${
                    link.active ? 'text-kseb-primary border-indigo-400' : 'text-gray-600'
                  } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              )
            }

            if (index === listLength) {
              return (
                <Link
                  as='div'
                  href={href}
                  key={index.toString() + link.label}
                  className={`flex cursor-pointer items-center pt-3 text-gray-600 hover:text-indigo-700 ${
                    !link.url ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  <p className='mr-3 leading-none'>Next</p>
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
                </Link>
              )
            }

            return null
          })}
        </nav>
      </div>
    </div>
  )
}

export default Pagination
