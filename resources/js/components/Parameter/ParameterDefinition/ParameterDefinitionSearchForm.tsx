import useCustomForm from '@/hooks/useCustomForm'
import { ParameterDomain, SystemModule } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { route } from 'ziggy-js'

interface Props {
  parameterDomains: ParameterDomain[]
  systemModules: SystemModule[]
  filters: {
    search: string
    domain_name: string
    module_name: string
  }
}

export default function ParameterDefinitionSearchForm({
  parameterDomains,
  systemModules,
  filters,
}: Readonly<Props>) {
  const [filteredParameterDomains, setFilteredParameterDomains] =
    useState<ParameterDomain[]>(parameterDomains)

  const { formData, setFormValue } = useCustomForm({
    domain_name: filters.domain_name ?? '',
    module_name: filters.module_name ?? '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.get(route('parameter-definition.index', formData))
  }

  useEffect(() => {
    const selectedModuleId = formData.module_name
      ? (systemModules.find((module) => module.name === formData.module_name)?.id ?? null)
      : null

    if (selectedModuleId) {
      setFilteredParameterDomains(
        parameterDomains.filter((domain) => domain.managed_by_module === selectedModuleId)
      )
    } else {
      setFilteredParameterDomains(parameterDomains)
    }
  }, [formData.module_name, systemModules, parameterDomains])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='flex justify-between'>
          <div className='grid w-2/3 items-end gap-2 md:grid-cols-3'>
            <div>
              {systemModules && (
                <SelectList
                  list={systemModules}
                  dataKey='name'
                  displayKey='name'
                  setValue={setFormValue('module_name')}
                  value={formData.module_name}
                  label='System Module'
                  showAllOption
                  allOptionText='All Modules'
                />
              )}
            </div>
            <div className='flex flex-col'>
              {parameterDomains && (
                <SelectList
                  list={filteredParameterDomains}
                  dataKey='domain_name'
                  displayKey='domain_name'
                  setValue={setFormValue('domain_name')}
                  value={formData.domain_name}
                  label='Parameter Domain'
                  showAllOption
                  allOptionText='All Domains'
                />
              )}
            </div>

            <div className='flex flex-col'>
              <Button
                label='Apply'
                type='submit'
                variant='tertiary'
              />
            </div>
          </div>
          <div className='mt-6 flex flex-col items-center justify-center'>
            <Button
              label='Clear filters'
              variant='link'
              type='button'
              onClick={() =>
                router.get(route('parameter-definition.index'), {
                  search: '',
                  domain_name: '',
                  module_name: '',
                })
              }
            />
          </div>
        </div>
      </form>
    </div>
  )
}
