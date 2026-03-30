import ProfileParameterShowList from '@/components/MeterProfileParameter/ProfileParameterShowList'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import ParameterValueModal from '@/components/Parameter/ParameterValue/ParameterValueModal'
import { MeterProfileParameter } from '@/interfaces/data_interfaces'
import { ParameterDefinition, ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import AddButton from '@/ui/button/AddButton'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import { useState } from 'react'

interface Props {
  meterProfileParameter?: Paginator<MeterProfileParameter>
  profileId: number
  profile: ParameterValues
  definition: ParameterDefinition
}

const MeterProfileParameterShow = ({
  meterProfileParameter,
  profileId,
  profile,
  definition,
}: Props) => {
  const [profileEditModal, setProfileEditModal] = useState(false)

  const breadCrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Settings', href: '/settings-page' },
    { title: 'Meter Profile Parameters', href: '/meter-profile' },
    {
      title: `${profile?.parameter_value}`,
      href: '#',
    },
  ]

  const handleAdd = () => {
    router.get(route('meter-profile.create', { profileId }))
  }

  const handleEdit = () => {
    setProfileEditModal(true)
  }
  return (
    <MainLayout
      title={profile?.parameter_value}
      breadcrumb={breadCrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='Metering Profiles'
      editBtnClick={handleEdit}
    >
      <div className='p-4'>
        <div className='flex items-center justify-between p-4'>
          <div />
          <AddButton
            onClick={handleAdd}
            buttonText='Add Profile Parameter'
          />
        </div>

        {meterProfileParameter ? (
          <>
            <ProfileParameterShowList meterProfileParameters={meterProfileParameter.data} />
            <Pagination pagination={meterProfileParameter} />
          </>
        ) : (
          <div className='flex items-center justify-center'>
            No profile parameters are available. Please add a profile parameter to view the details.
          </div>
        )}
      </div>
      {profileEditModal && profile && (
        <ParameterValueModal
          parameterValue={profile}
          definition={definition}
          definitionId={profile.definition_id}
          onClose={() => setProfileEditModal(false)}
        />
      )}
    </MainLayout>
  )
}

export default MeterProfileParameterShow
