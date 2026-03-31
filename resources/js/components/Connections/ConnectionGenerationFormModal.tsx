import FormCard from '@/ui/Card/FormCard'
import Modal from '@/ui/Modal/Modal'
import useConnectionGenerationForm from './useConnectionGenerationForm'
import { ParameterValues } from '@/interfaces/parameter_types'
import CheckBox from '@/ui/form/CheckBox'
import SelectList from '@/ui/form/SelectList'
import { ConnectionGenerationType } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import useInertiaPost from '@/hooks/useInertiaPost'

interface Props {
  setShowModal: (show: boolean) => void
  generationTypes: ParameterValues[]
  initialGenerationData?: ConnectionGenerationType[]
  connectionId: number
}

export default function ConnectionGenerationFormModal({
  setShowModal,
  generationTypes,
  initialGenerationData,
  connectionId,
}: Props) {
  const { generationData, updateGenerationData, updateGenerationSubTypeData } =
    useConnectionGenerationForm({
      generationTypes,
      initialData: initialGenerationData,
    })
  const { post, errors, loading } = useInertiaPost(
    route('connection-generation.update', connectionId),
    {
      onComplete: () => setShowModal(false),
    }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post({
      connection_id: connectionId,
      generation_types: generationData,
      _method: 'PUT',
    })
  }
  return (
    <Modal
      title='Connection Generation Form'
      setShowModal={() => setShowModal}
      large
      showClosButton
    >
      <form
        onSubmit={handleSubmit}
        className='flex flex-col space-y-4'
      >
        <FormCard title='Generation Type'>
          {/* Checkboxes */}

          {generationData.map((indicator) => (
            <div
              key={indicator.id}
              className='space-y-2'
            >
              <CheckBox
                label={indicator.label}
                value={indicator.value}
                toggleValue={() =>
                  updateGenerationData(indicator.id, !indicator.value, indicator.label)
                }
              />
              {indicator.value && indicator.generation_sub_types.length > 0 && (
                <SelectList
                  label='Generation Sub Type'
                  list={indicator.generation_sub_types}
                  dataKey='id'
                  displayKey='parameter_value'
                  setValue={(value) => updateGenerationSubTypeData(indicator.id, Number(value))}
                  value={indicator.generation_sub_type_id ?? 0}
                />
              )}
            </div>
          ))}
        </FormCard>
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
