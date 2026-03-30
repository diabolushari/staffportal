import { billingNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import useCustomForm from '@/hooks/useCustomForm'
import { Bill, BillGenerationJob } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import { cn, getDisplayDate, getDisplayMonthYear } from '@/utils'

interface Props {
  data: BillGenerationJob
}

export default function BillJobStatusShowPage({ data }: Props) {
  const { formData, setFormValue } = useCustomForm({
    search: '',
  })

  const handleSearchClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }
  const handleViewBillClick = (bill: Bill) => {
    window.open(route('bills.show', bill?.bill_id), '_blank')
  }

  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Billing Jobs',
      href: '/bills/job-status',
    },
  ]
  const billJobStatuses = data.bill_generation_job_status ?? []

  const bills = {
    bills: billJobStatuses
      .filter((item) => item.bill !== null)
      .map((item) => ({
        ...item.bill,
        connection: item.connection,
      })),

    exceptions: billJobStatuses
      .filter((item) => item.bill === null)
      .map((item) => ({
        connection: item.connection,
        exception: item.exception,
        reading_year_month: data.reading_year_month,
        bill_year_month: data.bill_year_month,
        initialized_date: data.initialized_date,
        bill_job_generation_status_id: item.connection_id,
      })),
  }

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={billingNavItems}
      title={`Bill Cycle List for  December 2025`}
      selectedItem='Jobs'
      selectedTopNav='Billing'
    >
      <div className='flex flex-col gap-4 p-4'>
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
                variant='secondary'
              />
            </div>
          </form>
        </div>
        {bills?.bills?.length > 0 &&
          bills?.bills?.map((bill) => (
            <Card
              className='mb-6 overflow-hidden rounded-lg border p-0 shadow-sm'
              key={bill?.bill_id}
            >
              {/* Top Gray Header */}
              <div className='grid grid-cols-2 gap-4 bg-gray-200 px-6 py-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='context-menu-item py-2'>Name 123</p>
                    <p className='ghost-button-text'>
                      {bill?.connection?.consumer_profiles?.[0]?.organization_name ?? '-'}
                    </p>
                  </div>

                  <div>
                    <p className='context-menu-item py-2'>Bill Amount</p>
                    <p className='ghost-button-text'>{Number(bill?.bill_amount).toFixed(2)}</p>
                  </div>

                  <div>
                    <p className='context-menu-item py-2'>Consumer Number</p>
                    <p className='ghost-button-text'>{bill?.connection?.consumer_number}</p>
                  </div>
                  <div>
                    <p className='context-menu-item py-2'>Type</p>
                    <p className='ghost-button-text'>
                      {bill?.connection?.connection_type?.parameter_value}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body Section */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='grid grid-cols-2 gap-y-4 px-6 py-5'>
                  <div>
                    <p className='context-menu-item py-2'>Bill Month & Year</p>
                    <p className='ghost-button-text'>
                      {getDisplayMonthYear(bill?.bill_year_month)}
                    </p>
                  </div>

                  <div>
                    <p className='context-menu-item py-2'>Reading Month & Year</p>
                    <p className='ghost-button-text col-span-2'>
                      {getDisplayMonthYear(bill?.reading_year_month)}
                    </p>
                  </div>
                  <div>
                    <p className='context-menu-item py-2'>Bill Date</p>
                    <p className='ghost-button-text'>{getDisplayDate(bill?.bill_date)}</p>
                  </div>

                  <div>
                    <p className='context-menu-item py-2'>Due Date</p>
                    <p className='ghost-button-text'>{getDisplayDate(bill?.due_date)}</p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-y-4 py-5'>
                  <div className='flex flex-col gap-4'>
                    <div>
                      <p className='context-menu-item py-2'>DC Date</p>
                      <p className='ghost-button-text'>{getDisplayDate(bill?.dc_date)}</p>
                    </div>
                    <div>
                      {bill?.remarks && (
                        <>
                          <p className='context-menu-item py-2'>Remarks</p>
                          <p className='ghost-button-text'>{bill?.remarks}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className='flex justify-end border-t px-6 py-4'>
                <a
                  className={cn(
                    'lgButtonText flex items-center justify-center px-10 py-2 tracking-wider capitalize transition duration-150' +
                      ' ease-in-out focus:ring-4 focus:outline-hidden',
                    'bg-kseb-primary primary-button-text rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors'
                  )}
                  href={route('bills.show', bill?.bill_id)}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  View Bill
                </a>
              </div>
            </Card>
          ))}
        {/* ================= EXCEPTIONS SECTION ================= */}
        {bills?.exceptions?.length > 0 && (
          <div className='mt-8'>
            <h2 className='mb-4 text-lg font-semibold'>
              Billing Exceptions ({bills.exceptions.length})
            </h2>

            <div className='flex flex-col gap-4'>
              {bills.exceptions.map((ex) => (
                <Card
                  key={ex.bill_job_generation_status_id}
                  className='border border-red-200'
                >
                  {/* Header */}
                  <div className='grid grid-cols-3 gap-4 px-6 py-3'>
                    <div>
                      <p className='context-menu-item py-2'>Consumer Number</p>
                      <p className='ghost-button-text'>{ex.connection?.consumer_number}</p>
                    </div>

                    <div>
                      <p className='context-menu-item py-2'>Consumer Name</p>
                      <p className='ghost-button-text'>
                        {ex.connection?.consumer_profiles?.[0]?.organization_name}
                      </p>
                    </div>

                    <div>
                      <p className='font-medium text-red-700'>Exception</p>
                      <p className='ghost-button-text'>{ex?.exception}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className='grid grid-cols-3 gap-4 px-6 py-4'>
                    <div>
                      <p className='context-menu-item py-2'>Reading Month</p>
                      <p className='ghost-button-text'>
                        {getDisplayMonthYear(ex.reading_year_month)}
                      </p>
                    </div>

                    <div>
                      <p className='context-menu-item py-2'>Bill Month</p>
                      <p className='ghost-button-text'>{getDisplayMonthYear(ex.bill_year_month)}</p>
                    </div>

                    <div>
                      <p className='context-menu-item py-2'>Initialized Date</p>
                      <p className='ghost-button-text'>{getDisplayDate(ex.initialized_date)}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className='border-t px-6 py-3'>
                    <p className='text-sm text-red-700'>
                      ⚠ Bill not generated for this connection
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
