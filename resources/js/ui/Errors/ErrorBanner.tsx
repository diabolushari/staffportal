import { Button } from '@/components/ui/button'
import { Link } from '@inertiajs/react'

interface ErrorBannerProps {
  readonly title: string
  readonly description: string
  readonly bulletPoints: string[]
  readonly actionUrl: string
}

export default function ErrorBanner({
  title,
  description,
  bulletPoints,
  actionUrl,
}: Readonly<ErrorBannerProps>) {
  return (
    <section className='flex w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm sm:px-10'>
      <div className='mx-auto flex max-w-2xl flex-col gap-2'>
        <h2 className='text-base font-semibold text-slate-700 sm:text-lg'>{title}</h2>
        <p className='text-sm text-slate-500'>{description}</p>
        {bulletPoints.length > 0 && (
          <ul className='mx-auto mt-1 flex max-w-md list-disc flex-col gap-1 text-left text-sm text-slate-500'>
            {bulletPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}
      </div>
      <div className='mt-6 flex w-full justify-center'>
        <Button
          asChild
          variant='highlight'
          size='sm'
          className='min-w-28 rounded-md'
        >
          <Link href={actionUrl}>OK</Link>
        </Button>
      </div>
    </section>
  )
}
