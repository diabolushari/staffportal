import DeleteModal from '@/ui/Modal/DeleteModal'
import { useState } from 'react'
import { Cpu, Zap, Calendar, Hash, Factory, Eye } from 'lucide-react'
import { getDisplayDate } from '@/utils'
import { StationConsumerRel } from '@/interfaces/data_interfaces'
import StationActionButton from '../station-action-button'
import ReprioritizeStationConsumerModal from './ReprioritizeStationConsumerModal'
import DeactivateStationConsumerModal from './DeactivateStationConsumerModal'

interface Props {
  relations: StationConsumerRel[]
  onViewBalance?: (rel: StationConsumerRel) => void
}

export default function ConsumerStationList({ relations, onViewBalance }: Props) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [reprioritizeModalOpen, setReprioritizeModalOpen] = useState(false)
  const [inactiveModalOpen, setInactiveModalOpen] = useState(false)
  const [selectedRelation, setSelectedRelation] = useState<StationConsumerRel | null>(null)

  const handleDeleteClick = (rel: StationConsumerRel) => {
    setSelectedRelation(rel)
    setDeleteModalOpen(true)
  }

  if (!relations || relations.length === 0) {
    return (
      <div className='flex h-full items-center justify-center text-gray-500'>No Stations Found</div>
    )
  }

  const getAvailableBalance = (rel: StationConsumerRel) => {
    const summaries = rel.station?.unit_bank_summaries || []
    if (summaries.length === 0) return 0

    const latestMonth = Math.max(...summaries.map((s) => s.bill_year_month))

    const latestSummaries = summaries.filter((s) => s.bill_year_month === latestMonth)

    return latestSummaries.reduce((sum, item) => sum + (item.closing_balance || 0), 0)
  }
  const getPrimarySource = relations.filter(
    (rel) => rel.station_connection_id == rel.consumer_connection_id
  )

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {relations.map((rel) => (
          <div
            key={rel.rel_id}
            className={`mb-4 cursor-pointer rounded-lg border border-gray-200 px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md ${getPrimarySource.includes(rel) ? 'bg-blue-500 text-white [&_*]:text-white' : ''}`}
          >
            <div className='flex items-start justify-between'>
              <div
                className={`mt-[10px] rounded-full px-3 py-[2px] text-xs font-bold ${
                  getPrimarySource.includes(rel)
                    ? 'bg-white !text-blue-700 text-blue-700'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                P-{rel.station_priority_order}
              </div>
              <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                {/* Station Name */}
                <div className='font-semibold text-black'>{rel.station?.station_name ?? '-'}</div>

                <div className='flex flex-wrap gap-5'>
                  <div className='flex items-center gap-1'>
                    <Factory className='h-3.5 w-3.5 text-gray-500' />
                    <span className='text-sm text-gray-600'>
                      Plant Type: {rel.station?.plant_type?.parameter_value ?? '-'}
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Hash className='h-3.5 w-3.5 text-gray-500' />
                    <span className='text-sm text-gray-600'>
                      Generation Type: {rel.station?.generation_type?.parameter_value ?? '-'}
                    </span>
                  </div>

                  {getPrimarySource.includes(rel) && (
                    <div
                      className='flex cursor-pointer items-center gap-1'
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewBalance?.(rel)
                      }}
                    >
                      <Eye className='h-3.5 w-3.5 text-gray-500' />
                      <span className='text-sm font-medium text-blue-600 hover:underline'>
                        Available Balance: {getAvailableBalance(rel)}
                      </span>
                    </div>
                  )}

                  {/* <div className='flex items-center gap-1'>
                    <Cpu className='h-3.5 w-3.5 text-gray-500' />
                    <span className='text-sm text-gray-600'>
                      Consumer Type: {rel.consumer_type?.parameter_value ?? '-'}
                    </span>
                  </div> */}

                  {/* <div className='flex items-center gap-1'>
                    <Zap className='h-3.5 w-3.5 text-gray-500' />
                    <span className='text-sm text-gray-600'>
                      Priority: {rel.consumer_priority_order}
                    </span>
                  </div> */}
                </div>

                {/* Row 2 */}
                <div className='flex flex-wrap gap-5'>
                  <div className='flex items-center gap-1'>
                    <Zap className='h-3.5 w-3.5 text-gray-500' />
                    <span className='text-sm text-gray-600'>
                      Installed Capacity: {rel.station?.installed_capacity ?? '-'} MW
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Calendar className='h-3.5 w-3.5 text-gray-500' />
                    <span className='text-sm text-gray-600'>
                      Active From: {rel.effective_start ? getDisplayDate(rel.effective_start) : '-'}
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

              {/* Right side */}
              <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                {getPrimarySource.includes(rel) && (
                  <div className='rounded-full bg-blue-700 px-3 py-[2px] text-xs font-medium text-white'>
                    Primary Source
                  </div>
                )}

                <div
                  className={`rounded-[50px] px-2.5 py-px ${
                    // rel.is_current ? 'bg-green-100' : 'bg-gray-200'
                    rel.is_current
                      ? getPrimarySource.includes(rel)
                        ? 'bg-green-300 text-green-900'
                        : 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <span
                    className={`text-xs ${rel.is_current ? 'text-green-800' : 'text-gray-700'}`}
                  >
                    {rel.is_current ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {!getPrimarySource.includes(rel) && (
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
                      onDeleteStation={() => handleDeleteClick(rel)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {reprioritizeModalOpen && selectedRelation && (
        <ReprioritizeStationConsumerModal
          setShowModal={setReprioritizeModalOpen}
          relation={selectedRelation}
          isconsumerPriority={false}
        />
      )}
      {inactiveModalOpen && selectedRelation && (
        <DeactivateStationConsumerModal
          setShowModal={setInactiveModalOpen}
          relation={selectedRelation}
        />
      )}

      {deleteModalOpen && (
        <DeleteModal
          setShowModal={setDeleteModalOpen}
          title='Deactivate Station Consumer Relation'
          url={`/station-consumer-rels/${selectedRelation?.version_id}`}
        >
          <span>Are you sure you want to deactivate this relation?</span>
        </DeleteModal>
      )}
    </div>
  )
}
