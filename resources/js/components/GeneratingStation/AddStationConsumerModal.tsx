import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Connection, GeneratingStation } from '@/interfaces/data_interfaces'
import ErrorText from '@/typography/ErrorText'
import Modal from '@/ui/Modal/Modal'
import Button from '@/ui/button/Button'
import ComboBox from '@/ui/form/ComboBox'
import Datepicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import RadioGroup from '@/ui/form/RadioGroup'
import { useCallback, useMemo, useState } from 'react'

interface Props {
  connection: Connection
  stations: GeneratingStation[]
  setShowModal: (show: boolean) => void
}

export default function AddStationConsumerModal({ connection, setShowModal }: Props) {
  const [selectedStation, setSelectedStation] = useState<GeneratingStation | null>(null)
  const { formData, setFormValue } = useCustomForm({
    station_id: '',
    station_connection_id: '',
    consumer_connection_id: connection.connection_id,
    consumer_priority_order: '',
    station_priority_order: '',
    effective_start: '',
    effective_end: '',
    purpose_type: '1',
  })

  const purposeOptions = [
    { id: 1, name: 'Current Purpose' },
    { id: 0, name: 'Future Purpose' },
  ]

  const today = new Date().toISOString().split('T')[0]

  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const tomorrow = tomorrowDate.toISOString().split('T')[0]

  const onComplete = useCallback(() => {
    setShowModal(false)
  }, [setShowModal])

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    route('station-consumer-rels.store'),
    {
      onComplete,
    }
  )

  const customFormData = useMemo(() => {
    return {
      ...formData,
      station_id: selectedStation?.station_id?.toString() ?? '',
      station_connection_id: selectedStation?.connection_id?.toString() ?? '',
    }
  }, [formData, selectedStation])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(customFormData)
  }
  console.log(errors)

  return (
    <Modal
      title='Add Station'
      setShowModal={setShowModal}
      showClosButton
    >
      <form
        onSubmit={handleSubmit}
        className='flex flex-col space-y-4'
      >
        <div className='flex flex-col gap-3'>
          {errors?.consumer_connection_id != null && (
            <ErrorText>{errors?.consumer_connection_id}</ErrorText>
          )}
          {errors?.consumer_priority_order != null && (
            <ErrorText>{errors?.consumer_priority_order}</ErrorText>
          )}
          <div className='flex items-center gap-6'>
            <RadioGroup
              label='Purpose'
              list={purposeOptions}
              dataKey='id'
              displayKey='name'
              value={formData.purpose_type}
              setValue={setFormValue('purpose_type')}
              error={errors?.purpose_type}
            />
          </div>
          {/* Station Name */}
          <ComboBox
            label='Generating Station'
            url='/api/generating-stations?q='
            setValue={setSelectedStation}
            value={selectedStation}
            dataKey='station_id'
            displayKey='station_name'
            displayValue2='station_code'
            placeholder='Search Station'
            error={errors?.station_id || errors?.station_connection_id}
          />

          {/* Priority */}
          <Input
            type='number'
            label='Priority Order'
            required
            setValue={setFormValue('station_priority_order')}
            value={formData.station_priority_order}
            error={errors?.station_priority_order}
          />

          {/* Date From */}
          <Datepicker
            label='Date From'
            required
            setValue={setFormValue('effective_start')}
            value={formData.effective_start}
            error={errors?.effective_start}
            min={formData.purpose_type === '1' ? '' : tomorrow}
            max={formData.purpose_type === '1' ? today : ''}
          />

          {/* Date To */}
          <Datepicker
            label='Date To'
            setValue={setFormValue('effective_end')}
            value={formData.effective_end}
            error={errors?.effective_end}
          />
        </div>

        <div className='flex justify-between pt-3'>
          <Button
            type='button'
            label='Cancel'
            variant='secondary'
            onClick={() => setShowModal(false)}
          />

          <Button
            type='submit'
            label='Add'
            processing={loading}
            disabled={loading}
            variant={loading ? 'loading' : 'primary'}
          />
        </div>
      </form>
    </Modal>
  )
}
