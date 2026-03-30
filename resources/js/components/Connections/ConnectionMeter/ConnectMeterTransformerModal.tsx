import { Card } from '@/components/ui/card'
import useCustomForm from '@/hooks/useCustomForm'
import { MeterTransformer } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import Datepicker from '@/ui/form/DatePicker'
import SelectList from '@/ui/form/SelectList'
import Modal from '@/ui/Modal/Modal'
import dayjs from 'dayjs'

interface ConnectMeterTransformerModalProps {
  ctpts: MeterTransformer[]
  statuses: ParameterValues[]
  relation?: any
  setShowModal: (value: boolean) => unknown
  onAdd: (item: any) => void
}
export default function ConnectMeterTransformerModal({
  ctpts,
  statuses,
  relation,
  setShowModal,
  onAdd,
}: ConnectMeterTransformerModalProps) {
  console.log(relation)
  const { formData, setFormValue } = useCustomForm({
    version_id: relation?.version_id ?? null,
    ctpt_id: relation?.ctpt_id ?? null,
    status_id: relation?.status_id ?? null,
    change_reason_id: relation?.change_reason_id ?? null,
    faulty_date: relation?.faulty_date ? dayjs(relation?.faulty_date).format('YYYY-MM-DD') : '',
    ctpt_energise_date: relation?.ctpt_energise_date
      ? dayjs(relation?.ctpt_energise_date).format('YYYY-MM-DD')
      : '',
    ctpt_change_date: relation?.ctpt_change_date
      ? dayjs(relation?.ctpt_change_date).format('YYYY-MM-DD')
      : '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    onAdd(formData) // send data back to parent
    setShowModal(false)
  }

  const mergedctpts = ctpts?.map((ctpt) => ({
    ...ctpt,
    mergedValue: `#${ctpt?.meter_ctpt_id} - ${ctpt?.type?.parameter_value ?? ''}`,
  }))
  return (
    <Modal
      setShowModal={setShowModal}
      showClosButton={true}
      title='Connect CTPT'
      large={true}
    >
      <form
        onSubmit={handleSubmit}
        className='space-y-8'
      >
        <Card>
          <div className='border-b-2 border-gray-200 py-3'>
            <StrongText className='text-base font-semibold'>CTPT Information</StrongText>
          </div>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
            {ctpts && (
              <SelectList
                label='CT/PT'
                value={formData.ctpt_id}
                setValue={setFormValue('ctpt_id')}
                list={mergedctpts}
                dataKey='meter_ctpt_id'
                displayKey='mergedValue'
              />
            )}

            {statuses && (
              <SelectList
                label='Status'
                value={formData.status_id}
                setValue={setFormValue('status_id')}
                list={statuses}
                dataKey='id'
                displayKey='parameter_value'
              />
            )}
          </div>
        </Card>
        <Card>
          <div className='border-b-2 border-gray-200 py-3'>
            <StrongText className='text-base font-semibold'>Dates</StrongText>
          </div>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
            <Datepicker
              label='Faulty Date'
              value={formData.faulty_date}
              setValue={setFormValue('faulty_date')}
              placeholder='dd/mm/yyyy'
            />
            <Datepicker
              label='CT/PT Energise Date'
              value={formData.ctpt_energise_date}
              setValue={setFormValue('ctpt_energise_date')}
            />
            <Datepicker
              label='CT/PT Change Date'
              value={formData.ctpt_change_date}
              setValue={setFormValue('ctpt_change_date')}
            />
          </div>
        </Card>
        <div className='flex justify-end gap-3 border-t pt-6'>
          <Button
            type='button'
            label='Cancel'
            variant='secondary'
            onClick={() => setShowModal(false)}
          />
          <Button
            type='submit'
            label={relation ? 'Update Relation' : 'Create Relation'}
          />
        </div>
      </form>
    </Modal>
  )
}
