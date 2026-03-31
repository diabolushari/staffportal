import MeterProfileParameterList from '@/components/MeterProfileParameter/MeterProfileParameterList'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import ParameterValueModal from '@/components/Parameter/ParameterValue/ParameterValueModal'
import { MeterProfileGroupByProfile } from '@/interfaces/data_interfaces'
import { ParameterDefinition, ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Pagination from '@/ui/Pagination/Pagination'
import ListSearch from '@/ui/Search/ListSearch'
import { Paginator } from '@/ui/ui_interfaces'
import { useState } from 'react'

interface Props {
  oldSearch: string
  meterProfileParameters: Paginator<MeterProfileGroupByProfile>
  definition: ParameterDefinition
  profilesWithNoParameterValue: ParameterValues[]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Settings',
    href: '/settings-page',
  },
  {
    title: 'Metering Profile',
    href: '/meter-profile',
  },
]

const MeterProfileParameterIndex = ({
  oldSearch,
  meterProfileParameters,
  definition,
  profilesWithNoParameterValue,
}: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <MainLayout
      navItems={meteringBillingNavItems}
      selectedItem='Metering Profiles'
      addBtnText='Metering Profile'
      addBtnClick={() => setShowModal(true)}
      title='Metering Profiles'
      breadcrumb={breadcrumbs}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <ListSearch
          title=''
          placeholder='Search'
          url={route('meter-profile.index')}
          search={oldSearch}
        />

        {meterProfileParameters && (
          <>
            <MeterProfileParameterList
              meterProfileParameters={meterProfileParameters?.data}
              profilesWithNoParameterValue={profilesWithNoParameterValue}
            />
            <Pagination
              pagination={meterProfileParameters}
              filters={{ search: oldSearch }}
            />
          </>
        )}
        {showModal && (
          <ParameterValueModal
            onClose={() => setShowModal(false)}
            definition={definition}
            title='Add Metering Profile'
            codeLabel='Code'
            valueLabel='Name'
            descriptionLabel='Description'
          />
        )}
      </div>
    </MainLayout>
  )
}

export default MeterProfileParameterIndex
