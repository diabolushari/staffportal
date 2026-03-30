import useCustomForm from '@/hooks/useCustomForm'
import { BillingGroup, Connection } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import ComboBox from '@/ui/form/ComboBox'
import Input from '@/ui/form/Input'
import { router } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'

export default function BillSearchForm({
  filters,
}: {
  filters: {
    connectionId: string
    billingGroupId: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
    connection: Connection | null
    billingGroup: BillingGroup | null
  }
}) {
  const [selectedGroup, setSelectedGroup] = useState<BillingGroup | null>(
    filters?.billingGroup ?? null
  )
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(
    filters?.connection ?? null
  )
  useEffect(() => {
    if (selectedGroup) {
      setFormValue('group_id')(selectedGroup.billing_group_id.toString())
    } else {
      setFormValue('group_id')('')
    }
    if (selectedConnection) {
      setFormValue('connection_id')(selectedConnection.connection_id.toString())
    } else {
      setFormValue('connection_id')('')
    }
  }, [selectedGroup, selectedConnection])
  const { formData, setFormValue, setAll } = useCustomForm({
    connection_id: filters?.connectionId ?? '',
    group_id: filters?.billingGroupId ?? '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.get('/bills', formData, {
      preserveState: true,
      replace: true,
    })
  }

  const handleReset = () => {
    setSelectedGroup(null)
    setSelectedConnection(null)
    setAll({
      connection_id: '',
      group_id: '',
    })
    router.get('/bills')
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
      >
        <div className='grid grid-cols-3 gap-4'>
          <ComboBox
            label='Consumer Number / Legacy Code'
            url={`/api/consumer-number?q=`}
            setValue={setSelectedConnection}
            value={selectedConnection}
            dataKey='connection_id'
            displayKey='consumer_number'
            displayValue2='consumer_legacy_code'
            placeholder='Enter Consumer Number / Legacy Code'
          />
          <div className=''>
            <ComboBox
              label='Group'
              url={`/api/billing-groups?q=`}
              setValue={setSelectedGroup}
              value={selectedGroup}
              dataKey='billing_group_id'
              displayKey='name'
              placeholder='Eg: Section'
              className='w-full'
            />
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            label='Reset'
            type='button'
            variant='secondary'
            onClick={handleReset}
          />
          <Button
            label='Search'
            type='submit'
          />
        </div>
      </form>
    </div>
  )
}
