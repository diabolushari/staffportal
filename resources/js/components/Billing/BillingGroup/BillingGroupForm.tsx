import useCustomForm from '@/hooks/useCustomForm'
import { BillingGroup } from '@/interfaces/data_interfaces'
import Input from '@/ui/form/Input'
import TextArea from '@/ui/form/TextArea'
import Button from '@/ui/button/Button'
import useInertiaPost from '@/hooks/useInertiaPost'
import FormCard from '@/ui/Card/FormCard'

export interface BillingGroupForm {
  billing_group_id?: number
  version_id?: number
  name: string
  description: string
  _method?: 'PUT' | 'POST'
}

export default function BillingGroupForm({
  billing_group,
}: {
  billing_group: BillingGroup | null
}) {
  const { formData, setFormValue } = useCustomForm<BillingGroupForm>({
    billing_group_id: billing_group?.billing_group_id ?? undefined,
    version_id: billing_group?.version_id ?? undefined,
    name: billing_group?.name ?? '',
    description: billing_group?.description ?? '',
    _method: billing_group ? 'PUT' : 'POST',
  })
  const { post, errors, loading } = useInertiaPost<typeof formData>(
    billing_group
      ? route('billing-groups.update', billing_group?.billing_group_id)
      : route('billing-groups.store')
  )
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }
  return (
    <form
      className='flex flex-col gap-6'
      onSubmit={handleSubmit}
    >
      <FormCard title='Billing Group'>
        <Input
          label='Name'
          value={formData.name}
          setValue={setFormValue('name')}
          error={errors.name}
        />
        <TextArea
          label='Description'
          value={formData.description}
          setValue={setFormValue('description')}
          error={errors.description}
        />
      </FormCard>

      <div className='flex justify-end'>
        <Button
          label='Submit'
          type='submit'
          disabled={loading}
          processing={loading}
          variant={loading ? 'loading' : 'primary'}
        />
      </div>
    </form>
  )
}
