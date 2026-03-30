import useFetchRecord from '@/hooks/useFetchRecord'
import { ParameterValues } from '@/interfaces/parameter_types'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from 'react'
import InputItemForm from './InputItemForm'

export interface BaseAttribute {
  attribute_id: number | null
  attribute_definition_id: number
  attribute_value: string
  file: File | null
  mime_type: string | null
  attribute_definition: ParameterValues
}

interface Props {
  selectedValue: ParameterValues | null
  domainName: string
  parameterName: string
  attributeData: BaseAttribute[] | null
  setAttributeData: Dispatch<SetStateAction<BaseAttribute[] | null>>
}

const DynamicAttributeForm = ({
  selectedValue,
  domainName,
  parameterName,
  attributeData,
  setAttributeData,
}: Props) => {
  const attributeUrl = useMemo(() => {
    if (!selectedValue) return null

    return `/api/parameter-values?domain_name=${domainName}&parameter_name=${parameterName}&attribute_name=attribute2Value&attribute_value=${selectedValue.parameter_value}`
  }, [selectedValue, domainName, parameterName])

  const [attributes] = useFetchRecord<ParameterValues[]>(attributeUrl ?? '')

  useEffect(() => {
    if (!Array.isArray(attributes)) return

    if (attributes.length === 0) {
      setAttributeData(null)
      return
    }

    const data = attributes.map((attr) => ({
      attribute_id: null,
      attribute_definition_id: attr.id,
      attribute_value: '',
      file: null,
      mime_type: null,
      attribute_definition: attr,
    }))

    setAttributeData(data)
  }, [attributes, setAttributeData])

  const updateTextValue = useCallback(
    (id: number, value: string) => {
      setAttributeData(
        (prev) =>
          prev?.map((attr) =>
            attr.attribute_definition_id === id ? { ...attr, attribute_value: value } : attr
          ) ?? null
      )
    },
    [setAttributeData]
  )

  const updateFileValue = useCallback(
    (id: number, file: File | null) => {
      setAttributeData((prev) => {
        if (!prev) return null

        return prev.map((item) =>
          item.attribute_definition_id === id ? { ...item, file: file } : item
        )
      })
    },
    [setAttributeData]
  )

  return (
    <>
      {attributeData?.map((attribute) => (
        <InputItemForm
          key={attribute.attribute_definition_id}
          attribute={attribute}
          updateTextValue={updateTextValue}
          updateFileValue={updateFileValue}
        />
      ))}
    </>
  )
}

export default DynamicAttributeForm
