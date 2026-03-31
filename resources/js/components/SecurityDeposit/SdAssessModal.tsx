import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import Datepicker from '@/ui/form/DatePicker'
import SelectList from '@/ui/form/SelectList'
import Modal from '@/ui/Modal/Modal'

interface SdAssessModalProps {
  setShowModal: (show: boolean) => void
  connection_ids: number[]
  triggerTypes: ParameterValues[]
  redirect?: 'group' | 'individual'
  billingGroupId?: number
}

export default function SdAssessModal({
  setShowModal,
  connection_ids,
  triggerTypes,
  redirect = 'individual',
  billingGroupId,
}: SdAssessModalProps) {
  const { formData, setFormValue } = useCustomForm({
    connection_ids: connection_ids,
    trigger_type_id: '',
    start_date: '',
    end_date: '',
    billing_group_id: billingGroupId,
    redirect: redirect,
  })

  const { post, loading } = useInertiaPost(route('sd-assess'))

  const handleSubmitBill = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  return (
    <Modal
      title='Initialize Bill'
      setShowModal={setShowModal}
      showClosButton={true}
    >
      <form
        action=''
        className='flex flex-col gap-4'
        onSubmit={handleSubmitBill}
      >
        <SelectList
          label='Trigger Type'
          list={triggerTypes}
          displayKey='parameter_value'
          dataKey='id'
          value={formData?.trigger_type_id}
          setValue={setFormValue('trigger_type_id')}
        />
        <Datepicker
          label='Start Date'
          value={formData?.start_date}
          setValue={setFormValue('start_date')}
        />
        <Datepicker
          label='End Date'
          value={formData?.end_date}
          setValue={setFormValue('end_date')}
        />
        <div className='flex justify-end gap-2'>
          <Button
            label='Assess Selected'
            type='submit'
            disabled={loading}
            processing={loading}
            variant={loading ? 'loading' : 'primary'}
          />
        </div>
      </form>
    </Modal>
  )
}
