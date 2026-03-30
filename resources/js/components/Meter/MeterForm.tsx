import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Meter } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'

import Button from '@/ui/button/Button'
import FormCard from '@/ui/Card/FormCard'
import CheckBox from '@/ui/form/CheckBox'
import ComboBox from '@/ui/form/ComboBox'
import Datepicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'

export interface MeterFormProps {
  ownershipTypes: ParameterValues[]
  meterProfiles: ParameterValues[]
  types: ParameterValues[]
  accuracyClasses: ParameterValues[]
  phases: ParameterValues[]
  dialingFactors: ParameterValues[]
  units: ParameterValues[]
  resetTypes: ParameterValues[]
  internalPtPrimary: ParameterValues[]
  internalPtSecondary: ParameterValues[]
  meter?: Meter
}

export default function MeterForm({
  ownershipTypes,
  types,
  accuracyClasses,
  phases,
  dialingFactors,
  units,
  resetTypes,
  internalPtPrimary,
  internalPtSecondary,
  meter,
}: Readonly<MeterFormProps>) {
  const { formData, setFormValue } = useCustomForm({
    meter_id: meter?.meter_id,
    meter_serial: meter?.meter_serial ?? '',
    ownership_type_id: meter?.ownership_type_id ?? '',
    meter_make_id: meter?.meter_make_id ?? '',
    meter_type_id: meter?.meter_type_id ?? '',
    meter_category_id: meter?.meter_category_id ?? '',
    accuracy_class_id: meter?.accuracy_class_id ?? '',
    dialing_factor_id: meter?.dialing_factor_id ?? '',
    company_seal_num: meter?.company_seal_num ?? '',
    digit_count: meter?.digit_count ?? '',
    manufacture_date: meter?.manufacture_date ?? '',
    supply_date: meter?.supply_date ?? '',
    meter_unit_id: meter?.meter_unit_id ?? '',
    meter_reset_type_id: meter?.meter_reset_type_id ?? '',
    smart_meter_ind: meter?.smart_meter_ind ?? false,
    bidirectional_ind: meter?.bidirectional_ind ?? false,
    meter_phase_id: meter?.meter_phase_id ?? '',
    decimal_digit_count: meter?.decimal_digit_count ?? '3',
    programmable_pt_ratio: meter?.programmable_pt_ratio ?? '',
    programmable_ct_ratio: meter?.programmable_ct_ratio ?? '',
    meter_mf: meter?.meter_mf ?? '',
    warranty_period: meter?.warranty_period ?? '',
    meter_constant: meter?.meter_constant ?? '',
    batch_code: meter?.batch_code ?? '',
    internal_ct_primary: meter?.internal_ct_primary ?? '',
    internal_ct_secondary: meter?.internal_ct_secondary ?? '',
    internal_pt_primary: meter?.internal_pt_primary ?? '',
    internal_pt_secondary: meter?.internal_pt_secondary ?? '',
    ct_count: meter?.ct_count ?? '',
    pt_count: meter?.pt_count ?? '',
    _method: meter ? 'PUT' : 'POST',
  })

  const { post, loading, errors } = useInertiaPost<typeof formData>(
    meter ? route('meters.update', meter?.meter_id) : route('meters.store'),
    {
      showErrorToast: true,
    }
  )
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  useEffect(() => {
    const ctp = Number(formData.internal_ct_primary)
    const cts = Number(formData.internal_ct_secondary)

    const ptp = Number(formData.internal_pt_primary)
    const pts = Number(formData.internal_pt_secondary)

    const newCtRatio = (ctp / cts).toFixed(2)
    const newPtRatio = (ptp / pts).toFixed(2)

    if (newCtRatio !== formData.programmable_ct_ratio) {
      setFormValue('programmable_ct_ratio')(newCtRatio)
    }

    if (newPtRatio !== formData.programmable_pt_ratio) {
      setFormValue('programmable_pt_ratio')(newPtRatio)
    }
  }, [
    formData.internal_ct_primary,
    formData.internal_ct_secondary,
    formData.internal_pt_primary,
    formData.internal_pt_secondary,
    formData.programmable_ct_ratio,
    formData.programmable_pt_ratio,
  ])

  const [selectedMeterMake, setSelectedMeterMake] = useState<ParameterValues | null>(
    meter?.meter_make ?? null
  )

  useEffect(() => {
    if (selectedMeterMake) {
      setFormValue('meter_make_id')(selectedMeterMake?.id ?? '')
    }
  }, [selectedMeterMake, setFormValue])

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-4'
    >
      <FormCard title='Basic Information'>
        <div className='flex items-center space-x-4 pt-6'>
          <CheckBox
            label='Smart Meter'
            value={formData.smart_meter_ind}
            toggleValue={() => setFormValue('smart_meter_ind')(!formData.smart_meter_ind)}
            error={errors.smart_meter_ind}
          />
        </div>
        <div className='flex items-center space-x-4 pt-6'>
          <CheckBox
            label='Bidirectional'
            value={formData.bidirectional_ind}
            toggleValue={() => setFormValue('bidirectional_ind')(!formData.bidirectional_ind)}
            error={errors.bidirectional_ind}
          />
        </div>
        <Input
          label='Meter Serial'
          required
          value={formData.meter_serial}
          setValue={setFormValue('meter_serial')}
          error={errors.meter_serial}
        />
        <Input
          label='Company Seal Number'
          value={formData.company_seal_num}
          setValue={setFormValue('company_seal_num')}
          error={errors.company_seal_num}
        />

        <SelectList
          label='Meter Type'
          value={formData.meter_type_id}
          setValue={setFormValue('meter_type_id')}
          list={types}
          dataKey='id'
          displayKey='parameter_value'
          error={errors.meter_type_id}
          required
        />

        <SelectList
          label='Ownership Type'
          value={formData.ownership_type_id}
          setValue={setFormValue('ownership_type_id')}
          list={ownershipTypes}
          dataKey='id'
          displayKey='parameter_value'
          error={errors.ownership_type_id}
          required
        />

        <ComboBox
          label='Meter Make'
          value={selectedMeterMake}
          setValue={setSelectedMeterMake}
          placeholder='Search Meter Make'
          dataKey='id'
          displayKey='parameter_value'
          displayValue2='parameter_value'
          error={errors.meter_make_id}
          url='/api/parameter-values?domain_name=Meter&parameter_name=Make&attribute_value='
        />
        <Input
          label='Batch Code'
          value={formData.batch_code}
          setValue={setFormValue('batch_code')}
          error={errors.batch_code}
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
          required
        />
        <SelectList
          label='Dialing Factor'
          value={formData.dialing_factor_id}
          setValue={setFormValue('dialing_factor_id')}
          list={dialingFactors}
          dataKey='id'
          displayKey='parameter_value'
          error={errors.dialing_factor_id}
          required
        />
        <SelectList
          label='Unit'
          value={formData.meter_unit_id}
          setValue={setFormValue('meter_unit_id')}
          list={units}
          dataKey='id'
          displayKey='parameter_value'
          error={errors.meter_unit_id}
          required
        />
        <SelectList
          label='Reset Type'
          value={formData.meter_reset_type_id}
          setValue={setFormValue('meter_reset_type_id')}
          list={resetTypes}
          dataKey='id'
          displayKey='parameter_value'
          error={errors.meter_reset_type_id}
          required
        />
        <SelectList
          label='Phase'
          value={formData.meter_phase_id}
          setValue={setFormValue('meter_phase_id')}
          list={phases}
          dataKey='id'
          displayKey='parameter_value'
          error={errors.meter_phase_id}
          required
        />
        <div></div>
        <Input
          label='Digit Count'
          type='number'
          value={formData.digit_count}
          setValue={setFormValue('digit_count')}
          error={errors.digit_count}
          min={0}
          required
        />
        <Input
          label='Decimal Digit Count'
          type='number'
          value={formData.decimal_digit_count}
          setValue={setFormValue('decimal_digit_count')}
          error={errors.decimal_digit_count}
          min={0}
          required
        />
        <Input
          type='number'
          label='Internal CT Primary'
          value={formData.internal_ct_primary}
          setValue={setFormValue('internal_ct_primary')}
          error={errors.internal_ct_primary}
          required
        />
        <Input
          type='number'
          label='Internal CT Secondary'
          value={formData.internal_ct_secondary}
          setValue={setFormValue('internal_ct_secondary')}
          error={errors.internal_ct_secondary}
          required
        />
        <SelectList
          label='Internal PT Primary'
          value={formData.internal_pt_primary}
          setValue={setFormValue('internal_pt_primary')}
          list={internalPtPrimary}
          dataKey='parameter_value'
          displayKey='parameter_value'
          error={errors.internal_pt_primary}
          required
        />
        <SelectList
          label='Internal PT Secondary'
          value={formData.internal_pt_secondary}
          setValue={setFormValue('internal_pt_secondary')}
          list={internalPtSecondary}
          dataKey='parameter_value'
          displayKey='parameter_value'
          error={errors.internal_pt_secondary}
          required
        />

        <Input
          label='Meter CT Ratio'
          type='number'
          value={formData.programmable_ct_ratio}
          setValue={setFormValue('programmable_ct_ratio')}
          error={errors.programmable_ct_ratio}
          disabled
        />
        <Input
          label='Meter PT Ratio'
          type='number'
          value={formData.programmable_pt_ratio}
          setValue={setFormValue('programmable_pt_ratio')}
          error={errors.programmable_pt_ratio}
          disabled
        />
        <Input
          label='CT Count'
          type='number'
          value={formData.ct_count}
          setValue={setFormValue('ct_count')}
          error={errors.ct_count}
          required
          min={0}
        />
        <Input
          label='PT Count'
          type='number'
          value={formData.pt_count}
          setValue={setFormValue('pt_count')}
          error={errors.pt_count}
          required
          min={0}
        />
        <Input
          label='Meter Constant'
          type='number'
          value={formData.meter_constant}
          setValue={setFormValue('meter_constant')}
          error={errors.meter_constant}
          min={0}
        />
        <Input
          label='Warranty Period (Months)'
          type='number'
          value={formData.warranty_period}
          setValue={setFormValue('warranty_period')}
          error={errors.warranty_period}
          min={0}
        />

        <Datepicker
          label='Manufacture Date'
          value={formData.manufacture_date}
          setValue={setFormValue('manufacture_date')}
          error={errors.manufacture_date}
          placeholder='dd/mm/yyyy'
        />
        <Datepicker
          label='Supply Date'
          value={formData.supply_date}
          setValue={setFormValue('supply_date')}
          error={errors.supply_date}
          placeholder='dd/mm/yyyy'
        />
      </FormCard>
      <div className='flex justify-end gap-3 border-t pt-6'>
        <Button
          type='button'
          label='Cancel'
          variant='secondary'
          onClick={() => router.get('/meters')}
          disabled={loading}
        />
        <Button
          type='submit'
          label={meter ? 'Update Meter' : 'Create Meter'}
          disabled={loading}
          processing={loading}
          variant={loading ? 'loading' : 'primary'}
        />
      </div>
    </form>
  )
}
