import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout'
import { PageProps, type BreadcrumbItem } from '@/types'
import { usePage } from '@inertiajs/react'
import { useEffect, type ReactNode } from 'react'
import { toast, ToastContainer } from 'react-toastify'

interface AppLayoutProps {
  children: ReactNode
  breadcrumbs?: BreadcrumbItem[]
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
  const { flash } = usePage<PageProps>().props

  useEffect(() => {
    if (flash?.message) {
      toast.success(flash.message)
    }
    if (flash?.error) {
      toast.error(flash.error)
    }
  }, [flash])

  return (
    <>
      <ToastContainer />
      <AppLayoutTemplate
        breadcrumbs={breadcrumbs}
        {...props}
      >
        {children}
      </AppLayoutTemplate>
    </>
  )
}
