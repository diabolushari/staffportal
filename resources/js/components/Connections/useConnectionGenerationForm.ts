import { ParameterValues } from '@/interfaces/parameter_types'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { ConnectionGenerationType } from '@/interfaces/data_interfaces'

export interface GenerationFormData {
  id: number
  label: string
  value: boolean
  generation_type_id: number
  generation_sub_type_id: number | null
  generation_sub_types: ParameterValues[]
}

export interface GenerationFormProps {
  generationTypes: ParameterValues[]
  initialData?: ConnectionGenerationType[]
}

export default function useConnectionGenerationForm({
  generationTypes,
  initialData,
}: GenerationFormProps) {
  const [generationData, setGenerationData] = useState<GenerationFormData[]>([])

  useEffect(() => {
    if (!generationTypes?.length) return

    const baseData: GenerationFormData[] = generationTypes.map((generationType) => {
      const existing = initialData?.find((data) => data.generation_type_id === generationType.id)

      return {
        id: generationType.id,
        label: generationType.parameter_value,
        value: !!existing,
        generation_type_id: generationType.id,
        generation_sub_type_id: existing?.generation_sub_type_id ?? null,
        generation_sub_types: [],
      }
    })

    setGenerationData(baseData)
  }, [generationTypes, initialData])

  useEffect(() => {
    if (!initialData || generationData.length === 0) return

    const fetchSubTypesOnInit = async () => {
      const updated = await Promise.all(
        generationData.map(async (generation) => {
          if (!generation.value) return generation

          try {
            const response = await axios.get(
              `/api/parameter-values?attribute_name=attribute1Value&attribute_value=${generation.label}`
            )

            return {
              ...generation,
              generation_sub_types: response.data,
            }
          } catch (error) {
            console.error(`Failed to fetch sub-types for ${generation.label}`, error)
            return generation
          }
        })
      )

      setGenerationData(updated)
    }

    fetchSubTypesOnInit()
  }, [initialData, generationData.length])

  const updateGenerationData = useCallback(async (id: number, value: boolean, label: string) => {
    // Update checkbox state
    setGenerationData((prev) =>
      prev.map((generation) => (generation.id === id ? { ...generation, value } : generation))
    )

    if (value) {
      try {
        const response = await axios.get(
          `/api/parameter-values?attribute_name=attribute1Value&attribute_value=${label}`
        )

        setGenerationData((prev) =>
          prev.map((generation) =>
            generation.id === id
              ? { ...generation, generation_sub_types: response.data }
              : generation
          )
        )
      } catch (error) {
        console.error('Failed to fetch generation sub types', error)
      }
    } else {
      setGenerationData((prev) =>
        prev.map((generation) =>
          generation.id === id
            ? {
                ...generation,
                generation_sub_types: [],
                generation_sub_type_id: null,
              }
            : generation
        )
      )
    }
  }, [])

  const updateGenerationSubTypeData = useCallback((id: number, generationSubTypeId: number) => {
    setGenerationData((prev) =>
      prev.map((generation) =>
        generation.id === id
          ? { ...generation, generation_sub_type_id: generationSubTypeId }
          : generation
      )
    )
  }, [])

  return {
    generationData,
    updateGenerationData,
    updateGenerationSubTypeData,
  }
}
