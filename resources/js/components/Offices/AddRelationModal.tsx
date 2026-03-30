import React, { useEffect, useState } from 'react'
import {
  Office,
  OfficeHierarchy,
  OfficeHierarchyRel,
  OfficeWithHierarchy,
} from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'
import ComboBox from '@/ui/form/ComboBox'
import Button from '@/ui/button/Button'
import Modal from '@/ui/Modal/Modal'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import useFetchRecord from '@/hooks/useFetchRecord'

interface ParentOfficeModalProps {
  onClose: () => void
  officeHierarchies: OfficeHierarchy[]
  office_code: string
  hierarchyData?: OfficeHierarchyRel
}

export default function AddRelationModal({
  onClose,
  officeHierarchies,
  office_code,
  hierarchyData,
}: ParentOfficeModalProps) {
  const { formData, setFormValue } = useCustomForm({
    office_code: office_code,
    parent_office_code: hierarchyData?.parent_office_code ?? '',
    hierarchy_code: hierarchyData?.hierarchy_code ?? '',
    _method: hierarchyData ? 'PUT' : undefined,
  })
  const { post, errors, loading } = useInertiaPost(
    hierarchyData
      ? route('office-hierarchy-rel.update', hierarchyData.hierarchy_rel_hist_id)
      : route('office-hierarchy-rel.store'),
    {
      showErrorToast: true,
      onComplete: () => {
        onClose()
      },
    }
  )
  const [parentOffice, setParentOffice] = useState<Office | null>(null)

  const [parentOfficeData] = useFetchRecord<OfficeWithHierarchy>(
    formData.parent_office_code ? '/api/office/code/' + formData.parent_office_code : ''
  )
  useEffect(() => {
    if (parentOfficeData?.office) {
      setParentOffice(parentOfficeData.office)
    }
  }, [parentOfficeData])

  const handleConfirm = () => {
    post(formData)
  }

  return (
    <Modal
      setShowModal={onClose}
      title='Add Parent Office'
    >
      <div className='mt-4 space-y-4'>
        <SelectList
          label='Office Hierarchy'
          setValue={setFormValue('hierarchy_code')}
          value={formData.hierarchy_code}
          list={officeHierarchies}
          dataKey='hierarchy_code'
          displayKey='hierarchy_name'
        />

        {formData.hierarchy_code && (
          <ComboBox
            label='Office'
            url={`/api/offices?q=`}
            setValue={(office) => setFormValue('parent_office_code')(office?.office_code ?? '')}
            value={parentOffice}
            dataKey='office_code'
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
