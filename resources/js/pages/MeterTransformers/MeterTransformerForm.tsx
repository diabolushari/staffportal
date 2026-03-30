import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import useCustomForm from '@/hooks/useCustomForm'
import useFetchRecord from '@/hooks/useFetchRecord'
import useInertiaPost from '@/hooks/useInertiaPost'
import { MeterTransformer } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import Button from '@/ui/button/Button'
import FormCard from '@/ui/Card/FormCard'
import Datepicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import { useState, useMemo } from 'react'

export interface MeterTransformerFormProps {
  ownershipTypes: ParameterValues[]
  accuracyClasses: ParameterValues[]
  burdens: ParameterValues[]
  makes: ParameterValues[]
  types: ParameterValues[]
  primaryRatios: ParameterValues[]
  secondaryRatios: ParameterValues[]
  transformer?: MeterTransformer // for edit mode
}

const breadcrumbs = [
  {
    title: 'Home',
    href: '/',
  },
  { title: 'Settings', href: '/settings-page' },
  { title: 'CTPTs', href: '/meter-ctpt' },
  {
    title: 'Create',
    href: '/meter-ctpt/create',
  },
]

const toYMD = (iso?: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  return !Number.isNaN(d.getTime()) ? d.toISOString().split('T')[0] : ''
}

export default function MeterTransformerForm({
  ownershipTypes,
  accuracyClasses,
  burdens,
  makes,
  types,
  transformer,
}: MeterTransformerFormProps) {
  const isEditing = Boolean(transformer)

  const [transformerType, setTransformerType] = useState<string>(
    transformer?.type?.parameter_value ?? ''
  )

  const transformerInfo = useMemo(() => {
    const type = transformerType?.toUpperCase()
    if (type === 'CT') {
      return {
        primary: 'Primary Current',
        secondary: 'Secondary Current',
        primaryUnit: 'A',
        secondaryUnit: 'A',
      }
    } else if (type === 'PT') {
      return {
        primary: 'Primary Voltage',
        secondary: 'Secondary Voltage',
        primaryUnit: 'V',
        secondaryUnit: 'V',
      }
    }
    return {
      primary: 'Primary Ratio',
      secondary: 'Secondary Ratio',
      primaryUnit: '',
      secondaryUnit: '',
    }
  }, [transformerType])

  const { formData, setFormValue } = useCustomForm({
    ctpt_serial: transformer?.ctpt_serial ?? '',
    ownership_type_id: transformer?.ownership_type_id ?? '',
    accuracy_class_id: transformer?.accuracy_class_id ?? '',
    burden_id: transformer?.burden_id ?? '',
    make_id: transformer?.make_id ?? '',
    type_id: transformer?.type_id ?? '',
    ratio_primary_value: transformer?.ratio_primary_value ?? '',
    ratio_secondary_value: transformer?.ratio_secondary_value ?? '',
    manufacture_date: toYMD(transformer?.manufacture_date) ?? '',
    _method: isEditing ? 'PUT' : 'POST',
  })

  const { post, loading, errors } = useInertiaPost<typeof formData>(
    transformer ? route('meter-ctpt.update', transformer.meter_ctpt_id) : route('meter-ctpt.store'),
    {
      showErrorToast: true,
    }
  )

  const handletypeChange = (id: string | number) => {
    const numericId = Number(id)
    const selected = types.find((t) => t.id == numericId)?.parameter_value || ''
    setTransformerType(selected)
    setFormValue('type_id')(numericId)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  const primaryRatioUrl = useMemo(() => {
    if (!transformerType) return null

    return `/api/parameter-values?domain_name=CTPT&parameter_name=Primary Ratio&attribute_name=attribute1Value&attribute_value=${transformerType}`
  }, [transformerType])

  const secondaryRatioUrl = useMemo(() => {
    if (!transformerType) return null

    return `/api/parameter-values?domain_name=CTPT&parameter_name=Secondary Ratio&attribute_name=attribute1Value&attribute_value=${transformerType}`
  }, [transformerType])

  const [filteredPrimaryRatios] = useFetchRecord<ParameterValues>(
    primaryRatioUrl ? primaryRatioUrl : ' '
  )

  const [filteredSecondaryRatios] = useFetchRecord<ParameterValues>(
    secondaryRatioUrl ? secondaryRatioUrl : ''
  )

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='CTPTs'
      title={isEditing ? 'Edit CTPT' : 'Create CTPT'}
    >
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
      >
        <FormCard title='Basic Information'>
          <SelectList
            label='Type'
            value={formData.type_id}
            setValue={handletypeChange}
            list={types}
            dataKey='id'
            displayKey='parameter_value'
            error={errors.type_id}
          />
          <Input
            label='CT/PT Serial'
            required
            value={formData.ctpt_serial}
            setValue={setFormValue('ctpt_serial')}
            error={errors.ctpt_serial}
          />
          <SelectList
            label='Ownership Type'
            value={formData.ownership_type_id}
            setValue={setFormValue('ownership_type_id')}
            list={ownershipTypes}
            dataKey='id'
            displayKey='parameter_value'
            error={errors.ownership_type_id}
          />
          <SelectList
            label='Make'
            value={formData.make_id}
            setValue={setFormValue('make_id')}
            list={makes}
            dataKey='id'
            displayKey='parameter_value'
            error={errors.make_id}
          />
        </FormCard>
        <FormCard title='Technical Specifications'>
          <SelectList
            label='Accuracy Class'
            value={formData.accuracy_class_id}
            setValue={setFormValue('accuracy_class_id')}
            list={accuracyClasses}
            dataKey='id'
            displayKey='parameter_value'
            error={errors.accuracy_class_id}
          />
          <SelectList
            label='Burden'
            value={formData.burden_id}
            setValue={setFormValue('burden_id')}
            list={burdens}
            dataKey='id'
            displayKey='parameter_value'
            error={errors.burden_id}
          />
          {transformerType === 'CT' && (
            <Input
              label={transformerInfo.primary}
              value={formData.ratio_primary_value}
              setValue={setFormValue('ratio_primary_value')}
              type='number'
              error={errors.ratio_primary_value}
            />
          )}
          {transformerType === 'CT' && (
            <Input
              label={transformerInfo.secondary}
              value={formData.ratio_secondary_value}
              setValue={setFormValue('ratio_secondary_value')}
              type='number'
              error={errors.ratio_secondary_value}
            />
          )}
          {filteredPrimaryRatios && transformerType !== 'CT' && (
            <SelectList
              label={transformerInfo.primary}
              value={formData.ratio_primary_value}
              setValue={setFormValue('ratio_primary_value')}
              list={filteredPrimaryRatios}
              dataKey='parameter_value'
              displayKey='parameter_value'
              error={errors.ratio_primary_value}
            />
          )}

          {filteredSecondaryRatios && transformerType !== 'CT' && (
            <SelectList
              label={transformerInfo.secondary}
              value={formData.ratio_secondary_value}
              setValue={setFormValue('ratio_secondary_value')}
              list={filteredSecondaryRatios ?? []}
              dataKey='parameter_value'
              displayKey='parameter_value'
              error={errors.ratio_secondary_value}
            />
          )}

          <Datepicker
            label='Manufacture Date'
            value={formData.manufacture_date}
            setValue={setFormValue('manufacture_date')}
            error={errors.manufacture_date}
            placeholder='dd/mm/yyyy'
          />
        </FormCard>

        <div className='flex justify-end gap-3 border-t pt-6'>
          <Button
            type='button'
            label='Cancel'
            variant='secondary'
            onClick={() => router.get('/meter-ctpt')}
            disabled={loading}
          />
          <Button
            type='submit'
            label={isEditing ? 'Update CTPT' : 'Create CTPT'}
            disabled={loading}
            processing={loading}
            variant={loading ? 'loading' : 'primary'}
          />
        </div>
      </form>
    </MainLayout>
  )
}
