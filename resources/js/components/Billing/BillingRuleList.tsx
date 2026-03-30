import { BillingRule } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import DeleteButton from '@/ui/button/DeleteButton'
import EditButton from '@/ui/button/EditButton'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { router } from '@inertiajs/react'
import { Building, CalendarDaysIcon } from 'lucide-react'
import { useState } from 'react'

interface Props {
  billingRules: BillingRule[]
}

export default function BillingRuleList({ billingRules }: Props) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedBillingRule, setSelectedBillingRule] = useState<BillingRule | null>(null)

  const handleDownloadJson = (rule: BillingRule) => {
    const dataStr = JSON.stringify(rule, null, 2) // pretty print
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${rule.name ?? 'billing_rule'}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!billingRules || billingRules.length === 0) {
    return (
      <div className='flex h-full items-center justify-center text-gray-500'>
        No Billing Rules Found
      </div>
    )
  }
  const handleDeleteClick = (billingRule: BillingRule) => {
    setSelectedBillingRule(billingRule)
    setDeleteModalOpen(true)
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='font-inter text-dark-gray px-7 pt-[21px] pb-3 text-[15px] leading-[23px] font-semibold tracking-[-0.0924px]'>
        Billing Rule Info
      </div>
      <div className='flex flex-col px-7 pb-7'>
        {billingRules?.map((billingRule, index) => (
          <div
            key={billingRule.id ?? index} // unique key fallback
            className='cursor-pointer rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md'
            onClick={() => router.get(route('billing-rules.show', billingRule?.id))}
          >
            <div className='flex items-start justify-between'>
              <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <div className='font-inter cursor-pointer text-base leading-normal font-semibold text-black underline'>
                      {billingRule?.name ?? '-'}
                    </div>
                  </div>

                  <div className='flex w-full items-center gap-5'>
                    <div className='flex items-center gap-[3px]'>
                      <Building className='text-dark-gray h-3.5 w-3.5' />
                    </div>

                    <CalendarDaysIcon className='text-dark-gray h-3.5 w-3.5' />
                    <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                      {billingRule?.effective_start ?? '-'}
                    </div>
                    <div
                      className='flex items-center gap-[3px]'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant='link'
                        label='Download'
                        onClick={() => handleDownloadJson(billingRule)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                <div
                  className='flex flex-row gap-2'
                  onClick={(e) => e.stopPropagation()}
                >
                  <EditButton link={route('billing-rules.edit', billingRule?.id)} />
                  <DeleteButton onClick={() => handleDeleteClick(billingRule)} />
                </div>
                <div
                  className={`rounded-[50px] px-2.5 py-px ${
                    billingRule?.deleted_at ? 'bg-red-100' : 'bg-green-100'
                  }`}
                >
                  <div
                    className={`font-inter text-xs leading-6 font-normal tracking-[-0.072px] ${
                      billingRule?.deleted_at ? 'text-red-800' : 'text-deep-green'
                    }`}
                  >
                    {billingRule?.deleted_at ? 'Inactive' : 'Active'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {deleteModalOpen && (
        <DeleteModal
          setShowModal={setDeleteModalOpen}
          title='Delete Billing Rule'
          url={route('billing-rules.destroy', selectedBillingRule?.id)}
        />
      )}
    </div>
  )
}
