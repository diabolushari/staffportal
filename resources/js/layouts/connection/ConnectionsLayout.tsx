import { BreadcrumbItem, PageProps } from '@/types'
import { MainNav } from '@/components/Navbar/navitems'
import { Connection } from '@/interfaces/data_interfaces'
import React, { useEffect } from 'react'
import { NestedTabGroup } from '@/components/ui/nestedTab'
import CustomBreadcrumb from '@/ui/BreadCrumb'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ToastContainer } from 'react-toastify'
import TopNavBar from '@/components/Navbar/TopNavBar'
import LeftNavBar from '@/components/Navbar/LeftNavBar'
import { usePage } from '@inertiajs/react'
import { showError, showInfo, showSuccess } from '@/ui/alerts'

interface ConnectionsLayoutProps {
  children: React.ReactNode
  breadcrumbs: BreadcrumbItem[]
  connectionsNavItems: MainNav
  connection?: Connection | null
  connectionId: number
  value: string
  subTabValue?: string
  heading: string
  description: React.ReactNode
  onEdit?: () => void
  consumerExist?: boolean
  meterExist?: boolean
  sheetTitle?: string
  sheetAction?: (open: boolean) => void
  sheetOpen?: boolean
  sheetContent?: React.ReactNode
}

const connectionTabs = (connection?: Connection | null) => [
  {
    value: 'connection',
    label: 'Connection Details',
    icon: (
      <svg
        width='18'
        height='18'
        viewBox='0 0 18 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M9 16.5C11.071 16.5 12.9461 15.6605 14.3033 14.3033C15.6605 12.9461 16.5 11.071 16.5 9C16.5 6.92895 15.6605 5.05395 14.3033 3.6967C12.9461 2.33947 11.071 1.5 9 1.5C6.92895 1.5 5.05395 2.33947 3.6967 3.6967C2.33947 5.05395 1.5 6.92895 1.5 9C1.5 11.071 2.33947 12.9461 3.6967 14.3033C5.05395 15.6605 6.92895 16.5 9 16.5Z'
          stroke='#333333'
          stroke-width='1.125'
          stroke-linejoin='round'
        />
        <path
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M9 4.125C9.51776 4.125 9.9375 4.54474 9.9375 5.0625C9.9375 5.58026 9.51776 6 9 6C8.48224 6 8.0625 5.58026 8.0625 5.0625C8.0625 4.54474 8.48224 4.125 9 4.125Z'
          fill='#333333'
        />
        <path
          d='M9.1875 12.75V7.5H8.8125H8.4375'
          stroke='#333333'
          stroke-width='1.125'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M7.875 12.75H10.5'
          stroke='#333333'
          stroke-width='1.125'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </svg>
    ),
    activeIcon: (
      <svg
        width='18'
        height='18'
        viewBox='0 0 18 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M9 16.5C11.071 16.5 12.9461 15.6605 14.3033 14.3033C15.6605 12.9461 16.5 11.071 16.5 9C16.5 6.92895 15.6605 5.05395 14.3033 3.6967C12.9461 2.33947 11.071 1.5 9 1.5C6.92895 1.5 5.05395 2.33947 3.6967 3.6967C2.33947 5.05395 1.5 6.92895 1.5 9C1.5 11.071 2.33947 12.9461 3.6967 14.3033C5.05395 15.6605 6.92895 16.5 9 16.5Z'
          stroke='#F3F8FE'
          stroke-width='1.125'
          stroke-linejoin='round'
        />
        <path
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M9 4.125C9.51776 4.125 9.9375 4.54474 9.9375 5.0625C9.9375 5.58026 9.51776 6 9 6C8.48224 6 8.0625 5.58026 8.0625 5.0625C8.0625 4.54474 8.48224 4.125 9 4.125Z'
          fill='#F3F8FE'
        />
        <path
          d='M9.1875 12.75V7.5H8.8125H8.4375'
          stroke='#F3F8FE'
          stroke-width='1.125'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M7.875 12.75H10.5'
          stroke='#F3F8FE'
          stroke-width='1.125'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </svg>
    ),
    href: connection?.connection_id ? route('connections.show', connection?.connection_id) : '#',
    item: [
      {
        subValue: 'connection',
        subLabel: 'Connection',
        subLink: connection?.connection_id
          ? route('connections.show', connection?.connection_id)
          : '#',
      },
      {
        subValue: 'consumer',
        subLabel: 'Consumer',
        subLink: connection?.connection_id
          ? route('connection.consumer', connection?.connection_id)
          : '#',
      },
      {
        subValue: 'parties',
        subLabel: 'Parties',
        subLink: connection?.connection_id
          ? route('connection.parties', connection?.connection_id)
          : '#',
      },
      {
        subValue: 'sd-demands',
        subLabel: 'Security Deposits',
        subLink: connection?.connection_id
          ? route('connection.sd-demands', connection?.connection_id)
          : '#',
      },
      {
        subValue: 'stations',
        subLabel: 'Stations',
        subLink: connection?.connection_id
          ? route('connection.station-consumer-rels', connection?.connection_id)
          : '#',
      },
    ],
  },
  {
    value: 'meter-reading',
    label: 'Meter Readings',
    icon: (
      <svg
        width='18'
        height='18'
        viewBox='0 0 18 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M12.7588 2.50845C11.6536 1.86717 10.3697 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 7.63976 16.1379 6.36409 15.5048 5.26414'
          stroke='#333333'
          stroke-width='1.125'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M11.9813 6.01892C11.9813 6.01892 10.7109 9.41061 10.1251 9.9964C9.53934 10.5822 8.58958 10.5822 8.00379 9.9964C7.41801 9.41061 7.41801 8.46085 8.00379 7.87506C8.58958 7.28927 11.9813 6.01892 11.9813 6.01892Z'
          stroke='#333333'
          stroke-width='1.125'
          stroke-linejoin='round'
        />
      </svg>
    ),
    activeIcon: (
      <svg
        width='18'
        height='18'
        viewBox='0 0 18 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M12.7588 2.50845C11.6536 1.86717 10.3697 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 7.63976 16.1379 6.36409 15.5048 5.26414'
          stroke='#F3F8FE'
          stroke-width='1.125'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M11.9813 6.01892C11.9813 6.01892 10.7109 9.41061 10.1251 9.9964C9.53934 10.5822 8.58958 10.5822 8.00379 9.9964C7.41801 9.41061 7.41801 8.46085 8.00379 7.87506C8.58958 7.28927 11.9813 6.01892 11.9813 6.01892Z'
          stroke='#F3F8FE'
          stroke-width='1.125'
          stroke-linejoin='round'
        />
      </svg>
    ),
    href: connection?.connection_id
      ? route('connection.meter-reading', connection.connection_id)
      : '#',
    item: [
      {
        subValue: 'reading',
        subLabel: 'Readings',
        subLink: connection?.connection_id
          ? route('connection.meter-reading', connection?.connection_id)
          : '#',
      },
    ],
  },
  {
    value: 'configuration',
    label: 'Configuration',
    icon: (
      <svg
        width='18'
        height='18'
        viewBox='0 0 18 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M13.7573 5.68912C14.2262 6.36161 14.5561 7.1382 14.7055 7.97726H16.5V10.0227H14.7055C14.5561 10.8618 14.2262 11.6384 13.7573 12.3109L15.0265 13.5801L13.5801 15.0265L12.3109 13.7573C11.6384 14.2262 10.8618 14.5561 10.0227 14.7055V16.5H7.97726V14.7055C7.1382 14.5561 6.36161 14.2262 5.68912 13.7573L4.41986 15.0265L2.97352 13.5801L4.24275 12.3109C3.77385 11.6384 3.44389 10.8618 3.2945 10.0227H1.5V7.97726H3.2945C3.44389 7.1382 3.77385 6.36161 4.24275 5.68912L2.97352 4.41986L4.41986 2.97352L5.68912 4.24275C6.36161 3.77385 7.1382 3.44389 7.97726 3.2945V1.5H10.0227V3.2945C10.8618 3.44389 11.6384 3.77385 12.3109 4.24275L13.5801 2.97352L15.0265 4.41986L13.7573 5.68912Z'
          stroke='#333333'
          stroke-width='1.125'
          stroke-linejoin='round'
        />
        <path
          d='M9 10.875C10.0355 10.875 10.875 10.0355 10.875 9C10.875 7.96448 10.0355 7.125 9 7.125C7.96448 7.125 7.125 7.96448 7.125 9C7.125 10.0355 7.96448 10.875 9 10.875Z'
          stroke='#333333'
          stroke-width='1.125'
          stroke-linejoin='round'
        />
      </svg>
    ),
    activeIcon: (
      <svg
        width='18'
        height='18'
        viewBox='0 0 18 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M13.7573 5.68912C14.2262 6.36161 14.5561 7.1382 14.7055 7.97726H16.5V10.0227H14.7055C14.5561 10.8618 14.2262 11.6384 13.7573 12.3109L15.0265 13.5801L13.5801 15.0265L12.3109 13.7573C11.6384 14.2262 10.8618 14.5561 10.0227 14.7055V16.5H7.97726V14.7055C7.1382 14.5561 6.36161 14.2262 5.68912 13.7573L4.41986 15.0265L2.97352 13.5801L4.24275 12.3109C3.77385 11.6384 3.44389 10.8618 3.2945 10.0227H1.5V7.97726H3.2945C3.44389 7.1382 3.77385 6.36161 4.24275 5.68912L2.97352 4.41986L4.41986 2.97352L5.68912 4.24275C6.36161 3.77385 7.1382 3.44389 7.97726 3.2945V1.5H10.0227V3.2945C10.8618 3.44389 11.6384 3.77385 12.3109 4.24275L13.5801 2.97352L15.0265 4.41986L13.7573 5.68912Z'
          stroke='#F3F8FE'
          stroke-width='1.125'
          stroke-linejoin='round'
        />
        <path
          d='M9 10.875C10.0355 10.875 10.875 10.0355 10.875 9C10.875 7.96448 10.0355 7.125 9 7.125C7.96448 7.125 7.125 7.96448 7.125 9C7.125 10.0355 7.96448 10.875 9 10.875Z'
          stroke='#F3F8FE'
          stroke-width='1.125'
          stroke-linejoin='round'
        />
      </svg>
    ),
    href: connection?.connection_id ? route('connection.meters', connection.connection_id) : '#',
    item: [
      {
        subValue: 'meter',
        subLabel: 'Meters and CTPTs',
        subLink: connection?.connection_id
          ? route('connection.meters', connection?.connection_id)
          : '#',
      },
    ],
  },
]
export default function ConnectionsLayout({
  children,
  breadcrumbs,
  connectionsNavItems,
  connection,
  value,
  subTabValue,
  heading,
  description,
  onEdit,
  sheetTitle,
  sheetAction,
  sheetOpen,
  sheetContent,
}: Readonly<ConnectionsLayoutProps>) {
  const { flash } = usePage<PageProps>().props
  useEffect(() => {
    if (flash?.message) {
      showSuccess(flash.message)
    }
    if (flash?.error) {
      showError(flash.error)
    }
    if (flash?.debug) {
      console.log(flash.debug)
      flash.debug.forEach((debug) => {
        showInfo(debug)
      })
    }
  }, [flash])

  return (
    <SidebarProvider>
      <ToastContainer theme='dark' />
      <div className='flex h-screen w-full flex-col'>
        <div className=''>
          <TopNavBar selectedTopNav={'Consumers'} />
        </div>

        <div className='grid flex-1 grid-cols-12'>
          <div className='col-span-2 hidden lg:block'>
            <LeftNavBar
              title={''}
              selectedItem='Connections'
              items={connectionsNavItems}
            />
          </div>

          <main className='col-span-12 p-7 lg:col-span-8'>
            <div>
              <div className='px-4 pt-2'>
                <CustomBreadcrumb list={breadcrumbs ?? []} />
              </div>

              <div className='flex flex-col gap-4 overflow-x-auto p-2'>
                {' '}
                <NestedTabGroup
                  tabs={connectionTabs(connection)}
                  defaultValue={value}
                  defaultSubValue={subTabValue}
                  headerLeft={
                    <>
                      <div className='kseb-h1 pt-7'>{heading}</div>
                      <p className='kseb-description pt-7 text-gray-600'>{description}</p>
                    </>
                  }
                >
                  {children}
                </NestedTabGroup>
              </div>
            </div>
          </main>

          <div className='col-span-2 hidden lg:block'>
            {sheetOpen && (
              <div className='flex h-full flex-col border-l bg-white'>
                {/* Header */}
                <div className='flex items-center justify-between border-b bg-gray-50 px-4 py-3'>
                  <h2 className='text-sm font-semibold text-gray-800'>{sheetTitle}</h2>

                  <button
                    onClick={() => sheetAction?.(false)}
                    className='cursor-pointer text-lg leading-none text-gray-400 hover:text-gray-700'
                  >
                    ×
                  </button>
                </div>

                {/* Content */}
                <div className='flex-1 overflow-y-auto px-4 py-3'>{sheetContent}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
export { connectionTabs }
