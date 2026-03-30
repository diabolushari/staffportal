import ConnectionCardSection from '@/components/Connections/ConnectionMeter/ConnectionCardSection'
import {
  Connection,
  MeterConnectionMapping,
  MeterTransformerAssignment,
} from '@/interfaces/data_interfaces'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { router } from '@inertiajs/react'
import { Cpu, Plus } from 'lucide-react'
import { useState } from 'react'
import { consumerNavItems } from '../../components/Navbar/navitems'
import ConnectionMeterUpdateModal from '@/components/Connections/ConnectionMeter/ConnectionMeterUpdateModal'
import ConnectionProfileUpdateModal from '@/components/Connections/ConnectionMeter/ConnectionProfileUpdateModal'
import { ParameterValues } from '@/interfaces/parameter_types'
import AddButton from '@/ui/button/AddButton'

interface ConnectionMeterListProps {
  connection_id: number
  connection: Connection
  status: ParameterValues[]
  change_reason: ParameterValues[]
  ctpt_status: ParameterValues[]
  ctpt_change_reason: ParameterValues[]
  meter_profiles: ParameterValues[]
}

export default function ConnectionMeterList({
  connection_id,
  connection,
  status,
  change_reason,
  ctpt_status,
  ctpt_change_reason,
  meter_profiles,
}: Readonly<ConnectionMeterListProps>) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteRelationId, setDeleteRelation] = useState<MeterConnectionMapping | null>(null)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [isStatusChange, setIsStatusChange] = useState(false)
  const [meter, setMeter] = useState<MeterConnectionMapping | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedProfileMeter, setSelectedProfileMeter] = useState<MeterConnectionMapping | null>(
    null
  )

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Connections',
      href: route('connections.index'),
    },
    {
      title: connection?.consumer_number.toString(),
      href: route('connections.show', connection_id),
    },
    {
      title: 'Meters',
      href: route('connection.meters', connection_id),
    },
  ]

  function handleAddMeter() {
    router.visit(route('connection.meter.create', { id: connection_id }))
  }

  function handleDeleteMeter(mapping: MeterConnectionMapping) {
    setDeleteRelation(mapping)
    setDeleteModalOpen(true)
  }

  function handleEditMeter(mappingId: number) {
    router.visit(route('connection.meter.edit', mappingId))
  }

  function handleMeterStatusChange(meter: MeterConnectionMapping) {
    setIsStatusChange(true)
    setUpdateModalOpen(true)
    setMeter(meter)
  }

  function handleMeterChange(meter: MeterConnectionMapping) {
    setIsStatusChange(false)
    setUpdateModalOpen(true)
    setMeter(meter)
  }

  function handleMeterProfileChange(mapping: MeterConnectionMapping) {
    setSelectedProfileMeter(mapping)
    setShowProfileModal(true)
  }

  function handleCloseModal() {
    setUpdateModalOpen(false)
    setMeter(null)
    setIsStatusChange(false)
  }

  return (
    <ConnectionsLayout
      connectionId={connection_id}
      heading={'Connection Details'}
      description={
        <>
          Details of Meters assigned to Consumer Number {'  '}
          <span className='font-bold'>{connection?.consumer_number}</span>
        </>
      }
      value='configuration'
      subTabValue='meter'
      connection={connection}
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
      consumerExist={true}
      meterExist={connection?.meter_mappings?.length > 0}
    >
      <div className='relative w-full rounded-lg bg-white'>
        <div className='flex items-center justify-end border-gray-200 px-6 py-4'>
          <AddButton
            onClick={handleAddMeter}
            buttonText='Add Meter'
          />
        </div>

        <div className='flex flex-col px-6 pb-6'>
          {connection?.meter_mappings && connection?.meter_mappings.length > 0 ? (
            connection?.meter_mappings.map((mapping) => (
              <>
                {' '}
                {mapping?.effective_end_ts == null && (
                  <ConnectionCardSection
                    key={mapping.rel_id}
                    meterMapping={mapping}
                    connectionId={connection_id}
                    onDelete={handleDeleteMeter}
                    onEdit={handleEditMeter}
                    onMeterStatusChange={handleMeterStatusChange}
                    onMeterChange={handleMeterChange}
                    onMeterProfileChange={handleMeterProfileChange}
                    changeReasons={ctpt_change_reason}
                    statuses={ctpt_status}
                  />
                )}
              </>
            ))
          ) : (
            <div className='p-8 text-center text-slate-500'>
              <div className='flex flex-col items-center gap-2'>
                <Cpu className='h-12 w-12 text-slate-300' />
                <p className='text-lg font-medium'>No meters found</p>
                <p className='text-sm'>No meters are associated with this connection.</p>
              </div>
            </div>
          )}
        </div>
        {deleteModalOpen && (
          <DeleteModal
            setShowModal={setDeleteModalOpen}
            url={route('meter-connection-rel.destroy', deleteRelationId?.rel_id)}
            title='Delete Meter'
          />
        )}
        {updateModalOpen && meter && (
          <ConnectionMeterUpdateModal
            setShowModal={handleCloseModal}
            isStatusChange={isStatusChange}
            status={status}
            changeReason={change_reason}
            meter={meter}
          />
        )}
        {showProfileModal && selectedProfileMeter && (
          <ConnectionProfileUpdateModal
            setShowModal={() => setShowProfileModal(false)}
            meterMapping={selectedProfileMeter}
            meterProfiles={meter_profiles}
          />
        )}
      </div>
    </ConnectionsLayout>
  )
}
