import StrongText from '@/typography/StrongText'
import { Card } from '../ui/card'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { RegionOption } from '@/interfaces/data_interfaces'

interface Props {
  title: string
  address: any
  districts: RegionOption[]
  states: RegionOption[]
  onChange: any
  onRemove: any
}

export default function AddressCard({
  title,
  address,
  districts,
  states,
  onChange,
  onRemove,
}: Props) {
  return (
    <Card className='col-span-2'>
      <div className='flex items-center justify-between border-b-2 border-gray-200 py-3'>
        <StrongText className='text-base font-semibold'>{title}</StrongText>
        <button
          type='button'
          className='text-sm text-red-500 hover:text-red-700'
          onClick={onRemove}
        >
          Remove
        </button>
      </div>

      <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
        <Input
          label='Address Line1'
          value={address?.address_line1 ?? ''}
          setValue={(v) => onChange('address_line1', v)}
        />
        <Input
          label='Address Line2'
          value={address?.address_line2 ?? ''}
          setValue={(v) => onChange('address_line2', v)}
        />
        <Input
          label='City / Town / Village'
          value={address?.city_town_village ?? ''}
          setValue={(v) => onChange('city_town_village', v)}
        />
        <Input
          label='Pincode'
          type='number'
          value={address?.pincode ?? ''}
          setValue={(v) => onChange('pincode', v)}
        />

        {districts && (
          <SelectList
            label='District'
            list={districts}
            dataKey='region_id'
            displayKey='region_name'
            value={address?.district_id ?? ''}
            setValue={(v) => onChange('district_id', v)}
          />
        )}

        {states && (
          <SelectList
            label='State'
            list={states}
            dataKey='region_id'
            displayKey='region_name'
            value={address?.state_id ?? ''}
            setValue={(v) => onChange('state_id', v)}
          />
        )}
      </div>
    </Card>
  )
}
