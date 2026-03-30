import { Card } from '@/components/ui/card'

interface Props {
  powerFactorsByMeter: any
  meterId: number
  averagePF?: string | number | null
}

export default function PowerFactorBar({ powerFactorsByMeter, averagePF }: Props) {
  if (!powerFactorsByMeter || powerFactorsByMeter.factors === null) return null
  return (
    <div className='mb-4 flex space-x-4 overflow-x-auto pb-2'>
      {powerFactorsByMeter?.factors?.map((pf: any) => (
        <Card
          key={pf.timezone_name}
          className='min-w-[140px] flex-shrink-0 border border-gray-300 bg-gradient-to-b from-white to-gray-50 p-3 text-center shadow-sm'
        >
          <strong>{pf.timezone_name}</strong>
          <div className='text-lg font-bold text-blue-700'>{pf.pf}</div>
        </Card>
      ))}
      {averagePF ? (
        <Card className='min-w-[140px] flex-shrink-0 border-2 border-blue-500 bg-gradient-to-b from-blue-50 to-blue-100 p-3 text-center shadow-md'>
          <strong className='text-blue-800'>Average</strong>
          <div className='text-lg font-bold text-blue-700'>{Number(averagePF).toFixed(2)}</div>
        </Card>
      ) : null}
    </div>
  )
}
