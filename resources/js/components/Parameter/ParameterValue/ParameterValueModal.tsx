import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterDefinition, ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import FormCard from '@/ui/Card/FormCard'
import Input from '@/ui/form/Input'
import TextArea from '@/ui/form/TextArea'
import Modal from '@/ui/Modal/Modal'
import { router } from '@inertiajs/react'
import { useCallback } from 'react'

interface PageProps {
  onClose: () => void
  definition?: ParameterDefinition
  title?: string
  codeLabel?: string
  valueLabel?: string
  descriptionLabel?: string
  parameterValue?: ParameterValues
  definitionId?: number
  large?: boolean
  warningMessage?: string
}

export default function ParameterValueModal({
  onClose,
  definition,
  title,
  codeLabel,
  valueLabel,
  descriptionLabel,
  parameterValue,
  definitionId,
  large = false,
  warningMessage,
}: PageProps) {
  const { formData, setFormValue } = useCustomForm({
    definition_id: definition?.id ?? definitionId ?? '',
    parameter_code: parameterValue?.parameter_code ?? '',
    parameter_value: parameterValue?.parameter_value ?? '',
    attribute1_value: parameterValue?.attribute1_value ?? '',
    attribute2_value: parameterValue?.attribute2_value ?? '',
    attribute3_value: parameterValue?.attribute3_value ?? '',
    attribute4_value: parameterValue?.attribute4_value ?? '',
    attribute5_value: parameterValue?.attribute5_value ?? '',
    effective_start_date: parameterValue?.effective_start_date ?? '',
    effective_end_date: parameterValue?.effective_end_date ?? '',
    sort_priority: parameterValue?.sort_priority ?? '',
    is_active: parameterValue?.is_active ?? true,
    notes: parameterValue?.notes ?? '',
    _method: parameterValue ? 'PUT' : 'POST',
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    parameterValue
      ? route('parameter-value.update', parameterValue.id)
      : route('parameter-value.store'),
    {
      onComplete: () => {
        onClose()
      },
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(formData)
  }
  return (
    <Modal
      title={title ?? 'Parameter Value'}
      setShowModal={onClose}
      large={large}
    >
      {warningMessage && !definition && (
        <div className='flex'>
          {warningMessage}
          <Button
            label='Go To Definition'
            onClick={() => router.get(route('parameter-definition.index'))}
            variant='link'
          />
        </div>
      )}
      {definition && (
        <div className='flex flex-col gap-2'>
          <Input
            label={codeLabel ?? 'Parameter Code'}
            value={formData.parameter_code}
            setValue={setFormValue('parameter_code')}
            error={errors?.parameter_code}
          />
          <Input
            label={valueLabel ?? 'Parameter Value'}
            value={formData.parameter_value}
            setValue={setFormValue('parameter_value')}
            error={errors?.parameter_value}
          />
          <TextArea
            label={descriptionLabel ?? 'Description'}
            value={formData.notes}
            setValue={setFormValue('notes')}
            error={errors?.notes}
          />
          <Input
            label='Sort Priority'
            type='number'
            value={formData.sort_priority}
            setValue={setFormValue('sort_priority')}
            error={errors?.sort_priority}
          />

          {definition?.attribute1_name ||
            definition?.attribute2_name ||
            definition?.attribute3_name ||
            definition?.attribute4_name ||
            (definition?.attribute5_name && (
              <FormCard title='Attributes'>
                {definition.attribute1_name && (
                  <Input
                    label={definition.attribute1_name}
                    value={formData.attribute1_value}
                    setValue={setFormValue('attribute1_value')}
                    error={errors?.attribute1_value}
                  />
                )}
                {definition.attribute2_name && (
                  <Input
                    label={definition.attribute2_name}
                    value={formData.attribute2_value}
                    setValue={setFormValue('attribute2_value')}
                    error={errors?.attribute2_value}
                  />
                )}
                {definition.attribute3_name && (
                  <Input
                    label={definition.attribute3_name}
                    value={formData.attribute3_value}
                    setValue={setFormValue('attribute3_value')}
                    error={errors?.attribute3_value}
                  />
                )}
                {definition.attribute4_name && (
                  <Input
                    label={definition.attribute4_name}
                    value={formData.attribute4_value}
                    setValue={setFormValue('attribute4_value')}
                    error={errors?.attribute4_value}
                  />
                )}
                {definition.attribute5_name && (
                  <Input
                    label={definition.attribute5_name}
                    value={formData.attribute5_value}
                    setValue={setFormValue('attribute5_value')}
                    error={errors?.attribute5_value}
                  />
                )}
              </FormCard>
            ))}
          <div className='flex justify-between gap-2'>
            <Button
              label='Cancel'
              onClick={onClose}
              variant='secondary'
            />
            <Button
              label='Submit'
              onClick={handleSubmit}
              processing={loading}
              disabled={loading}
              type='submit'
              variant={loading ? 'loading' : 'primary'}
            />
          </div>
        </div>
      )}
    </Modal>
  )
}
