import { MeterTransformer } from '@/interfaces/data_interfaces'
import { router } from '@inertiajs/react'
import { Activity, Gauge } from 'lucide-react'
import { useMemo } from 'react'

interface Props {
  transformer: MeterTransformer
  onDelete?: (item: MeterTransformer) => void
}

export default function MeterTransformerListItem({ transformer, onDelete }: Readonly<Props>) {
  const transformerInfo = useMemo(() => {
    const type = transformer.type?.parameter_value?.toUpperCase()
    if (type === 'CT') {
      return {
        primary: 'Primary Current',
        secondary: 'Secondary Current',
        primaryUnit: 'A',
        secondaryUnit: 'A',
        icon: Activity,
      }
    } else if (type === 'PT') {
      return {
        primary: 'Primary Voltage',
        secondary: 'Secondary Voltage',
        primaryUnit: 'V',
        secondaryUnit: 'V',
        icon: Gauge,
      }
    }
    return {
      primary: 'Primary Ratio',
      secondary: 'Secondary Ratio',
      primaryUnit: '',
      secondaryUnit: '',
      icon: Activity,
    }
  }, [transformer.type?.parameter_value])

  const handleTransformerClick = () => {
    router.get(`/meter-ctpt/${transformer.meter_ctpt_id}`)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(transformer)
  }

  return (
    <div
      onClick={handleTransformerClick}
      className='cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow hover:shadow-md'
    >
      <div className='flex items-start justify-between'>
        <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
          <div className='flex flex-col gap-5'>
            {/* Serial + Type */}
            <div className='flex items-center gap-2'>
              <div className='font-inter text-base leading-normal font-semibold text-black'>
                {transformer.ctpt_serial}
              </div>
              <div className='rounded-[50px] bg-blue-100 px-2.5'>
                <div className='font-inter text-xs leading-6 font-normal tracking-[-0.072px] text-blue-800'>
                  {transformer.type?.parameter_value}
                </div>
              </div>
            </div>
            <div className='flex w-full flex-wrap gap-5'>
              <div className='flex items-center gap-[3px]'>
                <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                  Type: <b>{transformer.type?.parameter_value}</b>
                </div>
              </div>
              <div className='flex items-center gap-[3px]'>
                <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                  Make: <b>{transformer.make?.parameter_value}</b>
                </div>
              </div>
              <div className='flex items-center gap-[3px]'>
                <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                  Ownership Type: <b>{transformer.ownership_type?.parameter_value}</b>
                </div>
              </div>
            </div>

            {/* Primary and Secondary Values */}
            <div className='flex w-full flex-wrap gap-5'>
              <div className='flex items-center gap-[3px]'>
                <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                  {transformerInfo.primary}: {transformer.ratio_primary_value || 'N/A'}
                  {transformerInfo.primaryUnit && ` ${transformerInfo.primaryUnit}`}
                </div>
              </div>
              <div className='flex items-center gap-[3px]'>
                <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                  {transformerInfo.secondary}: {transformer.ratio_secondary_value || 'N/A'}
                  {transformerInfo.secondaryUnit && ` ${transformerInfo.secondaryUnit}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
