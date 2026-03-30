import ActionButton from '@/components/action-button'
import { BillingGroup } from '@/interfaces/data_interfaces'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { router } from '@inertiajs/react'
import { useState } from 'react'

interface Props {
  billingGroups: BillingGroup[]
  listOnSD?: boolean
}

export default function BillingGroupList({ billingGroups, listOnSD = false }: Props) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedBillingGroup, setSelectedBillingGroup] = useState<BillingGroup | null>(null)

  if (!billingGroups || billingGroups.length === 0) {
    return (
      <div className='flex h-full items-center justify-center text-gray-500'>
        No Billing Groups Found
      </div>
    )
  }
  const handleDeleteClick = (billingGroup: BillingGroup) => {
    setSelectedBillingGroup(billingGroup)
    setDeleteModalOpen(true)
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {billingGroups?.map((billingGroup, index) => (
          <div
            key={billingGroup?.billing_group_id ?? index}
            className='mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
            onClick={() =>
              router.get(
                listOnSD
                  ? route('consumer-sd.group.show', {
                      id: billingGroup?.billing_group_id,
                    })
                  : route('billing-groups.show', {
                      id: billingGroup?.billing_group_id,
                    })
              )
            }
          >
            <div className='flex items-start justify-between'>
              <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <div className='font-inter cursor-pointer text-base leading-normal font-semibold text-black'>
                      {billingGroup?.name ?? 'Unnamed Group'}
                    </div>
                  </div>

                  <div className='font-inter text-sm leading-[20px] text-gray-600'>
                    {billingGroup?.description}
                  </div>
                  <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                    Connection Count: <b>{billingGroup?.connection_count}</b>
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                <div
                  className={`rounded-[50px] px-2.5 py-px ${
                    billingGroup?.deleted_at ? 'bg-red-100' : 'bg-green-100'
                  }`}
                >
                  <div
                    className={`font-inter text-xs leading-6 font-normal tracking-[-0.072px] ${
                      billingGroup?.deleted_at ? 'text-red-800' : 'text-deep-green'
                    }`}
                  >
                    {billingGroup?.deleted_at ? 'Inactive' : 'Active'}
                  </div>
                </div>
                <ActionButton
                  onEdit={() =>
                    router.get(
                      route('billing-groups.edit', {
                        versionId: billingGroup?.version_id,
                        id: billingGroup?.billing_group_id,
                      })
                    )
                  }
                  onDelete={() => handleDeleteClick(billingGroup)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {deleteModalOpen && (
        <DeleteModal
          setShowModal={setDeleteModalOpen}
          title='Delete Billing Group'
          url={route('billing-groups.destroy', {
            versionId: selectedBillingGroup?.version_id,
            id: selectedBillingGroup?.billing_group_id,
          })}
        >
          <span>
            Are you sure to delete <b>{selectedBillingGroup?.name}</b>?
          </span>
        </DeleteModal>
      )}
    </div>
  )
}
