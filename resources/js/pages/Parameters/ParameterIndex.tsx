import { metadataNavItems } from '@/components/Navbar/navitems'
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'
import MainLayout from '@/layouts/main-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'

export default function ParameterIndex() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Parameters',
      href: '/parameters',
    },
  ]
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={metadataNavItems}
      selectedItem='Values'
    >
      <Head title='Dashboard' />
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
          <div className='border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border'>
            <PlaceholderPattern className='absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20' />
          </div>
          <div className='border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border'>
            <PlaceholderPattern className='absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20' />
          </div>
          <div className='border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border'>
            <PlaceholderPattern className='absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20' />
          </div>
        </div>
        <div className='border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min'>
          <PlaceholderPattern className='absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20' />
        </div>
      </div>
    </MainLayout>
  )
}
