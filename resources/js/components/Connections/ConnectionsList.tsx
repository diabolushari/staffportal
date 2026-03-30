import { Connection } from '@/interfaces/data_interfaces'
import DeleteButton from '@/ui/button/DeleteButton'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { router } from '@inertiajs/react'
import { Calendar, Cpu, Hash, Zap } from 'lucide-react'
import { useState } from 'react'
import ActionButton from '../action-button'
import { getDisplayDate } from '@/utils'

interface Props {
  connections: Connection[]
}

export default function ConnectionsList({ connections }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDeleteConnection, setSelectedDeleteConnection] = useState<Connection | null>(null)

  const handleDeleteConnection = (connection: Connection) => {
    setSelectedDeleteConnection(connection)
    setShowDeleteModal(true)
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {connections &&
          connections.map((connection) => (
            <div
              key={connection.connection_id}
              className='mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
              onClick={() => router.get(route('connections.show', connection.connection_id))}
            >
              <div className='flex items-start justify-between'>
                <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-2'>
                      <div className='font-inter text-base leading-normal font-semibold text-black'>
                        Consumer Number: #{connection.consumer_number}
                      </div>
                      <div></div>
                    </div>
                    <div>
                      {connection.consumer_profiles?.[0]?.organization_name && (
                        <span className='font-inter text-base leading-normal font-semibold text-black'>
                          Industry Name: {connection.consumer_profiles?.[0]?.organization_name}
                        </span>
                      )}
                      {connection.consumer_profiles?.[0]?.consumer_name && (
                        <span className='font-inter text-base leading-normal font-semibold text-black'>
                          Consumer Name: {connection.consumer_profiles?.[0]?.consumer_name}
                        </span>
                      )}
                    </div>

                    <div className='flex w-full items-center gap-5'>
                      <div className='flex items-center gap-[3px]'>
                        <Hash className='text-dark-gray h-3.5 w-3.5' />
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          Connection Type: {connection?.connection_type?.parameter_value}
                        </div>
                      </div>
                      <div className='flex items-center gap-[3px]'>
                        <Hash className='text-dark-gray h-3.5 w-3.5' />
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          Admin Office:{' '}
                          {connection.admin_office?.office_type.parameter_value +
                            ' - ' +
                            connection.admin_office?.office_name}
                        </div>
                      </div>

                      <div className='flex items-center gap-[3px]'>
                        <Cpu className='text-dark-gray h-3.5 w-3.5' />
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          Service Office: {connection.service_office_code}
                        </div>
                      </div>
                    </div>

                    <div className='flex w-full items-center gap-5'>
                      <div className='flex items-center gap-[3px]'>
                        <Zap className='text-dark-gray h-3.5 w-3.5' />
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          Tariff: {connection?.tariff?.parameter_value}
                        </div>
                      </div>
                      <div className='flex items-center gap-[3px]'>
                        <Zap className='text-dark-gray h-3.5 w-3.5' />
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          Demand: {connection?.contract_demand_kva_val} kVA
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-[3px]'>
                      <Calendar className='text-dark-gray h-3.5 w-3.5' />
                      <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                        Connected on: {getDisplayDate(connection.connected_date)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                  <div
                    className={`rounded-[50px] px-2.5 py-px ${
                      connection.is_current ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    <div
                      className={`font-inter text-xs leading-6 font-normal tracking-[-0.072px] ${
                        connection.is_current ? 'text-deep-green' : 'text-red-800'
                      }`}
                    >
                      {connection.is_current ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <div
                    className='flex flex-col items-end justify-end gap-2'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ActionButton onDelete={() => handleDeleteConnection(connection)} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        {showDeleteModal && (
          <DeleteModal
            title='Delete Connection'
            url={route('connections.destroy', selectedDeleteConnection?.connection_id)}
            setShowModal={(showModal) => setShowDeleteModal(showModal)}
          >
            <span>
              Are you sure to delete the connection with consumer number{' '}
              <b>{selectedDeleteConnection?.consumer_number}</b>?
            </span>
          </DeleteModal>
        )}
      </div>
    </div>
  )
}
