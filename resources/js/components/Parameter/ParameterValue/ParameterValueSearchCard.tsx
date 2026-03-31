import { Button } from '@/components/ui/button'
import FilterBox from '@/components/ui/filterbox'
import useCustomForm from '@/hooks/useCustomForm'
import useFetchRecord from '@/hooks/useFetchRecord'
import { ParameterDefinition, ParameterDomain } from '@/interfaces/parameter_types'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

interface Props {
  parameterDomains: ParameterDomain[]
  parameterDefinitions: ParameterDefinition[]
  filters: {
    search: string
    domain_name: string
    parameter_name: string
  }
}

export default function ParameterValueSearchCard({
  filters,
  parameterDomains,
  parameterDefinitions,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    domain_name: filters.domain_name ?? '',
    parameter_name: filters.parameter_name ?? '',
    search: filters.search ?? '',
  })

  const [parameterDefinitionData, setParameterDefinitionData] = useState<
    ParameterDefinition[] | null
  >(null)

  const [parameterDefinitionsApiData] = useFetchRecord<ParameterDefinition[]>(
    formData.domain_name ? 'api/parameter-definitions?domain_name=' + formData.domain_name : ''
  )

  useEffect(() => {
    if (formData.domain_name) {
      setParameterDefinitionData(parameterDefinitionsApiData)
    } else {
      setParameterDefinitionData(parameterDefinitions)
    }
  }, [parameterDefinitionsApiData, parameterDefinitions])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.get(route('parameter-value.index', formData))
  }

  const handleFilter = () => {
    router.get(route('parameter-value.index'), formData)
  }

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
                placeholder='Find Parameter Values'
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
            {filters?.domain_name && (
              <FilterBox
                label='Domain'
                value={filters?.domain_name.toString()}
                onRemove={() =>
                  router.get(route('parameter-value.index'), {
                    search: formData.search,
                    domain_name: '',
                    parameter_name: formData.parameter_name,
                  })
                }
              />
            )}

            {filters?.parameter_name && (
              <FilterBox
                label='Definition'
                value={filters?.parameter_name.toString()}
                onRemove={() =>
                  router.get(route('parameter-value.index'), {
                    search: formData.search,
                    domain_name: formData.domain_name,
                    parameter_name: '',
                  })
                }
              />
            )}
          </div>
          {/* Clear filters */}
          {(filters?.domain_name || filters?.parameter_name || filters?.search) && (
            <Button
              onClick={() => router.get(route('parameter-value.index'))}
              variant='link'
              className='w-fit px-0'
            >
              Clear filters
            </Button>
          )}{' '}
        </div>
      </div>

      <div className='relative col-span-4 flex justify-end pt-4'>
        <div className='border-kseb-line w-full rounded-b-md border bg-white p-5 shadow-sm'>
          <div className='flex flex-col gap-4'>
            <span className='context-subtitle'>Filters</span>

            {parameterDomains && (
              <SelectList
                list={parameterDomains}
                dataKey='domain_name'
                displayKey='domain_name'
                setValue={setFormValue('domain_name')}
                value={formData.domain_name}
                label=''
                showAllOption
                allOptionText='All Domains'
              />
            )}
            {parameterDefinitionData && (
              <SelectList
                list={parameterDefinitionData}
                dataKey='parameter_name'
                displayKey='parameter_name'
                setValue={setFormValue('parameter_name')}
                value={formData.parameter_name}
                label=''
                showAllOption
                allOptionText='All Definitions'
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
