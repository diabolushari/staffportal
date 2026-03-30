import React, { useMemo, useState } from 'react'
import { Office, OfficeHierarchy } from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'
import ComboBox from '@/ui/form/ComboBox'
import Button from '@/ui/button/Button'
import Modal from '@/ui/Modal/Modal'

interface ParentOfficeModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (entry: {
    hierarchy_id: number
    hierarchy_code: string
    office_id: number
    office_code: string
    office_name: string
  }) => void
  officeHierarchies: OfficeHierarchy[]
  alreadySelected: number[] // 👈 array of hierarchy_ids
}

export default function ParentOfficeModal({
  isOpen,
  onClose,
  onAdd,
  officeHierarchies,
  alreadySelected,
}: ParentOfficeModalProps) {
  const [selectedHierarchy, setSelectedHierarchy] = useState<OfficeHierarchy | null>(null)
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null)

  // ✅ Filter out already selected hierarchies
  const availableHierarchies = useMemo(
    () => officeHierarchies.filter((h) => !alreadySelected.includes(h.hierarchy_id)),
    [officeHierarchies, alreadySelected]
  )

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!selectedHierarchy || !selectedOffice) return
    onAdd({
      hierarchy_id: selectedHierarchy.hierarchy_id,
      hierarchy_code: selectedHierarchy.hierarchy_code,
      office_id: selectedOffice.office_id,
      office_code: selectedOffice.office_code,
      office_name: selectedOffice.office_name,
    })
    onClose()
    setSelectedHierarchy(null)
    setSelectedOffice(null)
  }

  return (
    <Modal
      setShowModal={onClose}
      title='Add Parent Office'
    >
      <div className='mt-4 space-y-4'>
        <SelectList
          label='Office Hierarchy'
          setValue={(id: string) =>
            setSelectedHierarchy(
              availableHierarchies.find((h) => h.hierarchy_id == Number(id)) || null
            )
          }
          value={selectedHierarchy?.hierarchy_id ?? ''}
          list={availableHierarchies} // 👈 only available ones
          dataKey='hierarchy_id'
          displayKey='hierarchy_name'
        />

        {selectedHierarchy && (
          <ComboBox
            label='Office'
            url={`/api/offices?q=`}
            setValue={setSelectedOffice}
            value={selectedOffice}
            dataKey='office_id'
            displayKey='office_name'
            displayValue2='office_code'
            placeholder='Select Office'
          />
        )}
      </div>

      <div className='mt-6 flex justify-end gap-2'>
        <Button
          label='Cancel'
          variant='secondary'
          onClick={onClose}
        />
        <Button
          label='Add'
          variant='primary'
          onClick={handleConfirm}
        />
      </div>
    </Modal>
  )
}
