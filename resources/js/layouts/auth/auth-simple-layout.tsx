import { type PropsWithChildren } from 'react'

interface AuthLayoutProps {
  name?: string
  title?: string
  description?: string
}

export default function AuthSimpleLayout({
  children,
  title,
  description,
}: PropsWithChildren<AuthLayoutProps>) {
  return (
    <div className='bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-col items-center gap-4'>
            {/* Logo */}
            <img
              src='/kseb_logo.svg'
              alt='KSEB Logo'
              className='h-16 w-auto object-contain'
            />

            <div className='space-y-2 text-center'>
              {title && <h1 className='text-xl font-medium'>{title}</h1>}
              {description && <p className='text-muted-foreground text-sm'>{description}</p>}
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
