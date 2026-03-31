import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import ParameterValueModal from '@/components/Parameter/ParameterValue/ParameterValueModal'
import MeterTimeZoneFormModal from '@/components/meteringtimezones/MeterTimeZoneFormModal'
import { Card, CardContent } from '@/components/ui/card'
import { ParameterDefinition, ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import type { BreadcrumbItem } from '@/types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import AddButton from '@/ui/button/AddButton'
import DeleteButton from '@/ui/button/DeleteButton'
import EditButton from '@/ui/button/EditButton'
import { Clock, Group, Tag, Timer } from 'lucide-react'
import { useState } from 'react'

// --- TYPES ---
export interface MeteringTimezone {
  version_id: number
  metering_timezone_id: number
  pricing_type: ParameterValues
  timezone_type: ParameterValues
  timezone_name: ParameterValues
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

export interface MeteringTimezoneResponse {
  timezone_type: ParameterValues
  metering_timezones: MeteringTimezone[]
}

interface Props {
  timezone?: MeteringTimezoneResponse
  timezoneTypes: ParameterValues[]
  pricingTypes: ParameterValues[]
  timezoneNameParameter: ParameterDefinition
  timeZonetypeParameter: ParameterDefinition
  timezoneNames: ParameterValues[]
}

// --- COMPONENT ---
export default function MeteringTimezoneShowPage({
  timezone,
  pricingTypes,
  timezoneNameParameter,
  timezoneNames,
}: Readonly<Props>) {
  const [isEditing, setIsEditing] = useState(false)
  const [isGroupEditing, setIsGroupEditing] = useState(false)
  const [group, setGroup] = useState<ParameterValues | null | undefined>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<MeteringTimezone | null | undefined>(null)
  const [selectedTimezone, setSelectedTimezone] = useState<MeteringTimezone | null | undefined>(
    undefined
  )
  const [selectedType, setSelectedType] = useState<ParameterValues | null>(null)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)

  const { timezone_type, metering_timezones } = timezone || {}
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
      href: route('timezone-groups.index'),
    },
    {
      title: timezone_type?.parameter_value ?? '-',
      href: '#',
    },
  ]

  const formatTime = (hrs: number, mins: number) =>
    `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const calculateDuration = (tz: MeteringTimezone) => {
    const start = tz.from_hrs * 60 + tz.from_mins
    const end = tz.to_hrs * 60 + tz.to_mins
    return end >= start ? end - start : 1440 - start + end
  }

  const handleEdit = (tz: MeteringTimezone) => {
    setIsEditing(true)
    setSelectedTimezone(tz)
  }

  const handleDelete = (zone: MeteringTimezone) => {
    setDeleteModalOpen(true)
    setDeleteItem(zone)
  }

  const handleAdd = () => {
    console.log(timezone_type)
    setShowCreateModal(true)
    setSelectedType(timezone_type ?? null)
  }
  const handleGroupEdit = () => {
    setIsGroupEditing(true)
    setGroup(timezone_type ?? null)
  }

  // --- RENDER ---
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='Timezone Groups'
      selectedTopNav='Consumers'
      title={timezone_type?.parameter_value}
      editBtnClick={handleGroupEdit}
    >
      <div className='p-4'>
        <div className='flex items-center justify-between p-4'>
          <div />
          <AddButton
            onClick={handleAdd}
            buttonText='Add Timezone'
          />
        </div>

        {timezone ? (
          <>
            {' '}
            {metering_timezones?.map((tz) => (
              <Card
                key={tz.version_id}
                className='mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm'
              >
                <CardContent className='p-6'>
                  {/* Header */}
                  <div className='mb-6 flex items-center justify-between'>
                    <h2 className='text-lg font-semibold text-gray-900'>
                      {tz?.timezone_name?.parameter_value}
                    </h2>

                    <div className='flex gap-2'>
                      <EditButton onClick={() => handleEdit(tz)} />
                      <DeleteButton onClick={() => handleDelete(tz)} />
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                    {/* Time Range */}
                    <div className='flex items-start gap-3'>
                      <Clock className='mt-1 h-5 w-5 text-gray-400' />
                      <div>
                        <p className='text-sm text-gray-500'>Time Range</p>
                        <p className='font-medium text-blue-600'>
                          {formatTime(tz.from_hrs, tz.from_mins)} –{' '}
                          {formatTime(tz.to_hrs, tz.to_mins)}
                        </p>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className='flex items-start gap-3'>
                      <Timer className='mt-1 h-5 w-5 text-gray-400' />
                      <div>
                        <p className='text-sm text-gray-500'>Duration</p>
                        <p className='font-medium text-blue-600'>{calculateDuration(tz)} minutes</p>
                      </div>
                    </div>

                    {/* Pricing Type */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <div className='flex items-center justify-center'>
            No profile parameters are available. Please add a profile parameter to view the details.
          </div>
        )}
      </div>

      {isEditing && selectedTimezone && (
        <MeterTimeZoneFormModal
          timezone={selectedTimezone}
          timezoneType={selectedTimezone.timezone_type}
          pricingTypes={pricingTypes}
          timezoneNames={timezoneNames}
          timezoneNameParameter={timezoneNameParameter}
          onClose={() => setIsEditing(false)}
        />
      )}
      {isGroupEditing && group && (
        <ParameterValueModal
          parameterValue={group}
          definitionId={group.definition_id}
          onClose={() => setIsGroupEditing(false)}
        />
      )}

      {showCreateModal && selectedType !== null && (
        <MeterTimeZoneFormModal
          onClose={() => setShowCreateModal(false)}
          timezoneType={selectedType}
          timezoneNames={timezoneNames}
          pricingTypes={pricingTypes}
          timezoneNameParameter={timezoneNameParameter}
        />
      )}
      {deleteItem && deleteModalOpen && (
        <DeleteModal
          title={`Delete Metering Timezone ${deleteItem.timezone_name.parameter_value}`}
          setShowModal={setDeleteModalOpen}
          url={route('timezone-groups.destroy', deleteItem.metering_timezone_id)}
        />
      )}
    </MainLayout>
  )
}
