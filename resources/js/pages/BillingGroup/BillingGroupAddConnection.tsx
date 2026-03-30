import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { BillingGroup, Connection } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import FormCard from '@/ui/Card/FormCard'
import ComboBox from '@/ui/form/ComboBox'
import { useState } from 'react'

export default function BillingGroupAddConnection({
  billingGroup,
}: {
  billingGroup: BillingGroup
}) {
  const [selectedConsumer, setSelectedConsumer] = useState<Connection | null>(null)
  const { formData, setFormValue } = useCustomForm({
    billing_group_id: billingGroup.billing_group_id,
    connection_id: '',
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    route('billing-group-connection-rel.store')
  )
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const payload = {
      billing_group_id: formData.billing_group_id,
      connection_id: selectedConsumer?.connection_id,
    }

    e.preventDefault()
    post(payload)
  }
  return (
    <div>
      <form
        className='flex flex-col gap-6'
        onSubmit={handleSubmit}
      >
        <FormCard title='Search & Add Members'>
          <ComboBox
            label='Consumer Number / Legacy Code'
            url={`/api/consumer-number?q=`}
            setValue={setSelectedConsumer}
            value={selectedConsumer}
            dataKey='connection_id'
            displayKey='consumer_number'
            displayValue2='consumer_legacy_code'
            placeholder='Enter Consumer Number / Legacy Code'
            error={errors?.connection_id}
          />
          <div className='mt-6'>
            <Button
              label='Submit'
              type='submit'
            />
          </div>
        </FormCard>
      </form>
    </div>
  )
}
