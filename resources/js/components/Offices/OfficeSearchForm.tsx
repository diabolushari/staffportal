import useCustomForm from '@/hooks/useCustomForm'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { route } from 'ziggy-js'

interface Props {
  office_types: ParameterValues[]
  filters: {
    office_name: string
    office_type: string
  }
  placeholder?: string
}

export default function OfficeSearchForm({ office_types, filters, placeholder }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    office_type: filters.office_type?.toString() ?? '',
    office_name: filters.office_name?.toString() ?? '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.get(route('offices.index', formData))
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='grid w-2/3 items-end gap-2 md:grid-cols-3'>
          <div className='relative flex flex-col'>
            <SelectList
              list={office_types}
              dataKey='parameter_value'
              displayKey='parameter_value'
              setValue={setFormValue('office_type')}
              value={formData.office_type}
              label='Office Type'
              showAllOption
              allOptionText='All Types'
            />
          </div>

          <div className='flex flex-col'>
            <Input
              label='Office Name'
              value={formData.office_name}
              setValue={setFormValue('office_name')}
              showClearButton={true}
              placeholder={placeholder}
            />
          </div>

          <div className='flex flex-col'>
            <Button
              label='Search'
              type='submit'
            />
          </div>
        </div>
      </form>
    </div>
  )
}
