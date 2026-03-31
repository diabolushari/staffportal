import { MeterProfileParameter } from '@/interfaces/data_interfaces'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tag, Upload, Sigma } from 'lucide-react'
import ActionButton from '../action-button'

interface Props {
  meterProfileParameters: MeterProfileParameter[]
}

const ProfileParameterShowList = ({ meterProfileParameters }: Props) => {
  const [selectedItem, setSelectedItem] = useState<MeterProfileParameter | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  useEffect(() => {
    if (!showDeleteModal) {
      setSelectedItem(null)
    }
  }, [showDeleteModal])

  return (
    <div className='space-y-6'>
      {meterProfileParameters?.map((param) => (
        <Card
          key={param.id}
          className='rounded-2xl border border-gray-200 bg-white shadow-sm'
        >
          <CardContent className='p-6'>
            {/* Header */}
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>{param.name}</h2>

              <div className='flex gap-2'>
                <ActionButton
                  onEdit={() => router.get(route('meter-profile.edit', param.meter_parameter_id))}
                  onDelete={() => {
                    setSelectedItem(param)
                    setShowDeleteModal(true)
                  }}
                />
              </div>
            </div>

            {/* Info Grid */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              {/* Display Name */}
              <div className='flex items-start gap-3'>
                <Tag className='mt-1 h-5 w-5 text-gray-400' />
                <div>
                  <p className='text-sm text-gray-500'>Display Name</p>
                  <p className='font-medium text-blue-600'>{param.display_name}</p>
                </div>
              </div>

              {/* Export */}
              <div className='flex items-start gap-3'>
                <Upload className='mt-1 h-5 w-5 text-gray-400' />
                <div>
                  <p className='text-sm text-gray-500'>Export</p>
                  <p
                    className={`font-medium ${param.is_export ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {param.is_export ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              {/* Cumulative */}
              <div className='flex items-start gap-3'>
                <Sigma className='mt-1 h-5 w-5 text-gray-400' />
                <div>
                  <p className='text-sm text-gray-500'>Cumulative</p>
                  <p
                    className={`font-medium ${
                      param.is_cumulative ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {param.is_cumulative ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Delete Modal */}
      {selectedItem && showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title='Delete Metering Profile'
          url={route('meter-profile.destroy', selectedItem.meter_parameter_id)}
        >
          <span>
            Are you sure you want to delete <b>{selectedItem.name}</b>?
          </span>
        </DeleteModal>
      )}
    </div>
  )
}

export default ProfileParameterShowList
