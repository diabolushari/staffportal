import { Button } from '@/components/ui/button'
import useCustomForm from '@/hooks/useCustomForm'
import { Connection } from '@/interfaces/data_interfaces'
import ComboBox from '@/ui/form/ComboBox'
import Datepicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

interface Props {
  oldConnection?: Connection
  oldGroup?: string
  oldStatus?: boolean
  oldDateFrom?: string
  oldDateTo?: string
}

const status = [
  { value: 'settled', label: 'Settled' },
  { value: 'not_settled', label: 'Not Settled' },
]

const SdRegisterIndexSearch = ({
  oldConnection,
  oldGroup,
  oldStatus,
  oldDateFrom,
  oldDateTo,
}: Props) => {
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(
    oldConnection ?? null
  )

  const { formData, setFormValue } = useCustomForm({
    connection_id: oldConnection?.connection_id.toString() ?? '',
    group: oldGroup ?? '',
    settled: oldStatus === true ? 'settled' : oldStatus === false ? 'not_settled' : '',
    date_from: oldDateFrom ?? '',
    date_to: oldDateTo ?? '',
  })
  useEffect(() => {
    setFormValue('connection_id')(selectedConnection?.connection_id.toString() ?? '')
  }, [selectedConnection, setFormValue])

  const handleSearch = () => {
    const payload = {
      ...formData,
      is_settled:
        formData.settled === 'settled' ? true : formData.settled === 'not_settled' ? false : null,
    }

    router.get('sd-register', payload)
  }
  return (
    <div className='relative items-center bg-white p-6 shadow-sm'>
      <div className='absolute top-0 left-6 size-18 h-2/3 w-1/4 rounded-b-full bg-radial-[at_1%] from-[#0078D4]/0 to-[#0078D4]/5 to-5%'></div>
      <div className='grid grid-cols-3 gap-4'>
        <ComboBox
          label='Consumer Number / Legacy Code'
          url={`/api/consumer-number?q=`}
          setValue={setSelectedConnection}
          value={selectedConnection}
          dataKey='connection_id'
          displayKey='consumer_number'
          displayValue2='consumer_legacy_code'
          placeholder='Search By Consumer Number / Legacy Code'
        />
        <Input
          type='text'
          label='Group'
          placeholder='Search By Group Name'
          value={formData.group}
          setValue={setFormValue('group')}
        />
        <SelectList
          label='Status'
          list={status}
          dataKey='value'
          displayKey='label'
          value={formData.settled}
          setValue={setFormValue('settled')}
          showAllOption
          allOptionText='All'
        />
        <Datepicker
          label='Date From'
          value={formData.date_from}
          setValue={setFormValue('date_from')}
        />
        <Datepicker
          label='Date To'
          value={formData.date_to}
          setValue={setFormValue('date_to')}
        />
      </div>
      <div className='grid grid-cols-3 gap-4 py-3'>
        <Button
          variant='default'
          onClick={handleSearch}
          className='col-span-1'
        >
          Search
        </Button>
      </div>
      <div className='h-half absolute right-0 bottom-0 size-18 w-1/12 rounded-tl-full bg-radial-[at_1%_1%] from-[#0078D4]/30 to-[#0078D4]/5 to-90%'></div>
    </div>
  )
}

export default SdRegisterIndexSearch
