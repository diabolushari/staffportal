import ActionButton from '@/components/action-button'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { router } from '@inertiajs/react'
import { useState } from 'react'
import { Zap, Cpu, Calendar, Hash } from 'lucide-react'
import { getDisplayDate } from '@/utils'
import { GeneratingStation } from '@/interfaces/data_interfaces'

interface Props {
  stations: GeneratingStation[]
}

export default function GeneratingStationList({ stations }: Props) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedStation, setSelectedStation] = useState<GeneratingStation | null>(null)

  const handleDeleteClick = (station: GeneratingStation) => {
    setSelectedStation(station)
    setDeleteModalOpen(true)
  }

  if (!stations || stations.length === 0) {
    return (
      <div className='flex h-full items-center justify-center text-gray-500'>
        No Generating Stations Found
      </div>
    )
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {stations.map((station) => (
          <div
            key={station.station_id}
            className='mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
            onClick={() => router.get(`/generating-stations/${station.station_id}`)}
          >
            <div className='flex items-start justify-between'>
              <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                {/* Station Name */}
                <div className='font-semibold text-black'>{station.station_name}</div>

                {/* Row 1 */}
                <div className='flex flex-wrap gap-5'>
                  <div className='flex items-center gap-1'>
                    <Hash className='h-3.5 w-3.5 text-gray-500' />
                    <span className='text-sm text-gray-600'>
                      Generation Type: {station.generation_type?.parameter_value ?? '-'}
                    </span>
                  </div>

                  {station.connection?.consumer_number && (
                    <div className='flex items-center gap-1'>
                      <Hash className='h-3.5 w-3.5 text-gray-500' />
                      <span className='text-sm text-gray-600'>
                        Consumer Number: {station.connection.consumer_number}
                      </span>
                    </div>
                  )}

                  <div className='flex items-center gap-1'>
                    <Cpu className='h-3.5 w-3.5 text-gray-500' />
                    <span className='text-sm text-gray-600'>
                      Plant Type: {station.plant_type?.parameter_value ?? '-'}
                    </span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className='flex flex-wrap gap-5'>
                  <div className='flex items-center gap-1'>
                    <Zap className='h-3.5 w-3.5 text-gray-500' />
                    <span className='text-sm text-gray-600'>
                      Voltage: {station.voltage_category?.parameter_value ?? '-'}
                    </span>
                  </div>

                  <div className='flex items-center gap-1'>
                    <Zap className='h-3.5 w-3.5 text-gray-500' />
                    <span className='text-sm text-gray-600'>
                      Installed Capacity: {station.installed_capacity}
                    </span>
                  </div>

                  <div className='flex items-center gap-1'>
                    <Calendar className='h-3.5 w-3.5 text-gray-500' />
                    <span className='text-sm text-gray-600'>
                      Commissioned:{' '}
                      {station.commissioning_date
                        ? getDisplayDate(station.commissioning_date)
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                {/* Status */}
                <div
                  className={`rounded-[50px] px-2.5 py-px ${
                    station.generation_status?.parameter_value.toLowerCase() == 'active'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}
                >
                  <span
                    className={`text-xs ${station.generation_status?.parameter_value.toLowerCase() == 'active' ? 'text-green-800' : 'text-red-800'}`}
                  >
                    {station?.generation_status?.parameter_value}
                  </span>
                </div>

                {/* Actions */}
                {/* <div onClick={(e) => e.stopPropagation()}>
                  <ActionButton
                  onEdit={() => router.get(`/generating-stations/${station.station_id}/edit`)}
                  onDelete={() => handleDeleteClick(station)}
                  />
                </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteModalOpen && (
        <DeleteModal
          setShowModal={setDeleteModalOpen}
          title='Delete Generating Station'
          url={`/generating-stations/${selectedStation?.station_id}`}
        >
          <span>
            Are you sure you want to delete <b>{selectedStation?.station_name}</b>?
          </span>
        </DeleteModal>
      )}
    </div>
  )
}
