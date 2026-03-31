import { billingNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import useCustomForm from '@/hooks/useCustomForm'
import { Bill, BillingGroup } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import { getDisplayDate, getDisplayMonthYear } from '@/utils'
import { router } from '@inertiajs/react'

interface Props {
  bills: Bill[]
  billing_group: BillingGroup
}

export default function BillingGroupBillPage({ bills, billing_group }: Props) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Billing Groups',
      href: '/billing-groups',
    },
    {
      title: 'Billing Group Bills',
      href: '/billing-groups/bills',
    },
  ]
  const { formData, setFormValue } = useCustomForm({
    search: '',
  })

  const handleSearchClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formData)
  }
  const handleViewBillClick = (bill: Bill) => {
    router.get(route('bills.show', bill?.bill_id))
  }
  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={billingNavItems}
      title={`Bill Cycle List for ${billing_group.name}, December 2025`}
    >
      <div className='grid grid-cols-2 gap-4'>
        <form
          onSubmit={handleSearchClick}
          className='flex gap-4'
        >
          <div>
            <Input
              label='Consumer Number/Name/Type/Purpose'
              value={formData.search}
              setValue={setFormValue('search')}
            />
          </div>

          <div className='mt-6'>
            <Button
              label='Search'
              type='submit'
            />
          </div>
        </form>
        <div className='mt-6 flex justify-end gap-2'>
          <div>
            <Button
              onClick={() => {}}
              label='Go'
            />
          </div>
        </div>
      </div>
      {bills.length > 0 &&
        bills.map((bill: Bill) => (
          <Card className='mb-6 overflow-hidden rounded-lg border p-0 shadow-sm'>
            {/* Top Gray Header */}
            <div className='grid grid-cols-2 gap-4 bg-gray-200 px-6 py-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='font-medium text-gray-700'>{bill?.connection_id}</p>
                  <p className='text-xs text-gray-500'>Name</p>
                </div>

                <div>
                  <p className='font-medium text-gray-700'>
                    {Number(bill?.bill_amount).toFixed(2)}
                  </p>
                  <p className='text-xs text-gray-500'>Bill Amount</p>
                </div>

                <div>
                  <p className='font-medium text-gray-700'>{bill?.connection_id}</p>
                  <p className='text-xs text-gray-500'>Consumer Number</p>
                </div>
                <div>
                  <p className='font-medium text-gray-700'>{bill?.connection_id}</p>
                  <p className='text-xs text-gray-500'>Type</p>
                </div>
              </div>
            </div>

            {/* Body Section */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid grid-cols-2 gap-y-4 px-6 py-5'>
                <div>
                  <p className='font-medium text-gray-700'>
                    {getDisplayMonthYear(bill?.bill_year_month)}
                  </p>
                  <p className='text-xs text-gray-500'>Bill Month & Year</p>
                </div>

                <div>
                  <p className='col-span-2 font-medium text-gray-700'>
                    {getDisplayMonthYear(bill?.reading_year_month)}
                  </p>
                  <p className='text-xs text-gray-500'>Reading Month & Year</p>
                </div>
                <div>
                  <p className='font-medium text-gray-700'>{getDisplayDate(bill?.bill_date)}</p>
                  <p className='text-xs text-gray-500'>Bill Date</p>
                </div>

                <div>
                  <p className='font-medium text-gray-700'>{getDisplayDate(bill.due_date)}</p>
                  <p className='text-xs text-gray-500'>Due Date</p>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-y-4 py-5'>
                <div className='flex flex-col gap-4'>
                  <div>
                    <p className='font-medium text-gray-700'>{getDisplayDate(bill?.dc_date)}</p>
                    <p className='text-xs text-gray-500'>DC Date</p>
                  </div>
                  <div>
                    <p className='font-medium text-gray-700'>{bill?.remarks}</p>
                    <p className='text-xs text-gray-500'>Remarks</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className='flex justify-end border-t px-6 py-4'>
              <Button
                label='View Bill'
                onClick={() => handleViewBillClick(bill)}
              />
            </div>
          </Card>
        ))}
    </MainLayout>
  )
}
