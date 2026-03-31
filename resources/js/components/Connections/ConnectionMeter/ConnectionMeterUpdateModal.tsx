import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Meter, MeterConnectionMapping } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import Datepicker from '@/ui/form/DatePicker'
import SelectList from '@/ui/form/SelectList'
import Modal from '@/ui/Modal/Modal'

interface Props {
  setShowModal: (show: boolean) => void
  isStatusChange: boolean
  status: ParameterValues[]
  changeReason: ParameterValues[]
  meter: MeterConnectionMapping
}

export default function ConnectionMeterUpdateModal({
  setShowModal,
  isStatusChange,
  status,
  changeReason,
  meter,
}: Props) {
  const { formData, setFormValue } = useCustomForm({
    rel_id: meter.rel_id,
    change_reason_id: meter.change_reason?.id ?? '',
    status_id: meter.meter_status?.id ?? '',
    change_date: meter.change_date ?? '',
    notice_date: meter.notice_date ?? '',
    intimation_date: meter.intimation_date ?? '',
    _method: 'PUT',
  })
  const { post, errors, loading } = useInertiaPost(
    isStatusChange
      ? route('connection.meter-status.update', meter.rel_id)
      : route('connection.meter-change.update', meter.rel_id),
    {
      onComplete: () => {
        setShowModal(false)
      },
    }
  )

  const handleClose = () => {
    setShowModal(false)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }
  return (
    <Modal
      setShowModal={handleClose}
      title={isStatusChange ? 'Update Meter Status' : 'Change Reason'}
    >
      <div>
        <form
          className='flex flex-col gap-4'
          onSubmit={handleSubmit}
        >
          {isStatusChange ? (
            <div className='flex flex-col gap-4'>
              <SelectList
                label='Status'
                list={status}
                value={formData.status_id}
                setValue={setFormValue('status_id')}
                dataKey='id'
                displayKey='parameter_value'
              />
              <Datepicker
                label='Notice Date'
                value={formData.notice_date}
                setValue={setFormValue('notice_date')}
                placeholder='Select Notice Date'
              />
              <Datepicker
                label='Intimation Date'
                value={formData.intimation_date}
                setValue={setFormValue('intimation_date')}
                placeholder='Select Intimation Date'
              />
            </div>
          ) : (
            <div className='flex flex-col gap-4'>
              <SelectList
                label='Change Reason'
                list={changeReason}
                value={formData.change_reason_id}
                setValue={setFormValue('change_reason_id')}
                dataKey='id'
                displayKey='parameter_value'
              />
              <Datepicker
                label='Change Date'
                value={formData.change_date}
                setValue={setFormValue('change_date')}
                placeholder='dd/mm/yyyy'
              />
            </div>
          )}
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
      </div>
    </Modal>
  )
}
