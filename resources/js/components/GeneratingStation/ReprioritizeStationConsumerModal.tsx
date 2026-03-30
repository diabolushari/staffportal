import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import Modal from '@/ui/Modal/Modal'
import Datepicker from '@/ui/form/DatePicker'
import { StationConsumerRel } from '@/interfaces/data_interfaces'

interface Props {
  setShowModal: (show: boolean) => void
  relation: StationConsumerRel
  isconsumerPriority: boolean
}

export default function ReprioritizeStationConsumerModal({
  setShowModal,
  relation,
  isconsumerPriority,
}: Props) {
  const { formData, setFormValue } = useCustomForm({
    rel_id: relation.rel_id,
    station_connection_id: relation.station_connection_id,
    consumer_priority_order: relation.consumer_priority_order ?? '',
    station_priority_order: relation.station_priority_order ?? '',
    effective_start: '',
    effective_end: '',
    _method: 'PUT',
  })

  const { post, loading } = useInertiaPost(`/station-consumer-rels/${relation.rel_id}`, {
    onComplete: () => {
      setShowModal(false)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  const handleClose = () => {
    setShowModal(false)
  }
  console.log(formData)
  return (
    <Modal
      setShowModal={handleClose}
      title='Reprioritize Station'
    >
      <form
        className='flex flex-col gap-4'
        onSubmit={handleSubmit}
      >
        {isconsumerPriority ? (
          <Input
            label='Consumer Priority'
            type='number'
            value={formData.consumer_priority_order}
            setValue={setFormValue('consumer_priority_order')}
          />
        ) : (
          <Input
            label='Station Priority'
            type='number'
            value={formData.station_priority_order}
            setValue={setFormValue('station_priority_order')}
          />
        )}
        <Datepicker
          label='New Priority Effective From'
          value={formData.effective_start}
          setValue={setFormValue('effective_start')}
        />
        <Datepicker
          label='New Priority Effective To'
          value={formData.effective_end}
          setValue={setFormValue('effective_end')}
        />

        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            label='Cancel'
          />
          <Button
            type='submit'
            label='Save'
          />
        </div>
      </form>
    </Modal>
  )
}
