import StrongText from '@/typography/StrongText'
import Input from '@/ui/form/Input'
import { router } from '@inertiajs/react'
import useCustomForm from '@/hooks/useCustomForm'
import Button from '@/ui/button/Button'
import { Office, OfficeWithHierarchy } from '@/interfaces/data_interfaces'
import { useEffect, useState } from 'react'
import ComboBox from '@/ui/form/ComboBox'
import { ParameterValues } from '@/interfaces/parameter_types'
import { P, p } from 'node_modules/framer-motion/dist/types.d-Bq-Qm38R'
import SelectList from '@/ui/form/SelectList'
import Datepicker from '@/ui/form/DatePicker'

interface ConnectionSearchForm {
  consumer_number?: string
  consumer_legacy_code?: string
  consumer_name?: string
  organisation_name?: string

  connection_type_id?: string
  consumer_type_id?: string

  tariff_id?: string

  office_code?: string
  from_date?: string
  to_date?: string
  primarty_phone?: string
}

interface Props {
  oldTariff?: ParameterValues
  oldPurpose?: ParameterValues
  oldFromDate?: string
  oldToDate?: string
}

export default function PurposeInfoSearchForm({
  oldTariff,
  oldPurpose,
  oldFromDate,
  oldToDate,
}: Readonly<Props>) {
  const [selectedTariff, setSelectedTariff] = useState<ParameterValues | null>(oldTariff ?? null)
  const [selectedPurpose, setSelectedPurpose] = useState<ParameterValues | null>(oldPurpose ?? null)
  const { formData, setFormValue } = useCustomForm({
    tariff_id: oldTariff?.id ?? '',
    purpose_id: oldPurpose?.id ?? '',
    from_date: oldFromDate ?? '',
    to_date: oldToDate ?? '',
  })

  useEffect(() => {
    setFormValue('tariff_id')(selectedTariff?.id ?? '')
    setFormValue('purpose_id')(selectedPurpose?.id ?? '')
  }, [selectedTariff, selectedPurpose])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.get(route('tariff-mappings.index'), formData)
  }

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
                label='Purpose'
                value={selectedPurpose}
                setValue={setSelectedPurpose}
                placeholder='Search Purpose'
                dataKey='id'
                displayKey='parameter_value'
                displayValue2='parameter_code'
                url='/api/parameter-values?domain_name=Connection&parameter_name=Primary Purpose&search='
              />
              <ComboBox
                label='Tariff'
                value={selectedTariff}
                setValue={setSelectedTariff}
                placeholder='Search Tariff'
                dataKey='id'
                displayKey='parameter_value'
                displayValue2='parameter_code'
                url='/api/parameter-values?domain_name=Connection&parameter_name=Tariff&search='
              />

              <Datepicker
                value={formData.from_date}
                setValue={setFormValue('from_date')}
                placeholder='From date'
              />

              <Datepicker
                value={formData.to_date}
                setValue={setFormValue('to_date')}
                placeholder='To date'
                min={formData.from_date}
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
              {(oldFromDate || oldToDate || oldPurpose || oldTariff) && (
                <div className='col-span-2 col-end-7'>
                  <Button
                    label='Clear Filters'
                    type='button'
                    variant='link'
                    onClick={() => router.get(route('tariff-mappings.index'))}
                  />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
