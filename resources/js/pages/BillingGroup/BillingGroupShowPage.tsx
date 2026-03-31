import BillInitializeModal from '@/components/Billing/BillingGroup/BillInitializeModal'
import { billingNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import useCustomForm from '@/hooks/useCustomForm'
import {
  BillGenerationJobStatus,
  BillingGroup,
  BillingGroupConnection,
} from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import Button from '@/ui/button/Button'
import DeleteButton from '@/ui/button/DeleteButton'
import CheckBox from '@/ui/form/CheckBox'
import Input from '@/ui/form/Input'
import MonthPicker from '@/ui/form/MonthPicker'
import { formatMeterReadingMonth } from '@/utils'
import { router } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'
import BillingGroupAddConnection from './BillingGroupAddConnection'
import dayjs from 'dayjs'

export interface BillingGroupConnectionRelForm {
  billing_group_id: number
  connection_id: number
  status: string
}

export interface PageProps {
  billingGroup: BillingGroup
  billingGenerateJobStatus: BillGenerationJobStatus[]
}

export default function BillingGroupShowPage({ billingGroup }: Readonly<PageProps>) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    { title: 'Billing Groups', href: route('billing-groups.index') },
    {
      title: `Group ${billingGroup?.name}`,
      href: '#',
    },
  ]

  const [deleteConnection, setDeleteConnection] = useState<boolean>(false)
  const [deleteConnectionItem, setDeleteConnectionItem] = useState<BillingGroupConnection | null>(
    null
  )
  const [showInitializeModal, setShowInitializeModal] = useState(false)
  const [addConnectionComponent, setAddConnectionComponent] = useState(false)

  const { formData, setFormValue } = useCustomForm({
    search: '',
    bill_year_month: '',
    selectedConnections: [],
    oldestReadingDate: '',
  })
  const handleSearchClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleDelete = (connectionMapping: BillingGroupConnection) => {
    setDeleteConnectionItem(connectionMapping)
    setDeleteConnection(true)
  }
  const handleBillInitialize = () => {
    setShowInitializeModal(true)
  }
  const handleSelectConnection = (connectionId: number, latestReadingDate?: string) => {
    const updatedSelectedConnections = formData.selectedConnections.includes(connectionId)
      ? formData.selectedConnections.filter((id) => id !== connectionId)
      : [...formData.selectedConnections, connectionId]

    setFormValue('selectedConnections')(updatedSelectedConnections)

    setSelectAll(updatedSelectedConnections.length === connection_ids.length)

    if (latestReadingDate) {
      const readingDate = dayjs(latestReadingDate).format('YYYY-MM')
      const currentReadingDate = formData.oldestReadingDate
        ? dayjs(formData.oldestReadingDate).format('YYYY-MM')
        : readingDate

      if (readingDate <= currentReadingDate) {
        setFormValue('oldestReadingDate')(latestReadingDate.toString())
      }
    }
  }
  const getOldestReadingDate = (connections: BillingGroupConnection[]) => {
    const dates = connections
      .map((c) => c?.connection?.latest_meter_reading?.reading_end_date)
      .filter(Boolean)

    if (dates.length === 0) return ''

    return dates.reduce((oldest, current) =>
      dayjs(current).isBefore(dayjs(oldest)) ? current : oldest
    )
  }

  const handleOnClickConnection = (connectionId: number) => {
    router.get(
      route('connection.meter-reading', {
        id: connectionId,
      })
    )
  }

  const [selectAll, setSelectAll] = useState<boolean>(false)

  const connection_ids = useMemo<number[]>(
    () => billingGroup?.connections?.map((c) => c.connection_id) || [],
    [billingGroup?.connections]
  )

  const handleSelectAllToggle = () => {
    if (selectAll) {
      setFormValue('selectedConnections')([])
      setFormValue('oldestReadingDate')('')
      setSelectAll(false)
    } else {
      setFormValue('selectedConnections')(connection_ids)

      const oldestDate = getOldestReadingDate(billingGroup.connections)
      if (oldestDate) {
        setFormValue('oldestReadingDate')(oldestDate)
      }

      setSelectAll(true)
    }
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      selectedTopNav='Billing'
      selectedItem='Billing Groups'
      navItems={billingNavItems}
      title={billingGroup?.name ?? ''}
      description={
        <>
          <span>Billing group of {'  '}</span>
          <span className='font-semibold'>{billingGroup?.name}</span>
        </>
      }
    >
      <div className='flex justify-end gap-2'>
        <Button
          variant={addConnectionComponent ? 'secondary' : 'tertiary'}
          label={addConnectionComponent ? 'Close' : 'Add Member'}
          onClick={() => setAddConnectionComponent(!addConnectionComponent)}
        />
      </div>
      {addConnectionComponent && <BillingGroupAddConnection billingGroup={billingGroup} />}

      {!addConnectionComponent && (
        <div className='grid grid-cols-2 gap-4'>
          <form
            onSubmit={handleSearchClick}
            className='flex gap-4'
          >
            <div className='flex gap-4'>
              <Input
                label='Consumer Number/Name'
                value={formData.search}
                setValue={setFormValue('search')}
              />
              <MonthPicker
                label='Bill Year Month'
                value={formData.bill_year_month}
                setValue={setFormValue('bill_year_month')}
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
          <div className='mt-6 flex justify-end gap-2'>
            <div>
              <Button
                onClick={handleBillInitialize}
                label='Initialize Bill'
              />
            </div>
          </div>
        </div>
      )}
      {billingGroup?.connections && billingGroup?.connections?.length > 0 && (
        <div className=''>
          <div className='mt-6 flex items-center justify-between p-2'>
            <h2 className='text-xl font-semibold'>Connected Consumers</h2>

            <CheckBox
              label='Select All'
              toggleValue={handleSelectAllToggle}
              value={selectAll}
            />
          </div>

          {billingGroup?.connections?.map((conn: BillingGroupConnection) => (
            <div
              key={conn.connection_id}
              className='mb-4 rounded-xl border bg-white p-4 shadow-sm'
            >
              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col gap-4'>
                  <Card
                    className='grid cursor-pointer grid-cols-2 justify-between gap-4 p-4 transition-all duration-150 ease-in-out hover:scale-101'
                    onClick={() => handleOnClickConnection(conn?.connection_id)}
                  >
                    <div>
                      <span className='context-menu-item'>Consumer Number</span>
                      <p className='ghost-button-text'>{conn?.connection?.consumer_number}</p>
                    </div>

                    <div>
                      <span className='context-menu-item'>Type</span>
                      <p className='ghost-button-text'>
                        {conn?.connection?.connection_type?.parameter_value}
                      </p>
                    </div>

                    <div>
                      <span className='context-menu-item'>Name</span>
                      <p className='ghost-button-text'>
                        {conn?.connection?.consumer_profiles?.[0]?.organization_name ?? '-'}
                      </p>
                    </div>

                    <div>
                      <span className='context-menu-item'>Purpose</span>
                      <p className='ghost-button-text'>
                        {conn?.connection?.primary_purpose?.parameter_value}
                      </p>
                    </div>
                  </Card>
                  <Card>
                    <div>
                      <span className='context-menu-item'>Latest Meter Reading</span>
                      <p className='ghost-button-text'>
                        {formatMeterReadingMonth(
                          conn?.connection?.latest_meter_reading?.reading_start_date,
                          conn?.connection?.latest_meter_reading?.reading_end_date
                        )}
                      </p>
                    </div>
                  </Card>
                </div>
                <div className='flex items-center justify-end gap-6'>
                  <DeleteButton onClick={() => handleDelete(conn)} />
                  <CheckBox
                    label=''
                    toggleValue={() =>
                      handleSelectConnection(
                        conn?.connection_id,
                        conn?.connection?.latest_meter_reading?.reading_end_date
                      )
                    }
                    value={formData.selectedConnections.includes(conn.connection_id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* {billingGenerateJobStatus?.length > 0 && (
        <BillingJobList
          isGroupNameVisible={false}
          billGenerationJobStatus={billingGenerateJobStatus}
        />
      )} */}
      {deleteConnection && deleteConnectionItem && (
        <DeleteModal
          setShowModal={setDeleteConnection}
          url={route('billing-group-connection-rel.destroy', deleteConnectionItem?.version_id)}
          title={`Delete connection ${deleteConnectionItem?.connection?.consumer_number} from the billing group ${billingGroup?.name}`}
        />
      )}
      {showInitializeModal && (
        <BillInitializeModal
          readingMonthYear={formData.oldestReadingDate}
          setShowModal={setShowInitializeModal}
          showModal={showInitializeModal}
          selectedConnections={formData.selectedConnections}
          billingGroup={billingGroup}
        />
      )}
    </MainLayout>
  )
}
