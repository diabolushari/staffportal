import useCustomForm from '@/hooks/useCustomForm'
import { PrimarySecondaryRatio } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'

interface MeterTransformerSearchProps {
  ctpt_serial?: string
  make_id?: string
  type_id?: string
  ownership_type_id?: string
  ratio?: string
}

interface Props {
  oldCtptSerial?: string
  oldMakeId?: string
  oldTypeId?: string
  oldOwnershipTypeId?: string
  oldRatio?: string
  types: ParameterValues[]
  makes: ParameterValues[]
  ownershipTypes: ParameterValues[]
  ratios: PrimarySecondaryRatio[]
}

const MeterTransformerSearch = ({
  oldCtptSerial,
  oldMakeId,
  oldTypeId,
  oldOwnershipTypeId,
  types,
  makes,
  ownershipTypes,
  ratios,
  oldRatio,
}: Readonly<Props>) => {
  const { formData, setFormValue } = useCustomForm<MeterTransformerSearchProps>({
    ctpt_serial: oldCtptSerial,
    make_id: oldMakeId,
    type_id: oldTypeId,
    ownership_type_id: oldOwnershipTypeId,
    ratio: oldRatio,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.get(route('meter-ctpt.index'), formData)
  }

  const filterApplied = Boolean(
    oldCtptSerial || oldMakeId || oldTypeId || oldOwnershipTypeId || oldRatio
  )

  return (
    <div>
      <div className='relative flex flex-col items-center rounded bg-white p-6 shadow-sm'>
        <div className='absolute top-0 left-6 size-18 h-2/3 w-1/4 rounded-b-full bg-radial-[at_1%] from-[#0078D4]/0 to-[#0078D4]/5 to-5%'></div>
        <div className='flex w-full flex-col justify-center p-10'>
          <div className='flex w-full items-center justify-center'>
            <div className='w-full'>
              <div className='relative grid w-full grid-cols-3 gap-x-6 gap-y-5'>
                <Input
                  placeholder='Search by CTPT Serial'
                  value={formData.ctpt_serial}
                  setValue={setFormValue('ctpt_serial')}
                />

                <SelectList
                  label=''
                  value={formData.type_id}
                  setValue={setFormValue('type_id')}
                  list={types}
                  dataKey='id'
                  displayKey='parameter_value'
                  showAllOption
                  allOptionText='All Types'
                />
                <SelectList
                  label=''
                  value={formData.make_id}
                  setValue={setFormValue('make_id')}
                  list={makes}
                  dataKey='id'
                  displayKey='parameter_value'
                  showAllOption
                  allOptionText='All Makes'
                />
                <SelectList
                  label=''
                  value={formData.ownership_type_id}
                  setValue={setFormValue('ownership_type_id')}
                  list={ownershipTypes}
                  dataKey='id'
                  displayKey='parameter_value'
                  showAllOption
                  allOptionText='All Ownership Types'
                />
                <SelectList
                  label=''
                  value={formData.ratio}
                  setValue={setFormValue('ratio')}
                  list={ratios}
                  dataKey='ratio'
                  displayKey='ratio'
                  showAllOption
                  allOptionText='All Ratios'
                />

                <Button
                  label='Search'
                  type='submit'
                  onClick={(e) => handleSubmit(e)}
                />
                {filterApplied && (
                  <button
                    className='link-button-text'
                    onClick={() => router.get(route('meter-ctpt.index'))}
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
    </div>
  )
}

export default MeterTransformerSearch
