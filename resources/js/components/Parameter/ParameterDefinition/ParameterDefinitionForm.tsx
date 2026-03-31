import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterDefinition, ParameterDomain } from '@/interfaces/parameter_types'
import SubHeading from '@/typography/SubHeading'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import Modal from '@/ui/Modal/Modal'
import { router } from '@inertiajs/react'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import AttributeInput from './AttributeInput'

interface Props {
  title: string
  setShowModal: (value: boolean) => unknown
  show: boolean
  children?: React.ReactNode
  parameterDefinition?: ParameterDefinition | null
  domains: ParameterDomain[]
}

export default function ParameterDefinitionForm({
  title,
  setShowModal,
  parameterDefinition,
  domains,
}: Readonly<Props>) {
  const [attributes, setAttributes] = useState<string[]>(() => {
    const initial = [
      parameterDefinition?.attribute1_name ?? '',
      parameterDefinition?.attribute2_name ?? '',
      parameterDefinition?.attribute3_name ?? '',
      parameterDefinition?.attribute4_name ?? '',
      parameterDefinition?.attribute5_name ?? '',
    ].filter((a) => a)
    return initial
  })

  console.log('attributes', attributes)

  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    parameter_name: parameterDefinition?.parameter_name ?? '',
    domain_id: parameterDefinition?.domain_id ?? '',
    is_effective_date_driven: parameterDefinition?.is_effective_date_driven ?? false,
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    parameterDefinition
      ? route('parameter-definition.update', parameterDefinition.id)
      : route('parameter-definition.store'),
    {
      onComplete: () => {
        setShowModal(false)
        router.get(route('parameter-definition.index'))
      },
    }
  )

  const addAttribute = () => {
    if (attributes.length < 5) {
      setAttributes([...attributes, ''])
    }
  }

  const removeAttribute = (index: number) => {
    const updated = [...attributes]
    updated.splice(index, 1)
    setAttributes(updated)
  }

  // update attribute value
  const setAttributeValue = (index: number, value: string) => {
    const updated = [...attributes]
    updated[index] = value
    setAttributes(updated)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const attributesPayload = attributes.reduce(
      (acc, attr, i) => {
        acc[`attribute${i + 1}_name`] = attr
        return acc
      },
      {} as Record<string, string>
    )
    const payload = {
      ...formData,
      ...attributesPayload,
    }
    parameterDefinition ? post({ ...payload, _method: 'PUT' }) : post(payload)
  }

  return (
    <div>
      <SubHeading>Parameter Definition</SubHeading>
      <Modal
        title={title}
        setShowModal={setShowModal}
      >
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col md:gap-4'>
            {/* Domain */}
            <div className='flex flex-col'>
              <SelectList
                label='Domain'
                setValue={setFormValue('domain_id')}
                value={formData.domain_id}
                placeholder='Select Domain'
                error={errors?.domain_id}
                list={domains}
                dataKey='id'
                displayKey='domain_name'
              />
            </div>
            {/* Parameter Name */}
            <div className='flex flex-col'>
              <Input
                label='Parameter Name'
                setValue={setFormValue('parameter_name')}
                value={formData.parameter_name}
                placeholder='Type your Parameter Name'
                error={errors?.parameter_name}
              />
            </div>
            {/* Attributes */}
            {attributes.map((attr, index) => (
              <div
                key={index}
                className='flex flex-col'
              >
                <AttributeInput
                  index={index}
                  value={attr}
                  setValue={(val) => setAttributeValue(index, val)}
                  errors={errors}
                  removeAttribute={() => removeAttribute(index)}
                  isEditMode={!!parameterDefinition}
                />
              </div>
            ))}
            {attributes.length < 5 && (
              <div className='flex'>
                <button
                  className='flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600'
                  onClick={addAttribute}
                  type='button'
                >
                  <PlusIcon className='h-6 w-6 stroke-[2.5]' />
                  Add Another Attribute
                </button>
              </div>
            )}
            {/* Effective Date Checkbox */}
            {/* <div className='flex flex-col'>
              <CheckBox
                label='Effective date'
                toggleValue={toggleBoolean('is_effective_date_driven')}
                value={formData.is_effective_date_driven}
                error={errors?.is_effective_date_driven}
              />
            </div> */}
          </div>

          {/* Submit */}
          <div className='flex justify-end p-4'>
            <Button
              type='submit'
              label='Save'
              disabled={loading}
              processing={loading}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
