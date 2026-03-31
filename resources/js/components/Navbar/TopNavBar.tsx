import { router, usePage } from '@inertiajs/react'
import { BellIcon, HelpCircle, Search as SearchIcon, SettingsIcon, UserIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CustomNavbar } from './CustomNavbar'
import { MobileNavSheet } from './MobileNavSheet'

interface Props {
  selectedTopNav?: string
}

export default function TopNavBar({ selectedTopNav }: Props) {
  const { props } = usePage()
  const user = props.auth?.user

  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <div className='grid h-16 w-full grid-cols-12 items-center border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-900'>
        {/* Logo – 2 columns */}
        <div className='col-span-2 flex items-center'>
          <img
            src='/kseb_logo.svg'
            alt='KSEB Logo'
            className='h-12 w-auto object-contain'
          />
        </div>

        {/* Desktop nav – 5 columns */}
        <div className='col-span-6 hidden h-full xl:flex'>
          <CustomNavbar selectedTopNav={selectedTopNav} />
        </div>

        {/* Right section – 5 columns */}
        <div className='col-span-4 flex h-full items-center justify-end gap-4 xl:col-span-3'>
          {/* Mobile menu */}
          <div className='xl:hidden'>
            <MobileNavSheet />
          </div>

          {/* Search */}
          <div className='relative hidden md:block'>
            <SearchIcon className='pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search'
              className='focus:border-kseb-primary focus:ring-kseb-primary/20 h-9 w-48 rounded-md border border-gray-300 bg-gray-50 pr-3 pl-8 text-sm outline-none focus:ring-2 dark:border-gray-600 dark:bg-gray-800'
            />
          </div>

          {/* Icons */}
          <button
            onClick={() => router.get(route('settings-page'))}
            className='cursor-pointer rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
          >
            <SettingsIcon className='h-5 w-5' />
          </button>

          <button className='rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'>
            <BellIcon className='h-5 w-5' />
          </button>

          <button className='rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'>
            <HelpCircle className='h-5 w-5' />
          </button>

          {/* User dropdown */}
          <div
            ref={menuRef}
            className='relative'
          >
            <button
              onClick={() => setOpen(!open)}
              className='cursor-pointer rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            >
              <UserIcon className='h-5 w-5' />
            </button>

            {open && (
              <div className='absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900'>
                <div className='px-4 py-3 text-sm'>
                  <span className='text-xs text-gray-500'>Logged in as</span>
                  <div className='font-medium uppercase'>{user?.name}</div>
                </div>

                <div className='border-t border-gray-200 dark:border-gray-700' />

                <button
                  onClick={() => router.post(route('logout'))}
                  className='flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='icon icon-tabler icon-tabler-logout pr-2'
                    width={20}
                    height={20}
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path
                      stroke='none'
                      d='M0 0h24v24H0z'
                    />
                    <path d='M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2' />
                    <path d='M7 12h14l-3 -3m0 6l3 -3' />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='bg-kseb-line h-px w-full' />
    </>
  )
}
