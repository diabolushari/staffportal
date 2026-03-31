import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import Button from '@/ui/button/Button'
import Datepicker from '@/ui/form/DatePicker'
import Modal from '@/ui/Modal/Modal'
import { StationConsumerRel } from '@/interfaces/data_interfaces'

interface Props {
  setShowModal: (show: boolean) => void
  relation: StationConsumerRel
}

export default function DeactivateStationConsumerModal({ setShowModal, relation }: Props) {
  const { formData, setFormValue } = useCustomForm({
    rel_id: relation.rel_id,
    effective_end: '',
    _method: 'DELETE',
  })

  const { post, loading } = useInertiaPost(`/station-consumer-rels/${relation.rel_id}`, {
    onComplete: () => setShowModal(false),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  const handleClose = () => setShowModal(false)

  return (
    <Modal
      title='Deactivate Relation'
      setShowModal={handleClose}
    >
      <form
        className='flex flex-col gap-4'
        onSubmit={handleSubmit}
      >
        <Datepicker
          label='Inactivation Date'
          value={formData.effective_end}
          setValue={setFormValue('effective_end')}
        />

        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            label='Cancel'
            onClick={handleClose}
          />

          <Button
            type='submit'
            label='Deactivate'
          />
        </div>
      </form>
    </Modal>
  )
}
