import { Download, Edit, MoreVertical, Trash2 } from 'lucide-react'
import { router } from '@inertiajs/react'
import { TariffOrder } from '@/interfaces/data_interfaces'
import { useEffect, useRef, useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { getDisplayDate } from '@/utils'
import ActionButton from '../action-button'

interface Props {
  tariff_orders: TariffOrder[]
}

export default function TariffOrderList({ tariff_orders }: Readonly<Props>) {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [deleteModalOrder, setDeleteModalOrder] = useState<TariffOrder | null>(null)
  const handleDownload = (order: TariffOrder) => {
    // Navigate to backend gRPC gateway endpoint that serves the file
    window.open(route('tariff-order.download', order.tariff_order_id), '_blank')
  }

  const handleDelete = (order: TariffOrder) => {
    setDeleteModalOpen(true)
    setDeleteModalOrder(order)
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {tariff_orders?.map((order) => (
          <div
            key={order.tariff_order_id}
            className='mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
            onClick={() => router.get(route('tariff-orders.show', order.tariff_order_id))}
          >
            <div className='flex items-start justify-between'>
              <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <div className='font-inter text-base font-semibold text-black'>
                      {order.order_descriptor}
                    </div>
                    <div className='rounded-[50px] bg-blue-100 px-2.5 py-px'>
                      <div className='font-inter text-xs text-blue-800'>
                        #{order.tariff_order_id}
                      </div>
                    </div>
                  </div>
                  <div className='font-inter text-dark-gray text-sm'>
                    Published Date: <b>{getDisplayDate(order.published_date)}</b>
                  </div>
                  <div className='font-inter text-dark-gray text-sm'>
                    Effective Period:{' '}
                    <b>
                      {getDisplayDate(order.effective_start)}
                      {order.effective_end && ` → ${getDisplayDate(order.effective_end)}`}
                    </b>
                  </div>
                </div>
              </div>
              <div className='flex cursor-pointer flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                <ActionButton
                  onEdit={() => router.visit(route('tariff-orders.edit', order.tariff_order_id))}
                  onDownload={() => handleDownload(order)}
                  onDelete={() => handleDelete(order)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {deleteModalOpen && (
        <DeleteModal
          setShowModal={setDeleteModalOpen}
          title='Delete Tariff Order'
          url={route('tariff-orders.destroy', deleteModalOrder?.tariff_order_id)}
        />
      )}
    </div>
  )
}
