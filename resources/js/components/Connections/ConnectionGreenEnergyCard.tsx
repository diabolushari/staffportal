import { Connection, ConnectionGreenEnergy } from '@/interfaces/data_interfaces'
import { Card } from '../ui/card'
import StrongText from '@/typography/StrongText'
import ActionButton from '../action-button'
import { getDisplayDate } from '@/utils'
import { useState } from 'react'
import ConnectionGreenEnergyFormModal from './ConnectionGreenEnergyFormModal'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { ParameterValues } from '@/interfaces/parameter_types'

interface Props {
  connection: Connection
  greenEnergyTypes: ParameterValues[]
  agreementAuthorities: ParameterValues[]
}

const ConnectionGreenEnergyCard = ({
  connection,
  greenEnergyTypes,
  agreementAuthorities,
}: Props) => {
  const [editGreenEnergy, setEditGreenEnergy] = useState(false)
  const [selectedGreenEnergy, setSelectedGreenEnergy] = useState<ConnectionGreenEnergy | null>(null)

  const [deleteGreenEnergy, setDeleteGreenEnergy] = useState<ConnectionGreenEnergy | null>(null)

  const handleEditGreenEnergy = (ge: ConnectionGreenEnergy) => {
    setSelectedGreenEnergy(ge)
    setEditGreenEnergy(true)
  }

  return (
    <Card className='rounded-lg p-5'>
      <div className='flex items-center justify-between'>
        <StrongText className='text-base font-semibold text-[#252c32]'>
          Green Energy Details
        </StrongText>
      </div>
      {connection?.green_energy?.map((greenEnergy) => (
        <>
          <div className='flex justify-end'></div>
          <hr className='bg-kseb-line mb-6 h-[2px] border-0' />
          <div className='grid grid-cols-7 gap-6 md:grid-cols-7'>
            <span className='context-menu-item'>Green Energy Type</span>
            <span className='context-menu-item'>Agreement Authority</span>
            <span className='context-menu-item'>Percentage</span>
            <span className='context-menu-item'>Remarks</span>
            <span className='context-menu-item'>From Date</span>
            <span className='context-menu-item'>To Date</span>
            <span></span>
          </div>
          <div className='grid grid-cols-7 gap-6 md:grid-cols-7'>
            <span>{greenEnergy.green_energy_type.parameter_value}</span>
            <span>{greenEnergy.agreement_authority.parameter_value}</span>
            <span>{greenEnergy.percentage}</span>
            <span>{greenEnergy.remarks}</span>
            <span>{getDisplayDate(greenEnergy.effective_start)}</span>
            <span>{getDisplayDate(greenEnergy.effective_end)}</span>
            <ActionButton
              onEdit={() => handleEditGreenEnergy(greenEnergy)}
              onDelete={() => setDeleteGreenEnergy(greenEnergy)}
            />
          </div>
        </>
      ))}

      {editGreenEnergy && selectedGreenEnergy && (
        <ConnectionGreenEnergyFormModal
          connection={connection}
          setShowModal={setEditGreenEnergy}
          greenEnergyTypes={greenEnergyTypes}
          agreementAuthorities={agreementAuthorities}
          greenEnergy={selectedGreenEnergy}
        />
      )}
      {deleteGreenEnergy && (
        <DeleteModal
          title={`Delete Green Energy (${deleteGreenEnergy.green_energy_type.parameter_value})`}
          setShowModal={() => setDeleteGreenEnergy(null)}
          url={route('connections.green-energy.destroy', deleteGreenEnergy.id)}
        />
      )}
    </Card>
  )
}

export default ConnectionGreenEnergyCard
