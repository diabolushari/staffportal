import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Connection, ConnectionGreenEnergy } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import Datepicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'
import Modal from '@/ui/Modal/Modal'
import { useCallback } from 'react'

interface Props {
  connection: Connection
  setShowModal: (show: boolean) => void
  greenEnergyTypes: ParameterValues[]
  agreementAuthorities: ParameterValues[]
  greenEnergy?: ConnectionGreenEnergy
}

const ConnectionGreenEnergyFormModal = ({
  connection,
  setShowModal,
  greenEnergyTypes,
  agreementAuthorities,
  greenEnergy,
}: Props) => {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    id: greenEnergy?.id ?? null,
    connection_id: connection.connection_id,
    green_energy_type_id: greenEnergy?.green_energy_type_id ?? '',
    agreement_authority_id: greenEnergy?.agreement_authority_id ?? '',
    percentage: greenEnergy?.percentage ?? '',
    effective_start: greenEnergy?.effective_start ?? '',
    effective_end: greenEnergy?.effective_end ?? '',
    remarks: greenEnergy?.remarks ?? '',
    is_active: greenEnergy?.is_active ?? true,
  })

  const onComplete = useCallback(() => {
    setShowModal(false)
  }, [setShowModal])

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    greenEnergy?.id
      ? route('connection-green-energy.update', greenEnergy.id)
      : route('connection-green-energy'),
    {
      onComplete,
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(formData)
  }

  return (
    <Modal
      title='Connection Green Energy Form'
      setShowModal={setShowModal}
      showClosButton
    >
      <form
        onSubmit={handleSubmit}
        className='flex flex-col space-y-4'
      >
        <div className='flex flex-col gap-2'>
          <SelectList
            label='Green Energy Type'
            required
            list={greenEnergyTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('green_energy_type_id')}
            value={formData.green_energy_type_id}
            error={errors?.green_energy_type_id}
          />
          <SelectList
            label='Agreement Authority'
            required
            list={agreementAuthorities}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('agreement_authority_id')}
            value={formData.agreement_authority_id}
            error={errors?.agreement_authority_id}
          />
          <Input
            type='number'
            label='Percentage'
            required
            setValue={setFormValue('percentage')}
            value={formData.percentage}
            error={errors?.percentage}
          />
          <Datepicker
            label='Effective Start Date'
            required
            setValue={setFormValue('effective_start')}
            value={formData.effective_start}
            error={errors?.effective_start}
            placeholder='Select Effective Start'
          />
          <Datepicker
            label='Effective End Date'
            setValue={setFormValue('effective_end')}
            value={formData.effective_end}
            error={errors?.effective_end}
            placeholder='Select Effective End'
          />
          <TextArea
            label='Remarks'
            setValue={setFormValue('remarks')}
            value={formData.remarks}
            error={errors?.remarks}
          />
          <CheckBox
            label='Is Active'
            value={formData.is_active}
            error={errors?.is_active}
            toggleValue={toggleBoolean('is_active')}
          />
        </div>

        <div className='flex justify-between space-x-2'>
          <Button
            type='button'
            onClick={() => setShowModal(false)}
            label='Cancel'
            variant='secondary'
          />
          <Button
            type='submit'
            label='Save'
            processing={loading}
            disabled={loading}
            variant={loading ? 'loading' : 'primary'}
          />
        </div>
      </form>
    </Modal>
  )
}

export default ConnectionGreenEnergyFormModal
