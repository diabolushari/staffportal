import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import Input from '@/ui/form/Input'
import FileInput from '@/ui/form/FileInput'
import Button from '@/ui/button/Button'
import { PurposeInfo } from '@/interfaces/data_interfaces'
import FormCard from '@/ui/Card/FormCard'
import Datepicker from '@/ui/form/DatePicker'
import { useEffect, useState } from 'react'
import { ParameterValues } from '@/interfaces/parameter_types'
import ComboBox from '@/ui/form/ComboBox'
import CheckBox from '@/ui/form/CheckBox'
import { router } from '@inertiajs/react'
import MultiSelectComboBox from '@/ui/form/MultiSelectComboBox'

interface PageProps {
  purposeInfo?: PurposeInfo
}

export default function PurposeInfoForm({ purposeInfo }: Readonly<PageProps>) {
  const [selectedPurpose, setSelectedPurpose] = useState<ParameterValues | null>(
    purposeInfo?.purpose ?? null
  )
  const [selectedPurposeList, setSelectedPurposeList] = useState<ParameterValues[]>([])
  const [selectedTariff, setSelectedTariff] = useState<ParameterValues | null>(
    purposeInfo?.tariff ?? null
  )
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    id: purposeInfo?.id ?? '',
    purpose_id: purposeInfo?.purpose_id ?? '',
    tariff_id: purposeInfo?.tariff_id ?? '',
    is_non_dps: purposeInfo?.is_non_dps ?? false,
    effective_start: purposeInfo?.effective_start ?? '',
    effective_end: purposeInfo?.effective_end ?? '',
    mulitple_purposes: [] as number[],
    _method: purposeInfo != null ? 'PUT' : undefined,
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    purposeInfo
      ? route('tariff-mappings.update', purposeInfo?.id ?? 0)
      : route('tariff-mappings.store'),
    {
      showErrorToast: true,
    }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  useEffect(() => {
    if (selectedPurpose) {
      setFormValue('purpose_id')(selectedPurpose.id)
    } else {
      setFormValue('purpose_id')('')
    }
    if (selectedTariff) {
      setFormValue('tariff_id')(selectedTariff.id)
    } else {
      setFormValue('tariff_id')('')
    }
  }, [selectedPurpose, selectedTariff])

  useEffect(() => {
    if (selectedPurposeList) {
      const purposeIds = selectedPurposeList.map((purpose) => purpose.id)
      setFormValue('mulitple_purposes')(purposeIds)
    } else {
      setFormValue('mulitple_purposes')([])
    }
  }, [selectedPurposeList])

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-4'
    >
      <FormCard title='Basic Information'>
        <ComboBox
          label='Tariff'
          value={selectedTariff}
          setValue={setSelectedTariff}
          placeholder='Search Tariff'
          dataKey='id'
          displayKey='parameter_value'
          displayValue2='parameter_code'
          url='/api/parameter-values?domain_name=Connection&parameter_name=Tariff&search='
          error={errors?.tariff_id}
        />
        {!purposeInfo && (
          <MultiSelectComboBox
            label='Purposes'
            value={selectedPurposeList}
            setValue={setSelectedPurposeList}
            placeholder='Search Purpose'
            dataKey='id'
            displayKey='parameter_value'
            displayValue2='parameter_code'
            url='/api/parameter-values?domain_name=Connection&parameter_name=Primary Purpose&search='
            error={errors?.mulitple_purposes}
          />
        )}
        {purposeInfo && (
          <ComboBox
            label='Purpose'
            value={selectedPurpose}
            setValue={setSelectedPurpose}
            placeholder='Search Purpose'
            dataKey='id'
            displayKey='parameter_value'
            displayValue2='parameter_code'
            url='/api/parameter-values?domain_name=Connection&parameter_name=Primary Purpose&search='
            error={errors?.purpose_id}
          />
        )}

        <CheckBox
          label='Non DPS Allowed'
          toggleValue={toggleBoolean('is_non_dps')}
          value={formData.is_non_dps}
          error={errors?.is_non_dps}
        />
        <div></div>
        <Datepicker
          label='From Date'
          setValue={setFormValue('effective_start')}
          placeholder='Pick a date'
          value={formData.effective_start}
          error={errors?.effective_start}
        />
        <Datepicker
          label='To Date'
          setValue={setFormValue('effective_end')}
          placeholder='Pick a date'
          value={formData.effective_end}
          error={errors?.effective_end}
        />
      </FormCard>
      <div className='mt-4 flex justify-between'>
        <Button
          type='button'
          label='Cancel'
          variant='secondary'
          onClick={() => router.get(route('tariff-mappings.index'))}
        />
        <Button
          type='submit'
          disabled={loading}
          label={loading ? 'Saving...' : 'Save'}
          processing={loading}
          variant={loading ? 'processing' : 'primary'}
        />
      </div>
    </form>
  )
}
