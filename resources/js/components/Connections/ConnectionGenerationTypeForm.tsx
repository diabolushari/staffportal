import FormCard from '@/ui/Card/FormCard'
import { GroupedFlags } from './useConnectionFlagForm'
import StrongText from '@/typography/StrongText'
import CheckBox from '@/ui/form/CheckBox'
import SelectList from '@/ui/form/SelectList'
import { GenerationFormData } from './useConnectionGenerationForm'
import useCustomForm from '@/hooks/useCustomForm'
import { useState } from 'react'

interface Props {
  updateGenerationData: (id: number, value: boolean, label: string) => void
  updateGenerationSubTypeData: (
    id: number,

    generationSubTypeId: number
  ) => void
  generationData: GenerationFormData[]
  prosumers: boolean
}

export default function ConnectionGenerationTypeForm({
  updateGenerationData,
  updateGenerationSubTypeData,
  generationData,
  prosumers,
}: Props) {
  return (
    <>
      {prosumers && (
        <>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
            {generationData.map((indicator) => (
              <div
                key={indicator.id}
                className='space-y-2'
              >
                <CheckBox
                  label={indicator.label}
                  value={indicator.value}
                  toggleValue={() =>
                    updateGenerationData(indicator.id, !indicator.value, indicator.label)
                  }
                />
                {indicator.value && indicator.generation_sub_types.length > 0 && (
                  <SelectList
                    label='Generation Sub Type'
                    list={indicator.generation_sub_types}
                    dataKey='id'
                    displayKey='parameter_value'
                    setValue={(value) => updateGenerationSubTypeData(indicator.id, Number(value))}
                    value={indicator.generation_sub_type_id ?? 0}
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
