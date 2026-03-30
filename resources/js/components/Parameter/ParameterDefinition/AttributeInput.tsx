import Input from '@/ui/form/Input'

export default function AttributeInput({
  index,
  value,
  setValue,
  errors,
  removeAttribute,
  isEditMode = false,
}: {
  index: number
  value: string
  setValue: (value: string) => void
  errors: Record<string, string> | undefined
  removeAttribute: (index: number) => void
  isEditMode?: boolean
}) {
  const attrKey = `attribute${index + 1}_name`

  return (
    <div className='relative flex flex-col'>
      <Input
        label={`Attribute ${index + 1} Name`}
        value={value}
        setValue={setValue}
        error={errors?.[attrKey]}
      />

      {/* Show delete only in create mode */}
      {!isEditMode && (
        <button
          type='button'
          onClick={() => removeAttribute(index)}
          className='absolute top-2 right-2 font-bold text-red-500'
        >
          ×
        </button>
      )}
    </div>
  )
}
