import { router } from '@inertiajs/react'
import { TariffConfig } from '@/interfaces/data_interfaces'
import EditButton from '@/ui/button/EditButton'
import DeleteButton from '@/ui/button/DeleteButton'
import { useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import NormalText from '@/typography/NormalText'
import StrongText from '@/typography/StrongText'
import { getDisplayDate } from '@/utils'

interface Props {
  tariff_configs: TariffConfig[]
}

export default function TariffConfigList({ tariff_configs }: Readonly<Props>) {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [deleteModalOrder, setDeleteModalOrder] = useState<TariffConfig | null>(null)
  const handleDelete = (order: TariffConfig) => {
    setDeleteModalOpen(true)
    setDeleteModalOrder(order)
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='font-inter text-dark-gray px-7 pt-[21px] pb-3 text-[15px] leading-[23px] font-semibold tracking-[-0.0924px]'>
        Tariff Order Info
      </div>
      <div className='flex flex-col px-7 pb-7'>
        {tariff_configs?.map((config) => (
          <div
            key={config.tariff_config_id}
            className='mb-4 rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
          >
            <div className='flex items-start justify-between'>
              <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <div className='font-inter text-base font-semibold text-black'>
                      <NormalText>Tariff Order: </NormalText>
                      <StrongText>{config.tariff_order?.order_descriptor}</StrongText>
                    </div>
                    <div className='rounded-[50px] bg-blue-100 px-2.5 py-px'>
                      <div className='font-inter text-xs text-blue-800'>
                        <NormalText>
                          #Connection tariff :{config.connection_tariff?.parameter_value}
                        </NormalText>
                      </div>
                      <div className='font-inter text-xs text-green-800'>
                        <NormalText>
                          #Connection purpose:{config.connection_purpose?.parameter_value}
                        </NormalText>
                      </div>
                    </div>
                  </div>

                  <div className='font-inter text-dark-gray text-sm'>
                    Effective: {getDisplayDate(config.effective_start)}
                    {config.effective_end && ` → ${getDisplayDate(config.effective_end)}`}
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                <EditButton
                  onClick={() => router.visit(route('tariff-config.edit', config.tariff_config_id))}
                />
                <DeleteButton onClick={() => handleDelete(config)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {deleteModalOpen && (
        <DeleteModal
          setShowModal={setDeleteModalOpen}
          title='Delete Tariff Config'
          url={route('tariff-config.destroy', deleteModalOrder?.tariff_config_id)}
        />
      )}
    </div>
  )
}
