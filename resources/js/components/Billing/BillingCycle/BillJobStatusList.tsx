import { BillingGroup } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import { router } from '@inertiajs/react'
import { Building, CalendarDaysIcon } from 'lucide-react'

interface Props {
  billingGroups: BillingGroup[]
}

export default function BillingJobStatusList({ billingGroups }: Props) {
  if (!billingGroups || billingGroups.length === 0) {
    return (
      <div className='flex h-full items-center justify-center text-gray-500'>
        No Billing Groups Found
      </div>
    )
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='font-inter text-dark-gray px-7 pt-[21px] pb-3 text-[15px] leading-[23px] font-semibold tracking-[-0.0924px]'>
        Billing Group Info
      </div>
      <div className='flex flex-col px-7 pb-7'>
        {billingGroups.map((billingGroup, index) => (
          <div
            key={billingGroup.billing_group_id ?? index} // unique key fallback
            className='mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
          >
            <div className='flex items-start justify-between'>
              <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <div className='font-inter cursor-pointer text-base leading-normal font-semibold text-black underline'>
                      {billingGroup?.name ?? 'Unnamed Group'}
                    </div>
                    <div className='rounded-[50px] bg-blue-100 px-2.5 py-px'>
                      <div className='font-inter text-xs leading-6 font-normal tracking-[-0.072px] text-blue-800'>
                        {billingGroup?.billing_group_id ?? 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className='font-inter text-sm leading-[20px] text-gray-600'>
                    {billingGroup.description}
                  </div>

                  <div className='flex w-full items-center gap-5'>
                    <div className='flex items-center gap-[3px]'>
                      <Building className='text-dark-gray h-3.5 w-3.5' />
                    </div>

                    <CalendarDaysIcon className='text-dark-gray h-3.5 w-3.5' />
                    <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                      {billingGroup?.effective_start}
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                <div className='flex flex-row gap-2'>
                  <Button
                    variant='link'
                    label='View'
                    onClick={() =>
                      router.get(`/bills/job-status/${billingGroup?.billing_group_id}`)
                    }
                  />
                </div>
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
