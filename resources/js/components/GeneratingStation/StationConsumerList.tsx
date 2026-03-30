import { Consumer, StationConsumerRel } from '@/interfaces/data_interfaces'
import { Calendar, User, Hash, Building2 } from 'lucide-react'
import { getDisplayDate } from '@/utils'
import StationActionButton from '../station-action-button'
import ReprioritizeStationConsumerModal from './ReprioritizeStationConsumerModal'
import DeactivateStationConsumerModal from './DeactivateStationConsumerModal'
import { useState } from 'react'

interface Props {
  relations: StationConsumerRel[]
}

export default function StationConsumerList({ relations }: Props) {
  const [selectedRelation, setSelectedRelation] = useState<StationConsumerRel | null>(null)
  const [reprioritizeModalOpen, setReprioritizeModalOpen] = useState(false)
  const [inactiveModalOpen, setInactiveModalOpen] = useState(false)

  if (!relations || relations.length === 0) {
    return (
      <div className='flex h-full items-center justify-center text-gray-500'>
        No Consumers Found
      </div>
    )
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {relations.map((rel) => {
          const consumer = rel.consumer_connection?.consumer_profiles?.[0]

          return (
            <div
              key={rel.rel_id}
              className='mb-4 cursor-pointer rounded-lg border border-gray-200 px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
            >
              <div className='flex items-start justify-between'>
                <div className='mt-[10px] rounded-full bg-gray-200 px-3 py-[2px] text-xs font-bold text-gray-800'>
                  P-{rel.consumer_priority_order}
                </div>
                {/* Left section */}
                <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                  {/* Consumer Name */}
                  <div className='font-semibold text-black'>{consumer?.consumer_name ?? '-'}</div>

                  <div className='flex flex-wrap gap-5'>
                    <div className='flex items-center gap-1'>
                      <Hash className='h-3.5 w-3.5 text-gray-500' />
                      <span className='text-sm text-gray-600'>
                        Consumer No: {rel.consumer_connection?.consumer_number ?? '-'}
                      </span>
                    </div>

                    <div className='flex items-center gap-1'>
                      <User className='h-3.5 w-3.5 text-gray-500' />
                      <span className='text-sm text-gray-600'>
                        Legacy Code: {rel.consumer_connection?.consumer_legacy_code ?? '-'}
                      </span>
                    </div>

                    <div className='flex items-center gap-1'>
                      <Building2 className='h-3.5 w-3.5 text-gray-500' />
                      <span className='text-sm text-gray-600'>
                        Organization: {consumer?.organization_name ?? '-'}
                      </span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className='flex flex-wrap gap-5'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='h-3.5 w-3.5 text-gray-500' />
                      <span className='text-sm text-gray-600'>
                        Active From:{' '}
                        {rel.effective_start ? getDisplayDate(rel.effective_start) : '-'}
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Calendar className='h-3.5 w-3.5 text-gray-500' />
                      <span className='text-sm text-gray-600'>
                        Active To: {rel.effective_end ? getDisplayDate(rel.effective_end) : '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right section */}
                <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                  <div
                    className={`rounded-[50px] px-2.5 py-px ${
                      rel.is_current ? 'bg-green-100' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`text-xs ${rel.is_current ? 'text-green-800' : 'text-gray-700'}`}
                    >
                      {rel.is_current ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <StationActionButton
                      onReprioritize={() => {
                        setSelectedRelation(rel)
                        setReprioritizeModalOpen(true)
                      }}
                      onInactive={() => {
                        setSelectedRelation(rel)
                        setInactiveModalOpen(true)
                      }}
                      onDeleteStation={() => console.log('Delete', rel)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {reprioritizeModalOpen && selectedRelation && (
        <ReprioritizeStationConsumerModal
          setShowModal={setReprioritizeModalOpen}
          relation={selectedRelation}
          isconsumerPriority={true}
        />
      )}
      {inactiveModalOpen && selectedRelation && (
        <DeactivateStationConsumerModal
          setShowModal={setInactiveModalOpen}
          relation={selectedRelation}
        />
      )}
    </div>
  )
}
