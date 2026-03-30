import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { MeterTransformerAssignment } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import Datepicker from '@/ui/form/DatePicker'
import SelectList from '@/ui/form/SelectList'
import Modal from '@/ui/Modal/Modal'

interface Props {
  setUpdate: (update: boolean) => void
  setSelectedCtpt: (ctpt: MeterTransformerAssignment | null) => void
  ctpt: MeterTransformerAssignment
  statuses: ParameterValues[]
}

const UpdateMeterTransformerAssignmentStatus = ({
  setUpdate,
  setSelectedCtpt,
  ctpt,
  statuses,
}: Props) => {
  const { formData, setFormValue } = useCustomForm({
    status_id: ctpt.status_id,
    faulty_date: ctpt.faulty_date,
    ctpt_version_id: ctpt.version_id,
    ctpt_id: ctpt.ctpt_id,
    meter_id: ctpt.meter_id,
  })
  const { post, loading, errors } = useInertiaPost<typeof formData>(
    '/update-meter-transformer-assignment-status'
  )
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
    setSelectedCtpt(null)
    setUpdate(false)
  }

  return (
    <Modal setShowModal={setUpdate}>
      <form
        onSubmit={handleSubmit}
        className='space-y-5 rounded-xl bg-white p-6'
      >
        <h1 className='text-xl font-semibold text-gray-800'>Update Meter Transformer Status</h1>

        <SelectList
          label='Status'
          value={formData.status_id}
          setValue={setFormValue('status_id')}
          list={statuses}
          dataKey='id'
          displayKey='parameter_value'
          error={errors.status_id}
        />

        <Datepicker
          label='Faulty Date'
          value={formData.faulty_date}
          setValue={setFormValue('faulty_date')}
          error={errors.faulty_date}
          placeholder='dd/mm/yyyy'
        />

        <div className='pt-2'>
          <Button
            type='submit'
            label='Change'
            disabled={loading}
          />
        </div>
      </form>
    </Modal>
  )
}

export default UpdateMeterTransformerAssignmentStatus
