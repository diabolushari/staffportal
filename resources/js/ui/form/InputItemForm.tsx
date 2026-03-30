import Datepicker from '@/ui/form/DatePicker'
import CheckBox from '@/ui/form/CheckBox'
import FileInput from '@/ui/form/FileInput'

import Input from '@/ui/form/Input'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import { BaseAttribute } from './DynamicAttributeForm'

interface Props {
  updateTextValue: (attribute_id: number, value: string) => void
  updateFileValue?: (attribute_id: number, value: File | null) => void
  attribute: BaseAttribute
  errors?: string
}

export default function InputItemForm({
  updateTextValue,
  updateFileValue,
  attribute,
  errors,
}: Readonly<Props>) {
  return (
    <div
      className='flex flex-col'
      key={attribute.attribute_id}
    >
      {attribute?.attribute_definition?.attribute1_value.toLowerCase() === 'date' && (
        <Datepicker
          setValue={(value) => updateTextValue(attribute.attribute_definition_id, value)}
          label={attribute.attribute_definition.parameter_value}
          placeholder={attribute.attribute_definition.parameter_value ?? ''}
          value={attribute.attribute_value}
          error={errors}
        />
      )}
      {attribute?.attribute_definition?.attribute1_value.toLowerCase() === 'boolean' && (
        <CheckBox
          label={attribute.attribute_definition.parameter_value}
          value={String(attribute.attribute_value).toLowerCase() === 'true'}
          toggleValue={() =>
            updateTextValue(
              attribute.attribute_definition_id,
              String(attribute.attribute_value).toLowerCase() === 'true' ? 'false' : 'true'
            )
          }
        />
      )}

      {(attribute?.attribute_definition?.attribute1_value.toLowerCase() === 'text' ||
        attribute?.attribute_definition?.attribute1_value.toLowerCase() === 'number') && (
        <Input
          setValue={(value) => updateTextValue(attribute.attribute_definition_id, value)}
          value={attribute.attribute_value}
          label={attribute.attribute_definition.parameter_value}
          placeholder={attribute.attribute_definition.parameter_value ?? ''}
          error={errors}
        />
      )}

      {attribute?.attribute_definition?.attribute1_value.toLocaleLowerCase() === 'file' &&
        updateFileValue && (
          <div className='space-y-2'>
            <FileInput
              setValue={(file) => updateFileValue(attribute.attribute_definition_id, file)}
              label={attribute.attribute_definition.parameter_value}
              error={errors}
              file={attribute.file}
            />
          </div>
        )}
      {attribute?.attribute_definition?.attribute1_value.toLowerCase() === 'drop down' && (
        <DynamicSelectList
          setValue={(value) => updateTextValue(attribute.attribute_definition_id, value)}
          label={attribute.attribute_definition.parameter_value}
          placeholder={attribute.attribute_definition.parameter_value ?? ''}
          value={attribute.attribute_value}
          error={errors}
          url={`/api/parameter-values?domain_name=${attribute.attribute_definition?.attribute3_value}&parameter_name=${attribute.attribute_definition?.attribute4_value}`}
          dataKey='parameter_value'
          displayKey='parameter_value'
        />
      )}
    </div>
  )
}
