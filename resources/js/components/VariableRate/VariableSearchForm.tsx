import useCustomForm from '@/hooks/useCustomForm'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import ComboBox from '@/ui/form/ComboBox'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

interface Props {
  filters?: {
    search: string | null
    order_by: string | null
    order_direction: string | null
    oldVariableName: ParameterValues | null
  }
}

export default function VariableRateSearch({ filters }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    variable_name_id: filters?.oldVariableName?.id?.toString() ?? '',
  })
  const [selectedVariableRate, setSelectedVariableRate] = useState<ParameterValues | null>(
    filters?.oldVariableName ?? null
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.get(route('variable-rates.index', formData))
  }
  useEffect(() => {
    if (!selectedVariableRate) return
    setFormValue('variable_name_id')(selectedVariableRate?.id?.toString() ?? '')
  }, [selectedVariableRate])

  const clearFilters = () => {
    setSelectedVariableRate(null)
    setFormValue('variable_name_id')('')
    router.get(route('variable-rates.index'))
  }
  const filterApplied = formData.variable_name_id

  return (
    <div className='relative flex flex-col items-center rounded bg-white p-6 shadow-sm'>
      <div className='absolute top-0 left-6 size-18 h-2/3 w-1/4 rounded-b-full bg-radial-[at_1%] from-[#0078D4]/0 to-[#0078D4]/5 to-5%'></div>
      <div className='flex w-full flex-col justify-center p-10'>
        <div className='flex w-full items-center justify-center'>
          <div className='w-full'>
            <div className='relative grid w-full grid-cols-3 items-center justify-center gap-x-6 gap-y-5'>
              <ComboBox
                label=''
                value={selectedVariableRate}
                setValue={setSelectedVariableRate}
                placeholder='Eg: Green'
                dataKey='id'
                displayKey='parameter_value'
                displayValue2='parameter_code'
                url='/api/parameter-values?domain_name=Billing&parameter_name=Variable Name&search='
              />

              <Button
                label='Search'
                type='button'
                onClick={(e) => handleSubmit(e)}
              />
              {filterApplied && (
                <button
                  className='link-button-text'
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='h-half absolute right-0 bottom-0 size-18 w-1/12 rounded-tl-full bg-radial-[at_1%_1%] from-[#0078D4]/30 to-[#0078D4]/5 to-90%'></div>
    </div>
  )
}
