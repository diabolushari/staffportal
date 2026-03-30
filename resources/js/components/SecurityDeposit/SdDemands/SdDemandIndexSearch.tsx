import useCustomForm from '@/hooks/useCustomForm'
import { Connection } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import ComboBox from '@/ui/form/ComboBox'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

interface Props {
  oldConnection?: Connection
  oldCalculationBasicId?: string
  oldStatusId?: string
  oldDemandTypeId?: string
  oldTotalSdAmount?: string
  calculationBasics: ParameterValues[]
  demandTypes: ParameterValues[]
}

const SdDemandIndexSearch = ({
  oldConnection,
  oldCalculationBasicId,
  oldDemandTypeId,
  oldTotalSdAmount,
  calculationBasics,
  demandTypes,
}: Readonly<Props>) => {
  const { formData, setFormValue } = useCustomForm({
    connection_id: oldConnection?.connection_id ?? '',
    calculation_basic_id: oldCalculationBasicId ?? '',
    demand_type_id: oldDemandTypeId ?? '',
    total_sd_amount: oldTotalSdAmount ?? '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.get(route('sd-demands.index'), formData)
  }
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(
    oldConnection ?? null
  )
  useEffect(() => {
    if (selectedConnection) {
      setFormValue('connection_id')(selectedConnection?.connection_id ?? '')
    } else if (!selectedConnection) {
      setFormValue('connection_id')('')
    }
  }, [selectedConnection, setFormValue])

  return (
    <div className='relative flex flex-col items-center bg-white p-6 shadow-sm'>
      <div className='absolute top-0 left-6 size-18 h-2/3 w-1/4 rounded-b-full bg-radial-[at_1%] from-[#0078D4]/0 to-[#0078D4]/5 to-5%'></div>
      <div className='flex w-full flex-col justify-center p-10'>
        <div className='flex w-full items-center justify-center'>
          <form
            action=''
            className='flex w-full flex-col gap-2'
            onSubmit={handleSubmit}
          >
            <div className='grid grid-cols-3 items-end gap-3'>
              <ComboBox
                label='Consumer Number / Legacy Code'
                url={`/api/consumer-number?q=`}
                setValue={(value) => setSelectedConnection(value)}
                value={selectedConnection}
                dataKey='connection_id'
                displayKey='consumer_number'
                displayValue2='consumer_legacy_code'
                placeholder='Enter Consumer Number / Legacy Code'
              />

              <SelectList
                allOptionText='All Demand Types'
                showAllOption
                value={formData.demand_type_id}
                setValue={setFormValue('demand_type_id')}
                list={demandTypes}
                dataKey='id'
                displayKey='parameter_value'
              />

              <SelectList
                allOptionText='All Calculation Basics'
                showAllOption
                value={formData.calculation_basic_id}
                setValue={setFormValue('calculation_basic_id')}
                list={calculationBasics}
                dataKey='id'
                displayKey='parameter_value'
              />

              <Input
                label=''
                setValue={setFormValue('total_sd_amount')}
                value={formData.total_sd_amount}
                showClearButton
                placeholder='Search by total sd amount'
                className='w-full'
              />
            </div>
            <div className='grid grid-cols-6 gap-4'>
              <div className='col-start-1 col-end-3'>
                <Button
                  className='w-full'
                  label='Search'
                  type='submit'
                />
              </div>
              {(oldConnection || oldCalculationBasicId || oldDemandTypeId || oldTotalSdAmount) && (
                <div className='col-span-2 col-end-7'>
                  <Button
                    label='Clear Filters'
                    type='button'
                    variant='link'
                    onClick={(e) => {
                      e.preventDefault()
                      router.get(route('sd-demands.index'))
                    }}
                  />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className='h-half absolute right-0 bottom-0 size-18 w-1/12 rounded-tl-full bg-radial-[at_1%_1%] from-[#0078D4]/30 to-[#0078D4]/5 to-90%'></div>
    </div>
  )
}

export default SdDemandIndexSearch
