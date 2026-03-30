import { MeterProfileGroupByProfile, MeterProfileParameter } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import NormalText from '@/typography/NormalText'
import StrongText from '@/typography/StrongText'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

interface Props {
  meterProfileParameters: MeterProfileGroupByProfile[]
  profilesWithNoParameterValue: ParameterValues[]
}

const MeterProfileParameterList = ({
  meterProfileParameters,
  profilesWithNoParameterValue,
}: Props) => {
  const [selectedItem, setSelectedItem] = useState<MeterProfileParameter | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  useEffect(() => {
    if (!showDeleteModal) {
      setSelectedItem(null)
    }
  }, [showDeleteModal])

  const handleShow = (profileId: number) => {
    router.get(route('meter-profile.show', profileId))
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {/* Profiles with parameters */}
        {meterProfileParameters.map((group) => (
          <div
            key={group?.profile?.id}
            onClick={() => handleShow(group?.profile?.id)}
            className='mb-4 cursor-pointer rounded-xl border border-gray-200 bg-white shadow-sm transition last:mb-0 hover:shadow-md'
          >
            <div className='flex rounded-t-xl border-b border-gray-200 bg-slate-50 px-4 py-2.5'>
              <div>
                <NormalText className='text-base font-semibold text-slate-900'>
                  {group?.profile?.parameter_value}
                </NormalText>

                <div className='flex items-center gap-1'>
                  <p className='text-sm text-gray-500'>{group?.profile?.parameter_code}</p>
                  <div className='flex items-center gap-1'>
                    <span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700'>
                      Parameters : {group.parameters.length}
                    </span>
                  </div>
                </div>
                <div className='mt-2'>
                  <NormalText>{group?.profile?.notes}</NormalText>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Profiles with NO parameter values */}
        {profilesWithNoParameterValue.map((profile) => (
          <div
            key={profile?.id}
            onClick={() => handleShow(profile?.id)}
            className='cursor-pointer rounded-md border border-gray-200 bg-white px-4 py-3 transition hover:border-slate-300'
          >
            <NormalText className='text-base font-semibold text-slate-900'>
              {profile?.parameter_value}
            </NormalText>

            <div className='flex items-center gap-1'>
              <p className='mt-1 text-sm text-slate-600'>Parameters:</p>{' '}
              <StrongText className='text-sm text-slate-900'>0</StrongText>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {!meterProfileParameters.length && !profilesWithNoParameterValue.length && (
          <div className='p-6 text-center text-slate-500'>No profile parameters found.</div>
        )}
      </div>

      {/* Delete Modal */}
      {selectedItem && showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title='Delete Meter Profile Parameter'
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

export default MeterProfileParameterList
