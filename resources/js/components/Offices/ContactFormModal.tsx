import useCustomForm from '@/hooks/useCustomForm'
import { OfficeContact } from '@/interfaces/data_interfaces'
import Modal from '@/ui/Modal/Modal'
import Input from '@/ui/form/Input'
import React, { useEffect } from 'react'

interface ContactFormModalProps {
  onClose: () => void
  onSave: (contact: OfficeContact) => void
  contact: OfficeContact | null
  officeId: number
  officeCode: string
  existingContacts: OfficeContact[]
}

export default function ContactFormModal({
  onClose,
  onSave,
  contact,
  existingContacts,
}: Readonly<ContactFormModalProps>) {
  const { formData, setFormValue } = useCustomForm<OfficeContact>({
    name: contact?.name ?? '',
    phone: contact?.phone ?? '',
    email: contact?.email ?? '',
    designation: contact?.designation ?? '',
    employee_id: contact?.employee_id ?? '',
  })

  const [employeeIdError, setEmployeeIdError] = React.useState<string | null>(null)

  // Validation function
  const validateEmployeeId = React.useCallback(
    (employeeId: string, currentContactEmployeeId?: string | null): string | null => {
      if (!employeeId.trim()) {
        return 'Employee ID is required'
      }

      const isDuplicate = existingContacts.some(
        (existingContact) =>
          existingContact.employee_id === employeeId &&
          existingContact.employee_id !== currentContactEmployeeId
      )

      if (isDuplicate) {
        return `Employee ID "${employeeId}" already exists. Please use a different Employee ID.`
      }

      return null
    },
    [existingContacts]
  )

  // Validate employee_id whenever it changes
  useEffect(() => {
    if (formData.employee_id) {
      const error = validateEmployeeId(formData.employee_id, contact?.employee_id)
      setEmployeeIdError(error)
    } else {
      setEmployeeIdError(formData.employee_id === '' ? 'Employee ID is required' : null)
    }
  }, [formData.employee_id, contact?.employee_id, validateEmployeeId])

  const isFormValid = formData.employee_id?.trim() !== '' && !employeeIdError

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Modal
      setShowModal={onClose}
      title={contact ? 'Edit Contact' : 'Add New Contact'}
    >
      <form
        onSubmit={handleSubmit}
        className='space-y-4'
      >
        <div>
          <Input
            label='Name'
            value={formData.name ?? ''}
            setValue={setFormValue('name')}
          />
        </div>

        <div>
          <Input
            label='Designation'
            value={formData.designation ?? ''}
            setValue={setFormValue('designation')}
          />
        </div>
        <div>
          <Input
            label='Phone'
            value={formData.phone ?? ''}
            setValue={setFormValue('phone')}
          />
        </div>

        <div>
          <Input
            label='Email'
            type='email'
            value={formData.email ?? ''}
            setValue={setFormValue('email')}
          />
        </div>

        <div>
          <Input
            label='Employee ID'
            value={formData.employee_id ?? ''}
            setValue={setFormValue('employee_id')}
            error={employeeIdError || undefined}
            required
          />
        </div>

        <div className='flex justify-end space-x-3 pt-4'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg border border-[#dde2e4] bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={!isFormValid}
            className='rounded-lg bg-[#0078d4] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#106ebe] disabled:cursor-not-allowed disabled:bg-gray-300'
          >
            Save Contact
          </button>
        </div>
      </form>
    </Modal>
  )
}
