import { useState } from 'react'
import { PurposeInfo } from '@/interfaces/data_interfaces'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { getDisplayDate } from '@/utils'
import ActionButton from '../action-button'

interface Props {
  purposeInfos: PurposeInfo[]
  handleEdit: (purposeInfo: PurposeInfo) => void
}

export default function PurposeInfoList({ purposeInfos, handleEdit }: Readonly<Props>) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPurpose, setSelectedPurpose] = useState<PurposeInfo | null>(null)

  const handleDelete = (purposeInfo: PurposeInfo) => {
    setDeleteModalOpen(true)
    setSelectedPurpose(purposeInfo)
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {purposeInfos?.map((item) => (
          <div
            key={item.id}
            className='mb-4 rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0'
          >
            <div className='flex items-start justify-between'>
              <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                <div className='flex flex-col gap-1'>
                  {/* Purpose Name */}
                  <div className='flex items-center gap-2'>
                    <div className='font-inter text-base font-semibold text-black'>
                      {item.purpose?.parameter_value}
                    </div>
                  </div>

                  {/* Effective Period */}

                  {/* Non-DPS Flag (optional but useful) */}
                  <div className='flex gap-4'>
                    <div className='font-inter text-dark-gray text-sm'>
                      Tariff: <b>{item.tariff?.parameter_value}</b>
                    </div>
                    <div className='font-inter text-dark-gray text-sm'>
                      Non-DPS: <b>{item.is_non_dps ? 'Yes' : 'No'}</b>
                    </div>
                  </div>

                  <div className='font-inter text-dark-gray text-sm'>
                    Effective Period:{' '}
                    <b>
                      {getDisplayDate(item.effective_start)}
                      {item.effective_end && ` → ${getDisplayDate(item.effective_end)}`}
                    </b>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div
                className='flex cursor-pointer flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'
                onClick={(e) => e.stopPropagation()}
              >
                <ActionButton
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteModalOpen && (
        <DeleteModal
          setShowModal={setDeleteModalOpen}
          title='Delete Purpose Info'
          url={route('purpose-info.destroy', selectedPurpose?.id)}
        />
      )}
    </div>
  )
}
