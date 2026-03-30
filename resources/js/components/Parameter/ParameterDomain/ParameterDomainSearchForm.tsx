import useCustomForm from '@/hooks/useCustomForm'
import { SystemModule } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { route } from 'ziggy-js'

interface Props {
  systemModules: SystemModule[]
  filters: {
    search: string
    module_id: string
  }
}

export default function ParameterDomainSearchForm({ systemModules, filters }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    module_id: filters.module_id?.toString() ?? '',
    search: filters.search ?? '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.get(route('parameter-domain.index', formData))
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='grid w-2/3 items-end gap-2 md:grid-cols-3'>
          <div className='relative flex flex-col'>
            <SelectList
              list={systemModules}
              dataKey='id'
              displayKey='name'
              setValue={setFormValue('module_id')}
              value={formData.module_id}
              label='System Module'
              showAllOption
              allOptionText='All Modules'
            />
          </div>

          <div className='flex flex-col'>
            <Button
              label='Apply'
              type='submit'
              variant='tertiary'
            />
          </div>
        </div>
      </form>
    </div>
  )
}
