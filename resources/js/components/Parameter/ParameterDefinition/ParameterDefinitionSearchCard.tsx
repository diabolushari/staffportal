import { Button } from '@/components/ui/button'
import FilterBox from '@/components/ui/filterbox'
import useCustomForm from '@/hooks/useCustomForm'
import { ParameterDomain, SystemModule } from '@/interfaces/parameter_types'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

interface Props {
  search?: string
  filters?: Record<string, string | number>
  systemModules: SystemModule[]
  parameterDomains: ParameterDomain[]
}

export default function ParameterDefinitionSearchCard({
  search,
  filters,
  systemModules,
  parameterDomains,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    module_name: filters?.module_name ?? '',
    domain_name: filters?.domain_name ?? '',
    search: search ? search : (filters?.search ?? ''),
  })

  const [filteredParameterDomains, setFilteredParameterDomains] =
    useState<ParameterDomain[]>(parameterDomains)

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.get(route('parameter-definition.index'), formData)
  }

  const handleFilter = () => {
    router.get(route('parameter-definition.index'), formData)
  }

  const selectedModule = systemModules.find(
    (module) => String(module.name) === String(filters?.module_name)
  )

  return (
    <div className='relative grid grid-cols-8 rounded-2xl bg-white p-6 shadow-sm'>
      <div className='pointer-events-none absolute inset-0 grid grid-cols-8'>
        <div className='col-span-2 ml-6 h-2/3 rounded-b-full bg-radial-[at_1%] from-[#0078D4]/0 to-[#0078D4]/5 to-5%' />
        <div className='col-span-5' />
        <div className='col-span-1 h-1/2 self-end rounded-tl-full bg-radial-[at_1%_1%] from-[#0078D4]/30 to-[#0078D4]/5 to-90%' />
      </div>

      <div className='col-span-4 flex flex-col gap-4 py-6'>
        <form
          onSubmit={handleSubmit}
          className='w-full'
        >
          <div className='flex items-center gap-5'>
            <div>
              <Input
                label=''
                setValue={setFormValue('search')}
                value={formData.search}
                showClearButton
                placeholder='Find Parameter Definitions'
                style='google'
                className='max-w-full'
              />
            </div>

            <div>
              <Button
                type='submit'
                className='max-w-full'
              >
                Search
              </Button>
            </div>
          </div>
        </form>

        <div className='flex flex-col gap-3'>
          {/* Applied filters */}
          <div className='flex flex-wrap gap-2'>
            {filters?.module_name && selectedModule && (
              <FilterBox
                label='Module'
                value={filters?.module_name.toString()}
                onRemove={() =>
                  router.get(route('parameter-definition.index'), {
                    search: formData.search,
                    domain_name: formData.domain_name,
                    module_name: '',
                  })
                }
              />
            )}

            {filters?.domain_name && (
              <FilterBox
                label='Domain'
                value={filters?.domain_name.toString()}
                onRemove={() =>
                  router.get(route('parameter-definition.index'), {
                    search: formData.search,
                    domain_name: '',
                    module_name: formData.module_name,
                  })
                }
              />
            )}
          </div>

          {/* Clear filters */}
          <Button
            onClick={() => router.get(route('parameter-definition.index'))}
            variant='link'
            className='w-fit px-0'
          >
            Clear filters
          </Button>
        </div>
      </div>

      <div className='relative col-span-4 flex justify-end pt-4'>
        <div className='border-kseb-line w-full rounded-b-md border bg-white p-5 shadow-sm'>
          <div className='flex flex-col gap-4'>
            <span className='context-subtitle'>Filters</span>

            <SelectList
              list={systemModules}
              dataKey='name'
              displayKey='name'
              setValue={setFormValue('module_name')}
              value={formData.module_name}
              label=''
              showAllOption
              allOptionText='All Modules'
            />
            {parameterDomains && (
              <SelectList
                list={filteredParameterDomains}
                dataKey='domain_name'
                displayKey='domain_name'
                setValue={setFormValue('domain_name')}
                value={formData.domain_name}
                label=''
                showAllOption
                allOptionText='All Domains'
              />
            )}
            <div className='ml-auto pt-2'>
              <Button
                onClick={handleFilter}
                variant='outline'
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
