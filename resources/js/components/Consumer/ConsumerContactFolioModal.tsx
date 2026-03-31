import { Dispatch, SetStateAction, useState } from 'react'
import Modal from '@/ui/Modal/Modal'
import Input from '@/ui/form/Input'
import Button from '@/ui/button/Button'

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>
  setFormValue: (field: string) => (value: any) => void
  formData: any
}

export default function ConsumerContactFolioModal({ setShowModal, setFormValue, formData }: Props) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const handleAdd = () => {
    if (!email && !phone) return
    const updated = [...formData.contact_folio, { email, phone }]
    setFormValue('contact_folio')(updated)
    setShowModal(false)
  }

  return (
    <Modal
      setShowModal={setShowModal}
      title='Add Contact'
    >
      <div className='flex flex-col gap-4'>
        <Input
          label='Email'
          type='email'
          value={email}
          setValue={setEmail}
          placeholder='Enter additional email'
        />
        <Input
          label='Phone'
          type='number'
          value={phone}
          setValue={setPhone}
          placeholder='Enter additional phone number'
        />
        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            label='Cancel'
            onClick={() => setShowModal(false)}
          />
          <Button
            type='button'
            label='Add'
            onClick={handleAdd}
          />
        </div>
      </div>
    </Modal>
  )
}
