import { router } from '@inertiajs/react'
import useCustomForm from '@/hooks/useCustomForm'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import Datepicker from '@/ui/form/DatePicker'
import Button from '@/ui/button/Button'
import { ParameterValues } from '@/interfaces/parameter_types'

interface StationTransactionFilters {
  transaction_type_id?: string
  consumer_number?: string
  date_from?: string
  date_to?: string
}

interface Props {
  filters: StationTransactionFilters
  transactionTypes: ParameterValues[]
  stationId: number
}

export default function StationTransactionSearch({ filters, transactionTypes, stationId }: Props) {
  const { formData, setFormValue } = useCustomForm({
    transaction_type_id: filters?.transaction_type_id ?? '',
    consumer_number: filters?.consumer_number ?? '',
    date_from: filters?.date_from ?? '',
    date_to: filters?.date_to ?? '',
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    router.get(`/generating-stations/${stationId}/transactions`, formData)
  }
  console.log('transactionTypes:', transactionTypes)

  return (
    <form
      onSubmit={handleSearch}
      className='mb-4 space-y-3'
    >
      {/* Row 1 */}
      <div className='grid w-3/4 grid-cols-2 gap-3'>
        <SelectList
          list={transactionTypes}
          value={formData.transaction_type_id}
          setValue={setFormValue('transaction_type_id')}
          dataKey='id'
          displayKey='parameter_value'
          showAllOption
          allOptionText='Search by Transaction Type'
        />

        <Input
          placeholder='Search by Consumer Number'
          value={formData.consumer_number}
          setValue={setFormValue('consumer_number')}
        />
      </div>

      {/* Row 2 */}
      <div className='grid w-3/4 grid-cols-[1fr_1fr_auto] items-end gap-3'>
        <Datepicker
          value={formData.date_from}
          setValue={setFormValue('date_from')}
          placeholder='Date From'
        />

        <Datepicker
          value={formData.date_to}
          setValue={setFormValue('date_to')}
          placeholder='Date To'
          min={formData.date_from}
        />

        <Button
          label='Search'
          type='submit'
        />
      </div>

      {/* Clear button (conditional) */}
      {(filters?.transaction_type_id ||
        filters?.consumer_number ||
        filters?.date_from ||
        filters?.date_to) && (
        <div className='w-3/4'>
          <Button
            label='Clear Filters'
            type='button'
            variant='link'
            onClick={() => router.get(`/generating-stations/${stationId}/transactions`)}
          />
        </div>
      )}
    </form>
  )
}
