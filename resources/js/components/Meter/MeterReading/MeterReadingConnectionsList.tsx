import { Connection } from '@/interfaces/data_interfaces'
import { router } from '@inertiajs/react'
import { Zap, Cpu, Calendar, Hash } from 'lucide-react'

interface Props {
  connections: Connection[]
}

export default function MeterReadingConnectionsList({ connections }: Readonly<Props>) {
  const handleConnectionClick = (connection: Connection) => {
    router.get(route('meter-reading.create', connection.connection_id))
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='font-inter text-dark-gray px-7 pt-[21px] pb-3 text-[15px] leading-[23px] font-semibold tracking-[-0.0924px]'>
        Connection Info
      </div>
      <div className='flex flex-col px-7 pb-7'>
        {connections &&
          connections.map((connection) => (
            <div
              key={connection.connection_id}
              onClick={() => handleConnectionClick(connection)}
              className='mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
            >
              <div className='flex items-start justify-between'>
                <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-2'>
                      <div className='font-inter text-base leading-normal font-semibold text-black'>
                        Consumer Number: #{connection.consumer_number}
                      </div>
                      <div className='rounded-[50px] bg-blue-100 px-2.5 py-px'>
                        <div className='font-inter text-xs leading-6 font-normal tracking-[-0.072px] text-blue-800'>
                          ID: {connection.connection_id}
                        </div>
                      </div>
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
                          Admin Office: {connection.admin_office_code}
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
                        Connected on:{' '}
                        {new Date(connection.connected_date).toLocaleDateString('en-GB')}
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
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
