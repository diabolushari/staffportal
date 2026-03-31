import { Button } from '@/components/ui/button'
import useCustomForm from '@/hooks/useCustomForm'
import { Connection } from '@/interfaces/data_interfaces'
import ComboBox from '@/ui/form/ComboBox'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

interface Props {
  oldConnections?: Connection
}

const ConsumerSDIndexSearch = ({ oldConnections }: Props) => {
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(
    oldConnections ?? null
  )

  const { formData, setFormValue } = useCustomForm({
    connection_id: oldConnections?.connection_id ?? '',
  })

  useEffect(() => {
    if (selectedConnection) {
      setFormValue('connection_id')(selectedConnection.connection_id.toString())
    } else {
      setFormValue('connection_id')('')
    }
  }, [selectedConnection, setFormValue])

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()
    router.get('/consumer-sd', formData)
  }

  return (
    <div className='flex flex-col gap-3 p-3'>
      <div className='w-1/3'>
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
      </div>
      <div className='w-1/4'>
        <Button
          onClick={handleSubmit}
          variant='outline'
        >
          Search
        </Button>
      </div>
    </div>
  )
}

export default ConsumerSDIndexSearch
