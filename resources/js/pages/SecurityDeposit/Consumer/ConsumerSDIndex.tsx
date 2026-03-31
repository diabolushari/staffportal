import { billingNavItems } from '@/components/Navbar/navitems'
import ConsumerSDIndexSearch from '@/components/SecurityDeposit/Consumer/ConsumerSDIndexSearch'
import SdAssessModal from '@/components/SecurityDeposit/SdAssessModal'
import { getAssessmentYear } from '@/components/SecurityDeposit/SdRegister/LastAssessmentCard'
import { Button } from '@/components/ui/button'
import IconSingleTab from '@/components/ui/icon-single-tab'
import { Connection } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import CheckBox from '@/ui/form/CheckBox'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'
import { getDisplayDate } from '@/utils'
import { User, Users } from 'lucide-react'
import { useState } from 'react'

interface Props {
  connections: Paginator<Connection>
  oldConnections?: Connection
  triggerTypes: ParameterValues[]
}
const Tabs = [
  {
    value: 'individual',
    label: 'Individual',
    icon: <User />,
    href: '/consumer-sd',
  },
  {
    value: 'group',
    label: 'Group',
    icon: <Users />,
    href: '/consumer-sd/group',
  },
]
const ConsumerSDIndex = ({ connections, oldConnections, triggerTypes }: Props) => {
  const breadCrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Security Deposit',
      href: '/consumer-sd',
    },
    {
      title: 'Consumer SD',
      href: '#',
    },
  ]

  const [selectAll, setSelectAll] = useState<boolean>(false)
  const [selectedConnections, setSelectedConnections] = useState<number[]>([])

  const handleSelectAllToggle = () => {
    if (selectAll) {
      setSelectedConnections([])
      setSelectAll(false)
    } else {
      const allIds = connections.data.map((c) => c.connection_id)
      setSelectedConnections(allIds)
      setSelectAll(true)
    }
  }

  const handleSingleSelect = (connectionId: number) => {
    let updatedSelection: number[] = []
    if (selectedConnections.includes(connectionId)) {
      updatedSelection = selectedConnections.filter((id) => id !== connectionId)
    } else {
      updatedSelection = [...selectedConnections, connectionId]
    }
    setSelectedConnections(updatedSelection)
    setSelectAll(updatedSelection.length === connections.data.length)
  }
  const [showAssessModal, setShowAssessModal] = useState<boolean>(false)

  const handleAssessSelected = () => {
    if (selectedConnections.length === 0) return
    setShowAssessModal(true)
  }
  console.log(connections)
  return (
    <MainLayout
      breadcrumb={breadCrumbs}
      title='Consumers'
      description='Manage & Search Consumers for security deposit assessment'
      navItems={billingNavItems}
      selectedItem='Consumers'
      selectedTopNav='Billing'
    >
      <IconSingleTab
        tabs={Tabs}
        defaultValue='individual'
      />
      <div className='ml-auto'>
        <Button
          variant='default'
          onClick={handleAssessSelected}
        >
          Assess Selected
        </Button>
      </div>
      <ConsumerSDIndexSearch oldConnections={oldConnections} />
      {connections.data.length > 0 && (
        <>
          <div className='mt-6 flex items-center justify-between p-2'>
            <h2 className='text-xl font-semibold'></h2>

            <CheckBox
              label='Select All'
              toggleValue={handleSelectAllToggle}
              value={selectAll}
            />
          </div>
          <div className='flex flex-col gap-3'>
            {connections.data.map((connection) => (
              <div
                key={connection.connection_id}
                className='border-kseb-line mb-4 w-full border bg-white shadow-sm'
              >
                <div className='flex items-start justify-between p-4'>
                  <div className='flex flex-col gap-1 text-sm'>
                    <span className='font-semibold'>
                      {connection.consumer_profiles?.[0]?.consumer_name}
                    </span>
                    <span>Consumer Number: {connection.consumer_number}</span>
                    <span>Legacy Code: {connection.consumer_legacy_code}</span>
                  </div>

                  <span className='rounded bg-gray-200 px-3 py-1 text-xs font-medium'>
                    {connection.billing_group?.name}
                  </span>
                </div>

                <div className='bg-kseb-bg-blue grid grid-cols-4 items-center px-4 py-3 text-sm'>
                  <div className='flex flex-col'>
                    <span className='text-gray-600'>SD Assessed</span>
                    <span className='font-semibold'>
                      {connection?.sd_balance_summary?.[0]?.sd_principal_required
                        ? `₹ ${connection.sd_balance_summary[0].sd_principal_required}`
                        : '-'}
                    </span>
                  </div>

                  <div className='flex flex-col'>
                    <span className='text-gray-600'>SD Available</span>
                    <span className='font-semibold'>
                      {connection?.sd_balance_summary?.[0]?.sd_principal_on_file
                        ? `₹ ${connection.sd_balance_summary[0].sd_principal_on_file}`
                        : '-'}
                    </span>
                  </div>

                  <div className='flex flex-col'>
                    <span className='text-gray-600'>Difference</span>
                    <span
                      className={`font-semibold ${Number(connection?.sd_balance_summary?.[0]?.sd_principal_variance) < 0 ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {/* {connection?.sd_balance_summary?.[0]?.sd_principal_variance
                        ? `₹ ${Math.abs(Number(connection.sd_balance_summary[0].sd_principal_variance))}`
                        : '-'} */}
                      {connection?.sd_balance_summary?.[0]?.sd_principal_variance
                        ? `₹ ${connection.sd_balance_summary[0].sd_principal_variance}`
                        : '-'}
                    </span>
                  </div>

                  <div className='flex justify-end'>
                    <CheckBox
                      label=''
                      toggleValue={() => handleSingleSelect(connection.connection_id)}
                      value={selectedConnections.includes(connection.connection_id)}
                    />
                  </div>
                </div>

                <div className='flex gap-12 p-4 text-sm'>
                  <div className='flex flex-col'>
                    <span className='text-gray-600'>Assessment Period</span>
                    <span>
                      {connection.latest_sd_register
                        ? getAssessmentYear(connection.latest_sd_register)
                        : '-'}
                    </span>
                  </div>

                  <div className='flex flex-col'>
                    <span className='text-gray-600'>Assessment Date</span>
                    <span>
                      {connection.latest_sd_register
                        ? getDisplayDate(connection.latest_sd_register.generated_date)
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {showAssessModal && selectedConnections?.length > 0 && (
        <SdAssessModal
          setShowModal={setShowAssessModal}
          connection_ids={selectedConnections}
          triggerTypes={triggerTypes}
          redirect='individual'
        />
      )}
      <Pagination pagination={connections} />
    </MainLayout>
  )
}

export default ConsumerSDIndex
