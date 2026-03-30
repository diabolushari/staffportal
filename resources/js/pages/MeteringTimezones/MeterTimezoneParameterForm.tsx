import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterDefinition, ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import TextArea from '@/ui/form/TextArea'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  timezoneNameParameter: ParameterDefinition
  pricingTypes: ParameterValues[]
  timezoneNames: ParameterValues[]
  switchForm: Dispatch<SetStateAction<boolean>>
  parameterCodeLabel: string
  parameterValueLabel: string
}

export default function MeterTimezoneParameterForm({
  timezoneNameParameter,
  pricingTypes,
  timezoneNames,
  switchForm,
  parameterCodeLabel,
  parameterValueLabel,
}: Props) {
  const { formData, setFormValue } = useCustomForm({
    definition_id: timezoneNameParameter?.id,
    parameter_code: '',
    parameter_value: '',
    attribute1_value: '',
    attribute2_value: '',
    attribute3_value: '',
    attribute4_value: '',
    attribute5_value: '',
    effective_start_date: '',
    effective_end_date: '',
    sort_priority: '',
    notes: '',
    is_active: true,
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    route('parameter-value.store'),
    {
      onComplete: () => {
        switchForm(true)
      },
    }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }
  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-2'
    >
      <div className='flex flex-col gap-2'>
        <Input
          label={parameterCodeLabel ?? 'Parameter Code'}
          value={formData.parameter_code}
          setValue={setFormValue('parameter_code')}
          error={errors?.parameter_code}
        />
        <Input
          label={parameterValueLabel ?? 'Parameter Value'}
          value={formData.parameter_value}
          setValue={setFormValue('parameter_value')}
          error={errors?.parameter_value}
        />
        <TextArea
          label='Description'
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
      </div>
      <div className='flex justify-between gap-2'>
        <Button
          label='Cancel'
          onClick={() => switchForm(true)}
          variant='secondary'
          type='button'
        />
        <Button
          type='submit'
          label='Save'
          variant={loading ? 'loading' : 'primary'}
          processing={loading}
          disabled={loading}
        />
      </div>
    </form>
  )
}
