import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Meter, MeterConnectionMapping } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import SelectList from '@/ui/form/SelectList'
import Modal from '@/ui/Modal/Modal'

interface Props {
  setShowModal: (show: boolean) => void
  meterMapping: MeterConnectionMapping
  meterProfiles: ParameterValues[]
}

export default function ConnectionProfileUpdateModal({
  setShowModal,
  meterMapping,
  meterProfiles,
}: Props) {
  const { formData, setFormValue } = useCustomForm({
    rel_id: meterMapping.rel_id,
    meter_profile_id: meterMapping.meter_profile?.id ?? '',
    _method: 'PUT',
  })
  const { post, loading, errors } = useInertiaPost(
    route('meter-connection-profile-update', meterMapping.rel_id),
    {
      onComplete: () => setShowModal(false),
    }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  return (
    <Modal
      setShowModal={() => setShowModal(false)}
      title='Update Meter Profile'
    >
      <form
        className='flex flex-col gap-4'
        onSubmit={handleSubmit}
      >
        <SelectList
          label='Meter Profile'
          list={meterProfiles}
          value={formData.meter_profile_id}
          setValue={setFormValue('meter_profile_id')}
          dataKey='id'
          displayKey='parameter_value'
          error={errors.meter_profile_id}
        />

        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='secondary'
            label='Cancel'
            onClick={() => setShowModal(false)}
          />
          <Button
            type='submit'
            label={loading ? 'Saving...' : 'Save'}
            disabled={loading}
          />
        </div>
      </form>
    </Modal>
  )
}
