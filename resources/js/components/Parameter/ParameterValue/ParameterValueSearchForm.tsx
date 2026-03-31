import useCustomForm from '@/hooks/useCustomForm'
import useFetchRecord from '@/hooks/useFetchRecord'
import { ParameterDefinition, ParameterDomain } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { route } from 'ziggy-js'

interface Props {
  parameterDomains: ParameterDomain[]
  parameterDefinitions: ParameterDefinition[]
  filters: {
    search: string
    domain_name: string
    parameter_name: string
  }
}

export default function ParameterValueSearchForm({
  parameterDomains,
  parameterDefinitions,
  filters,
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

  return (
    <div className='flex items-center justify-between gap-2'>
      <form onSubmit={handleSubmit}>
        <div className='grid w-2/3 items-end gap-2 md:grid-cols-3'>
          <div className='flex flex-col'>
            {parameterDomains && (
              <SelectList
                list={parameterDomains}
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
            {parameterDefinitionData && (
              <SelectList
                list={parameterDefinitionData}
                dataKey='parameter_name'
                displayKey='parameter_name'
                setValue={setFormValue('parameter_name')}
                value={formData.parameter_name}
                label='Parameter Definition'
                showAllOption
                allOptionText='All Definitions'
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
      </form>
      <Button
        label='Clear Filter'
        variant='link'
        onClick={() => {
          setFormValue('search')('')
          setFormValue('domain_name')('')
          setFormValue('parameter_name')('')
          router.get(route('parameter-value.index'))
        }}
      />
    </div>
  )
}
