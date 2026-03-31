import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { metadataNavItems } from '@/components/Navbar/navitems'
import { BreadcrumbItem } from '@/types'
import FormCard from '@/ui/Card/FormCard'
import Field from '@/components/ui/field'

export default function ParameterValueShow({
  parameter_value,
}: {
  parameter_value: ParameterValues
}) {
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
      title: parameter_value?.parameter_value,
      href: '#',
    },
  ]
  const allFields = [
    { label: 'Id', key: 'id' },
    { label: 'Parameter Code', key: 'parameter_code' },
    { label: 'Parameter Value', key: 'parameter_value' },
    { label: 'Attribute 1 Value', key: 'attribute1_value' },
    { label: 'Attribute 2 Value', key: 'attribute2_value' },
    { label: 'Attribute 3 Value', key: 'attribute3_value' },
    { label: 'Attribute 4 Value', key: 'attribute4_value' },
    { label: 'Attribute 5 Value', key: 'attribute5_value' },
    { label: 'Sort Priority', key: 'sort_priority' },
    { label: 'Notes', key: 'notes' },
  ]

  // Filter dynamic attribute values only when they exist or contain text
  const filteredFields = allFields.filter((field) => {
    const isAttribute = field.key.startsWith('attribute')
    const value = parameter_value?.[field.key as keyof ParameterValues]

    if (isAttribute) {
      return value !== null && value !== undefined && value.toString().trim() !== ''
    }

    return true
  })

  const attributeFields = filteredFields.filter((field) => field.key.startsWith('attribute'))

  const basicFields = filteredFields.filter((field) => !field.key.startsWith('attribute'))

  const showAttributes = attributeFields.length > 0

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={metadataNavItems}
      selectedItem='Values'
      title={`${parameter_value?.parameter_value}`}
      description={
        <>
          Parameter Value details for {''}
          <span className='font-bold'>{parameter_value?.parameter_value}</span>
        </>
      }
    >
      {/* ---- Basic Detail Section ---- */}
      <FormCard title='Basic Information'>
        {basicFields.map((field) => (
          <Field
            key={field.key}
            label={field.label}
            value={parameter_value?.[field.key as keyof ParameterValues] ?? ''}
          />
        ))}

        {/* Fixed hierarchical fields */}
        <Field
          label='Domain'
          value={parameter_value?.definition?.domain?.domain_name}
        />
        <Field
          label='Definition'
          value={parameter_value?.definition?.parameter_name}
        />
        <Field
          label='System Module'
          value={parameter_value?.definition?.domain?.system_module?.name}
        />
      </FormCard>

      {/* ---- Attribute Section (Only If Data Exists) ---- */}
      {showAttributes && (
        <FormCard title='Attribute Values'>
          {attributeFields.map((field) => (
            <Field
              key={field.key}
              label={field.label}
              value={parameter_value?.[field.key as keyof ParameterValues]}
            />
          ))}
        </FormCard>
      )}

      {/* ---- Additional Information ---- */}
      <FormCard title='Additional Information'>
        <Field
          label='Sort Priority'
          value={parameter_value?.sort_priority}
        />

        <Field
          label='Active'
          value={parameter_value?.is_active ? 'Yes' : 'No'}
        />

        <div className='col-span-2'>
          {parameter_value?.notes && (
            <Field
              label='Notes'
              value={parameter_value?.notes}
            />
          )}
        </div>
      </FormCard>
    </MainLayout>
  )
}
