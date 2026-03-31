import { useState } from 'react'
import Modal from '@/ui/Modal/Modal'
import Input from '@/ui/form/Input'
import Button from '@/ui/button/Button'

export default function ContactFolioModal({
  setShowModal,
  onAddContact,
}: {
  setShowModal: (show: boolean) => void
  onAddContact: (contact: {
    phone: string
    email: string
    name: string
    employee_id: string
  }) => void
}) {
  const [contact, setContact] = useState({
    phone: '',
    email: '',
    name: '',
    employee_id: '',
  })

  const handleChange = (key: string, value: string) => {
    setContact((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onAddContact(contact)
    setShowModal(false)
  }

  return (
    <Modal
      title='Contact Folio'
      setShowModal={setShowModal}
    >
      <div className='flex flex-col gap-4 p-4 md:grid md:grid-cols-2'>
        <Input
          label='Name'
          value={contact.name}
          setValue={(v) => handleChange('name', v)}
        />
        <Input
          label='Email'
          value={contact.email}
          setValue={(v) => handleChange('email', v)}
        />
        <Input
          label='Phone'
          value={contact.phone}
          setValue={(v) => handleChange('phone', v)}
        />

        <Input
          label='Employee ID'
          value={contact.employee_id}
          setValue={(v) => handleChange('employee_id', v)}
        />

        <div className='flex justify-end gap-2'>
          <Button
            label='Cancel'
            variant='secondary'
            type='button'
            onClick={() => setShowModal(false)}
          />
          <Button
            label='Add'
            variant='primary'
            type='button'
            onClick={handleSave}
          />
        </div>
      </div>
    </Modal>
  )
}
