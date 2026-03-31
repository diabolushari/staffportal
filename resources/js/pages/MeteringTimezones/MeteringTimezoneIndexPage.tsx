import ActionButton from '@/components/action-button'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import ParameterValueModal from '@/components/Parameter/ParameterValue/ParameterValueModal'
import { ParameterDefinition, ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import NormalText from '@/typography/NormalText'
import DeleteModal from '@/ui/Modal/DeleteModal'
import ListSearch from '@/ui/Search/ListSearch'
import { router } from '@inertiajs/react'
import { useState } from 'react'

interface TimezoneGroup {
  timezone_type: ParameterValues
  metering_timezones: MeteringTimezone[]
}

export interface MeteringTimezone {
  version_id: number
  metering_timezone_id: number
  pricing_type: { id: number; parameter_value: string }
  timezone_type: { id: number; parameter_value: string }
  timezone_name: { id: number; parameter_value: string }
  from_hrs: number
  from_mins: number
  to_hrs: number
  to_mins: number
  effective_start_ts: string
  effective_end_ts: string | null
  is_active: boolean
  created_ts: string
  updated_ts: string
  created_by: number
  updated_by: number | null
}

interface Props {
  timezones:
    | {
        data?: TimezoneGroup[]
      }
    | TimezoneGroup[]
  timezone_types: ParameterValues[]
  pricing_types: ParameterValues[]
  timezone_names: ParameterValues[]
  timezone_type_parameter: ParameterDefinition
  timezone_name_parameter: ParameterDefinition
  filter: {
    search: string
  }
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
    title: 'Timezone Groups',
    href: '/timezone-groups',
  },
]

export default function MeteringTimezonesIndexPage({
  timezones,
  timezone_types,
  timezone_type_parameter,
  filter,
}: Props) {
  console.log('timezones', timezones)
  console.log('timezone_types', timezone_types)
  console.log('timezone_type_parameter', timezone_type_parameter)
  console.log('filter', filter)

  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [selecedDefinition, setSelectedDefinition] = useState<ParameterDefinition | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [selectedParameterValue, setSelectedParameterValue] = useState<ParameterValues | null>(null)

  const timezonesData = Array.isArray(timezones) ? timezones : timezones?.data || []
  const [groups] = useState<TimezoneGroup[]>(timezonesData)

  const timezoneTypesWithoutTimezones = timezone_types.filter(
    (type) => !groups.some((group) => group.timezone_type.id === type.id)
  )

  const handleShow = (id: number) => {
    router.get(`/timezone-groups/${id}`)
  }

  const handleAdd = () => {
    setSelectedDefinition(timezone_type_parameter)
    setShowAddModal(true)
  }
  const handleDelete = (parameterValue: ParameterValues) => {
    setSelectedParameterValue(parameterValue)
    setDeleteModalOpen(true)
  }

  return (
    <MainLayout
      navItems={meteringBillingNavItems}
      selectedItem='Timezone Groups'
      selectedTopNav='Consumers'
      title='Timezone Groups'
      breadcrumb={breadcrumbs}
      addBtnText='Timezone Group'
      addBtnClick={handleAdd}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
        <ListSearch
          title=''
          placeholder='Enter timezone name'
          search={filter.search}
          filters={filter}
          url={`timezone-groups`}
        />

        <div className='relative w-full rounded-lg bg-white'>
          <div className='flex flex-col px-7 pb-7'>
            {groups && groups.length > 0 ? (
              groups.map((group) => (
                <div
                  key={group?.timezone_type?.id}
                  onClick={() => handleShow(group?.timezone_type?.id)}
                  className='mb-4 cursor-pointer rounded-xl border border-gray-200 bg-white shadow-sm transition last:mb-0 hover:shadow-md'
                >
                  {/* Header */}
                  <div className='flex rounded-t-xl border-b border-gray-200 bg-slate-50 px-4 py-2.5'>
                    <div className='flex flex-col gap-3'>
                      <span className='text-sm font-semibold text-slate-800'>
                        {group?.timezone_type?.parameter_value}
                      </span>
                      <span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700'>
                        {group?.metering_timezones?.length}{' '}
                        {group?.metering_timezones?.length > 1 ? 'Timezones' : 'Timezone'}
                      </span>
                      <div>
                        <NormalText>{group?.timezone_type?.notes}</NormalText>
                      </div>
                    </div>
                    <div className='flex cursor-pointer flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                      <ActionButton onDelete={() => handleDelete(group.timezone_type)} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='p-6 text-center text-slate-500'>
                <p>No metering timezones found.</p>
              </div>
            )}

            {/* Display timezone types without any metering timezones */}
            {timezoneTypesWithoutTimezones?.length > 0 && (
              <>
                {timezoneTypesWithoutTimezones?.map((type) => (
                  <div
                    key={type?.id}
                    className='mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
                    onClick={() => {
                      handleShow(type.id)
                    }}
                  >
                    <div className='font-inter border-b border-gray-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800'>
                      {type?.parameter_value}
                    </div>
                    <div className='flex cursor-pointer flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                      <ActionButton onDelete={() => handleDelete(type)} />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {showAddModal && selecedDefinition !== null && (
          <ParameterValueModal
            onClose={() => setShowAddModal(false)}
            definition={selecedDefinition}
            title='Time Zone Group'
            codeLabel='Code'
            valueLabel='Group Name'
          />
        )}
        {deleteModalOpen && (
          <DeleteModal
            setShowModal={setDeleteModalOpen}
            title='Delete Tariff Order'
            url={route('parameter-value.destroy', selectedParameterValue?.id)}
          />
        )}
      </div>
    </MainLayout>
  )
}
