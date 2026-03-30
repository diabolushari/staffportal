import StrongText from '@/typography/StrongText'
import { useEffect, useState } from 'react'
import SdCollectionList from '../SdCollections/SdCollectionList'
import { SdDemand } from '@/interfaces/data_interfaces'
import DeleteModal from '@/ui/Modal/DeleteModal'

interface Props {
  sdDemands: SdDemand[]
}

const SdDemandList = ({ sdDemands }: Props) => {
  const [deleteItem, setDeleteItem] = useState<SdDemand | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  useEffect(() => {
    if (!showDeleteModal) {
      setDeleteItem(null)
    }
  }, [showDeleteModal])
  return (
    <div>
      <div className='relative w-full rounded-lg bg-white'>
        <div className='flex flex-col px-7 pb-7'>
          {sdDemands.map((sdDemand) => (
            <div
              key={sdDemand.sd_demand_id}
              className='mb-4 rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
            >
              <div className='flex items-start justify-between'>
                <div className='flex flex-1 cursor-pointer flex-col gap-2.5 p-[10px]'>
                  <div className='grid grid-cols-3 gap-x-6 gap-y-2'>
                    <div className='flex items-center gap-[3px]'>
                      <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                        Demand Type:{' '}
                        <StrongText> {sdDemand.demand_type.parameter_value}</StrongText>
                      </div>
                    </div>
                    {sdDemand.calculation_basic && (
                      <div className='flex items-center gap-[3px]'>
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          Calculation Basic:{' '}
                          <StrongText> {sdDemand.calculation_basic?.parameter_value}</StrongText>
                        </div>
                      </div>
                    )}
                    <div className='flex items-center gap-[3px]'>
                      <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                        Total SD Amount: <StrongText> {sdDemand.total_sd_amount}</StrongText>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-[3px]'>
                    <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                      Charge Head Definition:{' '}
                      <StrongText> {sdDemand.charge_head_definition.name}</StrongText>
                    </div>
                  </div>
                </div>

                {/* <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                  <div className='mt-2 flex items-center gap-3'>
                    <ActionButton
                      onDelete={() => {
                        setDeleteItem(sdDemand)
                        setShowDeleteModal(true)
                      }}
                      onEdit={() => router.get(route('sd-demands.edit', sdDemand.sd_demand_id))}
                    />
                  </div>
                </div> */}
              </div>
              {/* <div className='flex justify-end p-4'>
                <Button
                  variant='outline'
                  type='button'
                  onClick={() =>
                    router.get(
                      `/sd-collections/create?sdDemandId=${sdDemand.sd_demand_id}&connectionId=${connection.connection_id}`
                    )
                  }
                >
                  Add Collection
                </Button>
              </div> */}
              {sdDemand.collections && sdDemand.collections.length > 0 ? (
                <SdCollectionList sdCollections={sdDemand.collections} />
              ) : (
                <div className='flex justify-center gap-1'>
                  <span className='context-menu-item'>No Collections Added</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {showDeleteModal && deleteItem && (
          <DeleteModal
            title='Delete Security Deposit Demand'
            url={route('sd-demands.destroy', deleteItem?.sd_demand_id)}
            setShowModal={(showModal) => setShowDeleteModal(showModal)}
          >
            <span>
              Are you sure to delete the security deposit demand with consumer number{' '}
              <b>{deleteItem?.connection.consumer_number}</b>?
            </span>
          </DeleteModal>
        )}
      </div>
    </div>
  )
}

export default SdDemandList
