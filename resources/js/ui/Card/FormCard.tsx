import { Card } from '@/components/ui/card'
import StrongText from '@/typography/StrongText'

export default function FormCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <div className='flex justify-between border-b-2 border-gray-200 py-4'>
        <StrongText className='text-base font-semibold'>{title}</StrongText>
      </div>

      <div className='mt-6 grid grid-cols-1 gap-8 p-4 md:grid-cols-2'>{children}</div>
    </Card>
  )
}
