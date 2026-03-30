import StationConsumerList from '@/components/GeneratingStation/ConsumerStationList'
import { StationConsumerRel } from '@/interfaces/data_interfaces'

interface Props {
  relations: StationConsumerRel[]
}

export default function StationConsumerRelIndex({ relations }: Readonly<Props>) {
  console.log('Relations from backend:', relations)
  return (
    <div className='mt-6'>
      <StationConsumerList relations={relations ?? []} />
    </div>
  )
}
