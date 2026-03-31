import { router } from '@inertiajs/react'
import { useState } from 'react'
import { VariableRate } from '@/interfaces/data_interfaces'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { getDisplayDate } from '@/utils'
import ActionButton from '../action-button'
import VariableRateFormModal from './VariableRateFormModal'

interface Props {
  variableRates: VariableRate[]
  handleEdit: (rate: VariableRate) => void
}

export default function VariableRateList({ variableRates, handleEdit }: Readonly<Props>) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedRate, setSelectedRate] = useState<VariableRate | null>(null)

  const handleDelete = (rate: VariableRate) => {
    setDeleteModalOpen(true)
    setSelectedRate(rate)
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {variableRates?.map((rate) => (
          <div
            key={rate.id}
            className='mb-4 rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0'
          >
            <div className='flex items-start justify-between'>
              <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <div className='font-inter text-base font-semibold text-black'>
                      {rate.variable_name?.parameter_value}
                    </div>
                  </div>

                  <div className='font-inter text-dark-gray text-sm'>
                    Rate: <b>{rate?.rate}</b>
                  </div>

                  <div className='font-inter text-dark-gray text-sm'>
                    Effective Period:{' '}
                    <b>
                      {getDisplayDate(rate?.effective_start)}
                      {rate?.effective_end && ` → ${getDisplayDate(rate?.effective_end)}`}
                    </b>
                  </div>
                </div>
              </div>

              <div
                className='flex cursor-pointer flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'
                onClick={(e) => e.stopPropagation()}
              >
                <ActionButton
                  onEdit={() => handleEdit(rate)}
                  onDelete={() => handleDelete(rate)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteModalOpen && (
        <DeleteModal
          setShowModal={setDeleteModalOpen}
          title='Delete Variable Rate'
          url={route('variable-rates.destroy', selectedRate?.id)}
        />
      )}
    </div>
  )
}
