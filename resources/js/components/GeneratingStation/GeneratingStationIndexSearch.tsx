import Input from '@/ui/form/Input'
import { router } from '@inertiajs/react'
import useCustomForm from '@/hooks/useCustomForm'
import Button from '@/ui/button/Button'
import SelectList from '@/ui/form/SelectList'
import Datepicker from '@/ui/form/DatePicker'
import { ParameterValues } from '@/interfaces/parameter_types'
import { Filters } from '@/pages/GeneratingStation/GeneratingStationIndex'

interface Props {
  generationTypes: ParameterValues[]
  voltageCategories: ParameterValues[]
  plantTypes: ParameterValues[]
  generationStatuses: ParameterValues[]

  filters: Filters
}

export default function GeneratingStationIndexSearch({
  generationTypes,
  voltageCategories,
  plantTypes,
  generationStatuses,
  filters,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    station_name: filters.station_name ?? '',
    consumer_number: filters.consumer_number ?? '',
    generation_type_id: filters.generation_type_id ?? '',
    voltage_category_id: filters.voltage_category_id ?? '',
    plant_type_id: filters.plant_type_id ?? '',
    generation_status_id: filters.generation_status_id ?? '',
    date_from: filters.date_from ?? '',
    date_to: filters.date_to ?? '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.get('/generating-stations', formData)
  }

  return (
    <div className='relative flex flex-col items-center bg-white p-6 shadow-sm'>
      <div className='absolute top-0 left-6 size-18 h-2/3 w-1/4 rounded-b-full bg-radial-[at_1%] from-[#0078D4]/0 to-[#0078D4]/5 to-5%'></div>
      <div className='flex w-full flex-col justify-center p-10'>
        <div className='flex w-full items-center justify-center'>
          <form
            onSubmit={handleSubmit}
            className='flex w-full flex-col gap-2'
          >
            <div className='grid grid-cols-3 items-end gap-3'>
              <Input
                placeholder='Station Name'
                value={formData.station_name}
                setValue={setFormValue('station_name')}
                showClearButton
                className='w-full'
              />

              <Input
                placeholder='Consumer Number'
                value={formData.consumer_number}
                setValue={setFormValue('consumer_number')}
                showClearButton
                className='w-full'
              />

              <SelectList
                list={generationTypes}
                value={formData.generation_type_id}
                setValue={setFormValue('generation_type_id')}
                dataKey='id'
                displayKey='parameter_value'
                showAllOption
                allOptionText='All Generation Types'
              />

              <SelectList
                list={voltageCategories}
                value={formData.voltage_category_id}
                setValue={setFormValue('voltage_category_id')}
                dataKey='id'
                displayKey='parameter_value'
                showAllOption
                allOptionText='All Voltage Categories'
              />

              <SelectList
                list={plantTypes}
                value={formData.plant_type_id}
                setValue={setFormValue('plant_type_id')}
                dataKey='id'
                displayKey='parameter_value'
                showAllOption
                allOptionText='All Plant Types'
              />

              <SelectList
                list={generationStatuses}
                value={formData.generation_status_id}
                setValue={setFormValue('generation_status_id')}
                dataKey='id'
                displayKey='parameter_value'
                showAllOption
                allOptionText='All Status'
              />

              <Datepicker
                value={formData.date_from}
                setValue={setFormValue('date_from')}
                placeholder='From Date'
              />

              <Datepicker
                value={formData.date_to}
                setValue={setFormValue('date_to')}
                placeholder='To Date'
                min={formData.date_from}
              />
            </div>

            <div className='mt-2 grid grid-cols-6 gap-4'>
              <div className='col-start-1 col-end-3'>
                <Button
                  className='w-full'
                  label='Search'
                  type='submit'
                />
              </div>

              {(filters?.station_name ||
                filters?.consumer_number ||
                filters?.generation_type_id ||
                filters?.voltage_category_id ||
                filters?.plant_type_id ||
                filters?.generation_status_id ||
                filters?.date_from ||
                filters?.date_to) && (
                <div className='col-span-2 col-end-7'>
                  <Button
                    label='Clear Filters'
                    type='button'
                    variant='link'
                    onClick={() => router.get('/generating-stations')}
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
