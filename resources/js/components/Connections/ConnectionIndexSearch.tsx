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
  connectionTypes: ParameterValues[]
  tariffs: ParameterValues[]
  oldConsumerNumber?: string
  oldOffice?: OfficeWithHierarchy
  oldFromDate?: string
  oldToDate?: string
  oldConsumerLegacyCode?: string
  oldConsumerName?: string
  oldOrganisationName?: string
  oldConnectionTypeId?: string
  oldPrimaryPhone?: string
  oldTariffId?: string
}

const ConnectionIndexSearch = ({
  connectionTypes,
  tariffs,
  oldConsumerNumber,
  oldOffice,
  oldFromDate,
  oldToDate,
  oldConsumerLegacyCode,
  oldConsumerName,
  oldOrganisationName,
  oldConnectionTypeId,
  oldPrimaryPhone,
  oldTariffId,
}: Readonly<Props>) => {
  const { formData, setFormValue } = useCustomForm({
    consumer_number: oldConsumerNumber ?? '',
    office_code: oldOffice?.office_code ?? '',
    from_date: oldFromDate ?? '',
    to_date: oldToDate ?? '',
    consumer_legacy_code: oldConsumerLegacyCode ?? '',
    consumer_name: oldConsumerName ?? '',
    organisation_name: oldOrganisationName ?? '',
    connection_type_id: oldConnectionTypeId ?? '',
    tariff_id: oldTariffId ?? '',
    primary_phone: oldPrimaryPhone ?? '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.get(route('connections.index'), formData)
  }
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(oldOffice?.office ?? null)
  useEffect(() => {
    if (selectedOffice) {
      setFormValue('office_code')(selectedOffice?.office_code ?? '')
    } else if (!selectedOffice) {
      setFormValue('office_code')('')
    }
  }, [selectedOffice, setFormValue])

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
              <Input
                label=''
                setValue={setFormValue('consumer_number')}
                value={formData.consumer_number}
                showClearButton={true}
                placeholder='Search by consumer number'
                className='w-full'
              />

              <ComboBox
                label=''
                url={`/api/offices?q=`}
                setValue={setSelectedOffice}
                value={selectedOffice}
                dataKey='office_code'
                displayKey='office_name'
                displayValue2='office_code'
                placeholder='Search by Office'
                className='w-full'
              />
              <SelectList
                allOptionText='All Connection Types'
                showAllOption
                value={formData.connection_type_id}
                setValue={setFormValue('connection_type_id')}
                list={connectionTypes}
                dataKey='id'
                displayKey='parameter_value'
              />

              <SelectList
                allOptionText='All Tariffs'
                showAllOption
                value={formData.tariff_id}
                setValue={setFormValue('tariff_id')}
                list={tariffs}
                dataKey='id'
                displayKey='parameter_value'
              />
              <Input
                label=''
                setValue={setFormValue('consumer_legacy_code')}
                value={formData.consumer_legacy_code}
                showClearButton
                placeholder='Search by legacy code'
                className='w-full'
              />
              <Input
                label=''
                setValue={setFormValue('consumer_name')}
                value={formData.consumer_name}
                showClearButton
                placeholder='Search by consumer name'
                className='w-full'
              />

              <Input
                label=''
                setValue={setFormValue('organisation_name')}
                value={formData.organisation_name}
                showClearButton
                placeholder='Search by organisation name'
                className='w-full'
              />
              <Input
                label=''
                setValue={setFormValue('primary_phone')}
                value={formData.primary_phone}
                showClearButton
                placeholder='Search by Primary Phone'
                className='w-full'
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
              {(oldConsumerNumber ||
                oldOffice ||
                oldConnectionTypeId ||
                oldConsumerLegacyCode ||
                oldConsumerName ||
                oldOrganisationName ||
                oldPrimaryPhone ||
                oldTariffId ||
                oldFromDate ||
                oldToDate) && (
                <div className='col-span-2 col-end-7'>
                  <Button
                    label='Clear Filters'
                    type='button'
                    variant='link'
                    onClick={() => router.get(route('connections.index'))}
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

export default ConnectionIndexSearch
