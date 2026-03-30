import useCustomForm from '@/hooks/useCustomForm'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import ComboBox from '@/ui/form/ComboBox'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { useState } from 'react'

interface MeterSearchProps {
  smart_meter_ind?: boolean
  bidirectional_ind?: boolean
  meter_serial?: string
  meter_type_id?: string
  meter_profile_id?: string
  meter_make_id?: string
  ownership_type_id?: string
  programmable_ct_ratio?: string
  programmable_pt_ratio?: string
}
interface Props {
  types: ParameterValues[]
  meterProfiles: ParameterValues[]
  ownershipTypes: ParameterValues[]
  oldMeterSerial: string
  oldSmartMeterInd: boolean
  oldBidirectionalInd: boolean
  oldMeterTypeId: string
  oldMeterProfileId: string
  oldMeterMakeId: string
  oldOwnershipTypeId: string
  oldProgrammableCtRatio: string
  oldProgrammablePtRatio: string
}

export default function MeterSearch({
  types,
  meterProfiles,
  ownershipTypes,
  oldMeterSerial,
  oldSmartMeterInd,
  oldBidirectionalInd,
  oldMeterTypeId,
  oldMeterProfileId,
  oldMeterMakeId,
  oldOwnershipTypeId,
  oldProgrammableCtRatio,
  oldProgrammablePtRatio,
}: Readonly<Props>) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm<MeterSearchProps>({
    smart_meter_ind: oldSmartMeterInd ?? false,
    bidirectional_ind: oldBidirectionalInd ?? false,
    meter_serial: oldMeterSerial,
    meter_type_id: oldMeterTypeId,
    meter_profile_id: oldMeterProfileId,
    meter_make_id: oldMeterMakeId,
    ownership_type_id: oldOwnershipTypeId,
    programmable_ct_ratio: oldProgrammableCtRatio,
    programmable_pt_ratio: oldProgrammablePtRatio,
  })
  const [selectedMeterMake, setSelectedMeterMake] = useState<ParameterValues | null>(null)

  const filterApplied =
    oldSmartMeterInd ||
    oldBidirectionalInd ||
    oldMeterSerial ||
    oldMeterTypeId ||
    oldMeterProfileId ||
    oldMeterMakeId ||
    oldOwnershipTypeId ||
    oldProgrammableCtRatio ||
    oldProgrammablePtRatio

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.get(route('meters.index'), formData)
  }

  return (
    <div className='relative flex flex-col items-center rounded bg-white p-6 shadow-sm'>
      <div className='absolute top-0 left-6 size-18 h-2/3 w-1/4 rounded-b-full bg-radial-[at_1%] from-[#0078D4]/0 to-[#0078D4]/5 to-5%'></div>
      <div className='flex w-full flex-col justify-center p-10'>
        <div className='flex w-full items-center justify-center'>
          <div className='w-full'>
            <div className='relative grid w-full grid-cols-3 gap-x-6 gap-y-5'>
              <div className='col-span-1 flex items-center pt-6'>
                <CheckBox
                  label='Smart Meter'
                  value={formData.smart_meter_ind}
                  toggleValue={toggleBoolean('smart_meter_ind')}
                />
              </div>

              <div className='col-span-1 flex items-center pt-6'>
                <CheckBox
                  label='Bidirectional'
                  value={formData.bidirectional_ind}
                  toggleValue={toggleBoolean('bidirectional_ind')}
                />
              </div>

              <div className='col-span-1'>
                <Input
                  placeholder='Search by Meter Serial'
                  value={formData.meter_serial}
                  setValue={setFormValue('meter_serial')}
                />
              </div>

              <SelectList
                allOptionText='All Meter Types'
                showAllOption
                value={formData.meter_type_id}
                setValue={setFormValue('meter_type_id')}
                list={types}
                dataKey='id'
                displayKey='parameter_value'
              />
              <SelectList
                allOptionText='All Metering Profiles'
                showAllOption
                value={formData.meter_profile_id}
                setValue={setFormValue('meter_profile_id')}
                list={meterProfiles}
                dataKey='id'
                displayKey='parameter_value'
              />
              <ComboBox
                label=''
                value={selectedMeterMake}
                setValue={setSelectedMeterMake}
                placeholder='Search by Meter Make'
                dataKey='id'
                displayKey='parameter_value'
                displayValue2='parameter_value'
                url='/api/parameter-values?domain_name=Meter&parameter_name=Make&attribute_value='
              />
              <SelectList
                allOptionText='All Ownership Types'
                showAllOption
                value={formData.ownership_type_id}
                setValue={setFormValue('ownership_type_id')}
                list={ownershipTypes}
                dataKey='id'
                displayKey='parameter_value'
              />
              <Input
                placeholder='Search by CT Ratio'
                type='number'
                value={formData.programmable_ct_ratio}
                setValue={setFormValue('programmable_ct_ratio')}
              />
              <Input
                placeholder='Search by PT Ratio'
                type='number'
                value={formData.programmable_pt_ratio}
                setValue={setFormValue('programmable_pt_ratio')}
              />
              <Button
                label='Search'
                type='submit'
                onClick={(e) => handleSubmit(e)}
              />
              {filterApplied && (
                <button
                  className='link-button-text'
                  onClick={() => router.get(route('meters.index'))}
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
