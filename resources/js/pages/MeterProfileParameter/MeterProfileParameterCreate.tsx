import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { MeterProfileParameter } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'

interface Props {
  profiles: ParameterValues[]
  meterProfileParameter?: MeterProfileParameter
  profileId?: string
  profileParameters: ParameterValues[]
}

const MeterProfileParameterCreate = ({
  profileId,
  meterProfileParameter,
  profiles,
  profileParameters,
}: Props) => {
  const selectedProfile = profiles.find((profile) => profile.id === Number(profileId))

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
    {
      title: selectedProfile?.parameter_value || ' ',
      href: `/meter-profile/${selectedProfile?.id}`,
    },
    {
      title: meterProfileParameter ? 'Edit' : 'Create',
      href: meterProfileParameter
        ? `/meter-profile/edit/${meterProfileParameter.id}`
        : '/meter-profile/create',
    },
  ]
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    profile_id: meterProfileParameter?.profile_id || profileId || '',
    name: meterProfileParameter?.name || '',
    display_name: meterProfileParameter?.display_name || '',
    is_export: meterProfileParameter?.is_export ?? false,
    is_cumulative: meterProfileParameter?.is_cumulative ?? false,
    _method: meterProfileParameter ? 'PUT' : undefined,
  })

  console.log(formData)

  const { post, loading, errors } = useInertiaPost<typeof formData>(
    meterProfileParameter
      ? route('meter-profile.update', meterProfileParameter.meter_parameter_id)
      : route('meter-profile.store')
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    meterProfileParameter ? post({ ...formData, _method: 'PUT' }) : post(formData)
  }

  return (
    <MainLayout
      title={
        meterProfileParameter ? 'Edit Meter Profile Parameter' : 'Create Meter Profile Parameter'
      }
      navItems={meteringBillingNavItems}
      selectedItem='Metering Profiles'
      breadcrumb={breadcrumbs}
    >
      <div>
        <form
          onSubmit={handleSubmit}
          className='space-y-8 p-4'
        >
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <SelectList
              label='Measured Parameter'
              required
              value={formData.name}
              setValue={setFormValue('name')}
              error={errors.name}
              list={profileParameters}
              dataKey='parameter_value'
              displayKey='parameter_value'
            />
            <div className='flex gap-5 p-3'>
              <CheckBox
                label='Is Export'
                value={formData.is_export}
                toggleValue={toggleBoolean('is_export')}
              />

              <CheckBox
                label='Is Cumulative'
                value={formData.is_cumulative}
                toggleValue={toggleBoolean('is_cumulative')}
              />
            </div>

            <Input
              label='Display Name'
              required
              value={formData.display_name}
              setValue={setFormValue('display_name')}
              error={errors.display_name}
            />
          </div>

          <div className='flex items-center pt-4'>
            <Button
              label='Submit'
              type='submit'
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </MainLayout>
  )
}

export default MeterProfileParameterCreate
