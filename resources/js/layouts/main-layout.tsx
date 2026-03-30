import LeftNavBar from '@/components/Navbar/LeftNavBar'
import { MainNav } from '@/components/Navbar/navitems'
import TopNavBar from '@/components/Navbar/TopNavBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { BreadcrumbItem, PageProps } from '@/types'
import { showError, showInfo, showSuccess } from '@/ui/alerts'
import CustomBreadcrumb from '@/ui/BreadCrumb'
import AddButton from '@/ui/button/AddButton'
import EditButton from '@/ui/button/EditButton'
import { router, usePage } from '@inertiajs/react'
import React, { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'

interface Props {
  children: React.ReactNode
  breadcrumb?: BreadcrumbItem[]
  navItems?: MainNav
  addBtnUrl?: string
  addBtnText?: string
  addBtnClick?: () => void
  leftBarTitle?: string
  title?: string
  selectedItem?: string
  selectedTopNav?: string
  description?: React.ReactNode
  editBtnClick?: () => void
  sheetTitle?: string
  sheetAction?: (open: boolean) => void
  sheetOpen?: boolean
  sheetContent?: React.ReactNode
}

export default function MainLayout({
  children,
  breadcrumb,
  navItems,
  addBtnUrl,
  addBtnText,
  addBtnClick,
  title,
  selectedItem,
  selectedTopNav,
  description,
  editBtnClick,
  sheetAction,
  sheetOpen,
  sheetContent,
  sheetTitle,
}: Readonly<Props>) {
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
          <TopNavBar selectedTopNav={selectedTopNav} />
        </div>

        <div className='grid flex-1 grid-cols-12'>
          <div className='col-span-2 hidden lg:block'>
            <LeftNavBar
              title={''}
              selectedItem={selectedItem}
              items={navItems}
            />
          </div>

          <main className='col-span-12 p-4 lg:col-span-8'>
            <div>
              <div className='px-4 pt-2'>
                <CustomBreadcrumb list={breadcrumb ?? []} />
              </div>

              <div className='flex items-center justify-between px-4 py-2'>
                <div className='flex flex-col gap-1'>
                  {title && <div className='kseb-h1 pt-5'>{title}</div>}

                  {description && (
                    <p className='kseb-paragraph pt-5 text-gray-600'>{description}</p>
                  )}
                </div>

                <div>
                  <div className='flex items-center gap-2'>
                    {addBtnUrl && (
                      <AddButton
                        onClick={() => router.get(addBtnUrl)}
                        buttonText={`Add ${addBtnText}`}
                      />
                    )}
                    {addBtnClick && (
                      <AddButton
                        onClick={addBtnClick}
                        buttonText={`Add ${addBtnText}`}
                      />
                    )}
                    {editBtnClick && <EditButton onClick={editBtnClick} />}
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-4 overflow-x-auto p-2'>{children}</div>
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
