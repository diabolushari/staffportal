import { metadataNavItems } from '@/components/Navbar/navitems'
import capitalSnakeCase from '@/formaters/capitalcase'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterDefinition, ParameterDomain, ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import FormCard from '@/ui/Card/FormCard'
import CheckBox from '@/ui/form/CheckBox'
import Datepicker from '@/ui/form/DatePicker'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'
import { useEffect, useState } from 'react'

interface Props {
  parameter_value?: ParameterValues
  definitions: ParameterDefinition[]
  domains: ParameterDomain[]
}

export default function ParameterValueCreate({ parameter_value, definitions, domains }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Settings',
      href: '/settings-page',
    },
    {
      title: 'Parameter Values',
      href: '/parameter-value',
    },
    {
      title: parameter_value ? 'Edit' : 'Create',
      href: '#',
    },
  ]

  const attributeValuePresent =
    parameter_value?.attribute1_value ||
    parameter_value?.attribute2_value ||
    parameter_value?.attribute3_value ||
    parameter_value?.attribute4_value ||
    parameter_value?.attribute5_value

  const [selectedDefinition, setSelectedDefinition] = useState<ParameterDefinition | null>(
    attributeValuePresent ? parameter_value?.definition_id : null
  )

  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    definition_id: parameter_value?.definition_id ?? '',
    is_active: parameter_value?.is_active ?? true,
    parameter_code: parameter_value?.parameter_code ?? '',
    parameter_value: parameter_value?.parameter_value ?? '',
    attribute1_value: parameter_value?.attribute1_value ?? '',
    attribute2_value: parameter_value?.attribute2_value ?? '',
    attribute3_value: parameter_value?.attribute3_value ?? '',
    attribute4_value: parameter_value?.attribute4_value ?? '',
    attribute5_value: parameter_value?.attribute5_value ?? '',
    effective_start_date: parameter_value?.effective_start_date ?? '',
    effective_end_date: parameter_value?.effective_end_date ?? '',
    sort_priority: parameter_value?.sort_priority ?? '',
    notes: parameter_value?.notes ?? '',
    domain_name: parameter_value?.definition?.domain?.domain_name ?? '',
    _method: parameter_value != null ? 'PUT' : undefined,
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    parameter_value
      ? route('parameter-value.update', parameter_value.id)
      : route('parameter-value.store'),
    {
      onComplete: () => {
        window.location.href = route('parameter-value.index')
      },
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(formData)
  }

  useEffect(() => {
    if (formData.definition_id && definitions?.length) {
      const definition = definitions.find(
        (d: ParameterDefinition) => d.id == formData.definition_id
      )
      setSelectedDefinition(definition ?? null)
    }
  }, [formData.definition_id, definitions])

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={metadataNavItems}
      selectedItem='Values'
      title={parameter_value ? 'Edit Parameter Value' : 'Create Parameter Value'}
    >
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
      >
        <FormCard title='Basic Information'>
          <SelectList
            label='Domain'
            setValue={setFormValue('domain_name')}
            value={formData.domain_name}
            error={errors?.domain_name}
            list={domains}
            dataKey='domain_name'
            displayKey='domain_name'
          />
          {formData.domain_name && (
            <DynamicSelectList
              label='Definition'
              url={`/api/parameter-definitions/?domain_name=${formData.domain_name}`}
              setValue={setFormValue('definition_id')}
              value={formData.definition_id}
              error={errors?.definition_id}
              dataKey='id'
              displayKey='parameter_name'
            />
          )}

          <Input
            label='Parameter Code'
            value={formData.parameter_code}
            setValue={setFormValue('parameter_code')}
            error={errors?.parameter_code}
            formatter={capitalSnakeCase}
          />

          <Input
            label='Parameter Value'
            value={formData.parameter_value}
            setValue={setFormValue('parameter_value')}
            error={errors?.parameter_value}
          />

          {selectedDefinition && selectedDefinition.attribute1_name && (
            <>
              <div className='col-span-2 flex flex-col'>
                <StrongText className='dark:text-gray-300'>Attribute Values</StrongText>
              </div>

              {selectedDefinition?.attribute1_name && (
                <Input
                  label={selectedDefinition.attribute1_name}
                  value={formData.attribute1_value}
                  setValue={setFormValue('attribute1_value')}
                  error={errors?.attribute1_value}
                />
              )}
              {selectedDefinition?.attribute2_name && (
                <Input
                  label={selectedDefinition.attribute2_name}
                  value={formData.attribute2_value}
                  setValue={setFormValue('attribute2_value')}
                  error={errors?.attribute2_value}
                />
              )}
              {selectedDefinition?.attribute3_name && (
                <Input
                  label={selectedDefinition.attribute3_name}
                  value={formData.attribute3_value}
                  setValue={setFormValue('attribute3_value')}
                  error={errors?.attribute3_value}
                />
              )}
              {selectedDefinition?.attribute4_name && (
                <Input
                  label={selectedDefinition.attribute4_name}
                  value={formData.attribute4_value}
                  setValue={setFormValue('attribute4_value')}
                  error={errors?.attribute4_value}
                />
              )}
              {selectedDefinition?.attribute5_name && (
                <Input
                  label={selectedDefinition.attribute5_name}
                  value={formData.attribute5_value}
                  setValue={setFormValue('attribute5_value')}
                  error={errors?.attribute5_value}
                />
              )}
            </>
          )}
          <CheckBox
            label='Active'
            value={formData.is_active}
            error={errors?.is_active}
            toggleValue={toggleBoolean('is_active')}
          />
        </FormCard>

        {selectedDefinition?.is_effective_date_driven && (
          <div className='flex flex-col'>
            <Datepicker
              label='Effective Start Date'
              value={formData.effective_start_date}
              setValue={setFormValue('effective_start_date')}
              error={errors?.effective_start_date}
            />
          </div>
        )}
        {selectedDefinition?.is_effective_date_driven && (
          <div className='flex flex-col'>
            <Datepicker
              label='Effective End Date'
              value={formData.effective_end_date}
              setValue={setFormValue('effective_end_date')}
              error={errors?.effective_end_date}
            />
          </div>
        )}
        <FormCard title='Additional Information'>
          <div className='flex flex-col'>
            <Input
              label='Sort Priority'
              type='number'
              value={formData.sort_priority}
              setValue={setFormValue('sort_priority')}
              error={errors?.sort_priority}
            />
          </div>

          <div className='flex flex-col md:col-span-2'>
            <TextArea
              label='Notes'
              value={formData.notes}
              setValue={setFormValue('notes')}
              error={errors?.notes}
            />
          </div>
        </FormCard>
        <div className='col-span-full mt-4 flex justify-between gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => history.back()}
            label='Cancel'
          />
          <Button
            type='submit'
            label='Save'
            disabled={loading}
            processing={loading}
            variant={loading ? 'loading' : 'primary'}
          />
        </div>
      </form>
    </MainLayout>
  )
}
