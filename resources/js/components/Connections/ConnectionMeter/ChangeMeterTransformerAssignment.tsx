import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { MeterTransformerAssignment } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import Datepicker from '@/ui/form/DatePicker'
import SelectList from '@/ui/form/SelectList'
import Modal from '@/ui/Modal/Modal'

interface Props {
  ctpt: MeterTransformerAssignment
  changeReasons: ParameterValues[]
  setSelectedCtpt: (ctpt: MeterTransformerAssignment | null) => void
  setChange: (change: boolean) => void
}

const ChangeMeterTransformerAssignment = ({
  ctpt,
  changeReasons,
  setSelectedCtpt,
  setChange,
}: Props) => {
  const { formData, setFormValue } = useCustomForm({
    change_reason_id: ctpt.change_reason_id,
    ctpt_change_date: ctpt.ctpt_change_date,
    ctpt_version_id: ctpt.version_id,
    ctpt_id: ctpt.ctpt_id,
    meter_id: ctpt.meter_id,
  })

  const { post, loading, errors } = useInertiaPost<typeof formData>(
    '/change-meter-transformer-assignment'
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
    setSelectedCtpt(null)
    setChange(false)
  }

  return (
    <Modal setShowModal={setChange}>
      <form
        onSubmit={handleSubmit}
        className='space-y-5 rounded-xl bg-white p-6'
      >
        <h1 className='text-xl font-semibold text-gray-800'>Change Meter Transformer Assignment</h1>

        <SelectList
          label='Change Reason'
          value={formData.change_reason_id}
          setValue={setFormValue('change_reason_id')}
          list={changeReasons}
          dataKey='id'
          displayKey='parameter_value'
          error={errors.change_reason_id}
        />

        <Datepicker
          label='CT/PT Change Date'
          value={formData.ctpt_change_date}
          setValue={setFormValue('ctpt_change_date')}
          error={errors.ctpt_change_date}
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

export default ChangeMeterTransformerAssignment
