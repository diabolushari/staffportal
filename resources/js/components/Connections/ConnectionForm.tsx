import useCustomForm from '@/hooks/useCustomForm'
import useFetchRecord from '@/hooks/useFetchRecord'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Connection, OfficeWithHierarchy, PurposeInfo } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import StrongText from '@/typography/StrongText'
import CheckBox from '@/ui/form/CheckBox'
import ComboBox from '@/ui/form/ComboBox'
import Input from '@/ui/form/Input'
import MultiSelectList from '@/ui/form/MultiSelect'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'
import { useEffect, useState } from 'react'
import { route } from 'ziggy-js'
import { Card } from '../ui/card'
import ConnectionFlagForm from './ConnectionFlagForm'
import ConnectionGenerationTypeForm from './ConnectionGenerationTypeForm'
import useConnectionFlagForm from './useConnectionFlagForm'
import useConnectionGenerationForm from './useConnectionGenerationForm'
import { router } from '@inertiajs/react'
import { Button } from '../ui/button'

import Datepicker from '@/ui/form/DatePicker'

interface Props {
  connection?: Connection
  connectionTypes: ParameterValues[]
  connectionStatus: ParameterValues[]
  voltageTypes: ParameterValues[]
  connectionCategory: ParameterValues[]
  billingProcesses: ParameterValues[]
  phaseTypes: ParameterValues[]
  primaryPurposes: ParameterValues[]
  openAccessTypes: ParameterValues[]
  meteringTypes: ParameterValues[]
  renewableTypes: ParameterValues[]
  indicators: ParameterValues[]
  generationTypes: ParameterValues[]
  billingSides: ParameterValues[]
}
const formatDateForInput = (date?: string | Date) => {
  if (!date) return ''
  const d = new Date(date)
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  const year = d.getFullYear()
  return `${year}-${month}-${day}`
}

export default function ConnectionForm({
  connection,
  connectionTypes,
  connectionStatus,
  voltageTypes,
  connectionCategory,
  billingProcesses,
  phaseTypes,
  primaryPurposes,
  meteringTypes,
  generationTypes,
  indicators,
  billingSides,
}: Props) {
  console.log(connection)
  const [subCategories, setSubCategories] = useState<ParameterValues[]>([])
  const [category, setCategory] = useState<string>(
    connection?.connection_category_id
      ? connectionCategory.filter((category) => category.id == connection.connection_category_id)[0]
          .parameter_value
      : ''
  )
  const [tariff, setTariff] = useState<PurposeInfo[] | null>(null)

  const { flagData, updateFlagData } = useConnectionFlagForm(indicators)
  const { generationData, updateGenerationData, updateGenerationSubTypeData } =
    useConnectionGenerationForm({
      generationTypes,
    })

  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    connection_type_id: connection?.connection_type_id ?? '',
    connection_status_id: connection?.connection_status_id ?? '',
    consumer_number: connection?.consumer_number ?? '',
    voltage_type_id: connection?.voltage_id ?? '',
    tariff_type_id: connection?.tariff_id ?? '',
    connection_category_id: connection?.connection_category_id ?? '',
    connection_subcategory_id: connection?.connection_subcategory_id ?? '',
    billing_process_id: connection?.billing_process_id ?? '',
    phase_type_id: connection?.phase_type_id ?? '',
    primary_purpose_id: connection?.primary_purpose_id ?? '',
    other_purposes: connection?.other_purposes ?? [],
    admin_office_code: connection?.admin_office_code ?? '',
    service_office_code: connection?.service_office_code ?? '',
    contract_demand_kw_val: connection?.contract_demand_kva_val ?? '',
    connected_load_kw_val: connection?.connected_load_kw_val ?? '',
    metering_type_id: connection?.metering_type_id ?? '',
    renewable_type_id: connection?.renewable_type_id ?? '',
    connected_date: connection?.connected_date
      ? formatDateForInput(connection?.connected_date)
      : '',
    consumer_legacy_code: connection?.consumer_legacy_code ?? '',
    power_load_kw_val: connection?.power_load_kw_val ?? '',
    light_load_kw_val: connection?.light_load_kw_val ?? '',
    othercons_flag: connection?.othercons_flag ?? false,
    _method: connection ? 'PUT' : undefined,
    power_intensive: connection?.power_intensive ?? false,
    excess_demand: connection?.excess_demand ?? false,
    no_of_main_meters: connection?.no_of_main_meters ?? '',
    remarks: connection?.remarks ?? '',
    application_no: connection?.application_no ?? '',
    billing_side_id: connection?.billing_side_id ?? '',
    indicators: flagData,
    generation_types: generationData,
    prosumers: false,
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    connection ? route('connections.update', connection.connection_id) : route('connections.store'),
    {
      showErrorToast: true,
    }
  )

  const [otherPurposeList, setOtherPurposeList] = useState<ParameterValues[]>(primaryPurposes)
  useEffect(() => {
    const filteredPurpose = primaryPurposes.filter(
      (purpose) => purpose.id !== Number(formData.primary_purpose_id)
    )
    setOtherPurposeList(filteredPurpose)
  }, [formData.primary_purpose_id, primaryPurposes])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload = { ...formData, indicators: flagData, generation_types: generationData }
    post(payload)
  }

  const [adminOfficeApiData] = useFetchRecord<OfficeWithHierarchy>(
    formData.admin_office_code ? '/api/office/code/' + formData.admin_office_code : ''
  )
  const [serviceOfficeApiData] = useFetchRecord<OfficeWithHierarchy>(
    formData.service_office_code ? '/api/office/code/' + formData.service_office_code : ''
  )

  const handleConnectionCategoryChange = (parameterValueId: string) => {
    setFormValue('connection_category_id')(parameterValueId)
    const category = connectionCategory.find((item) => item.id === Number(parameterValueId))
    setCategory(category?.parameter_value ?? '')
  }

  const [subCategoryData] = useFetchRecord<ParameterValues[]>(
    '/api/parameter-values?attribute_name=attribute1Value&attribute_value=' + category
  )
  const [tariffData] = useFetchRecord<PurposeInfo[]>(
    '/api/connections/get-tariffs?date=' +
      formData.connected_date +
      '&purpose_id=' +
      formData.primary_purpose_id
  )

  useEffect(() => {
    if (subCategoryData) {
      setSubCategories(subCategoryData)
    }
  }, [subCategoryData])

  useEffect(() => {
    if (Number(formData?.light_load_kw_val) >= 0 && Number(formData?.power_load_kw_val) >= 0) {
      setFormValue('connected_load_kw_val')(
        Number(formData?.light_load_kw_val) + Number(formData?.power_load_kw_val)
      )
    }
  }, [formData?.light_load_kw_val, formData?.power_load_kw_val])
  useEffect(() => {
    if (tariffData) {
      setTariff(tariffData)
      setFormValue('tariff_type_id')(tariffData[0]?.tariff_id ?? '')
    }
  }, [tariffData])

  const handleSetTariff = (tariffId: string) => {
    setFormValue('tariff_type_id')(tariffId)
  }
  useEffect(() => {
    if (tariffData && billingProcesses) {
      const nonDpsValue = tariffData[0]?.is_non_dps ? 'non-dps' : 'dps'
      const billingProcess = billingProcesses.find(
        (item) => item.parameter_value.toLowerCase() === nonDpsValue
      )
      setFormValue('billing_process_id')(billingProcess?.id ?? '')
    }
  }, [tariffData, billingProcesses])
  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-6'
    >
      <div className='flex'>
        {connection && (
          <>
            <div className='flex items-center justify-between gap-4 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-sm text-blue-800'>
              {/* Left: warning */}
              <div className='flex items-center gap-3'>
                <span className='flex h-5 w-5 items-center justify-center rounded-full border border-blue-400 text-xs font-bold'>
                  i
                </span>
                <p>
                  You are editing details of this connection. Please carefully review all changes
                  before saving.
                </p>
              </div>

              {/* Right: actions */}
            </div>
            <div className='flex justify-end gap-2 px-5 pt-2'>
              <Button
                variant='outline'
                type='button'
                onClick={() => router.get(route('connections.show', connection.connection_id))}
              >
                CANCEL
              </Button>

              <Button
                type='submit'
                disabled={loading}
                variant='default'
              >
                SAVE
              </Button>
            </div>
          </>
        )}
      </div>
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Basic Information</StrongText>
        </div>
        <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
          <Input
            label='Application No'
            setValue={setFormValue('application_no')}
            value={formData.application_no}
            error={errors?.application_no}
            required
          />
          <SelectList
            label='Connection Type'
            required
            list={connectionTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('connection_type_id')}
            value={formData.connection_type_id}
            error={errors?.connection_type_id}
            disabled={connection?.connection_id ? true : false}
          />
          <Input
            label='Consumer Legacy Code'
            setValue={setFormValue('consumer_legacy_code')}
            value={formData.consumer_legacy_code}
            error={errors?.consumer_legacy_code}
            required
          />
          <SelectList
            label='Connection Status'
            required
            list={connectionStatus}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('connection_status_id')}
            value={formData.connection_status_id}
            error={errors?.connection_status_id}
          />
          <SelectList
            label='Voltage Type'
            list={voltageTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('voltage_type_id')}
            value={formData.voltage_type_id}
            error={errors?.voltage_type_id}
            required
          />

          <Datepicker
            label='Connection Date'
            setValue={setFormValue('connected_date')}
            value={formData.connected_date}
            error={errors?.connected_date}
            required
            placeholder='Select Connection Date'
          />
          <Input
            label='Number of Main Meters'
            setValue={setFormValue('no_of_main_meters')}
            value={formData.no_of_main_meters}
            error={errors?.no_of_main_meters}
            min={1}
            type='number'
            required
          />
          <div className='col-span-2'>
            <TextArea
              label='Remarks'
              setValue={setFormValue('remarks')}
              value={formData.remarks}
              error={errors?.remarks}
            />
          </div>
        </div>
      </Card>
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Managed Offices</StrongText>
        </div>
        <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
          <ComboBox
            label='Admin Office'
            url={`/api/offices?sortPriority=3&q=`}
            setValue={(office) => setFormValue('admin_office_code')(office?.office_code ?? '')}
            value={adminOfficeApiData?.office ?? null}
            placeholder='Select Admin Office'
            dataKey='office_code'
            displayKey='office_name'
            displayValue2='office_code'
            error={errors?.admin_office_code}
            required
          />

          <ComboBox
            label='Service Office'
            url={`/api/offices?sortPriority=3&q=`}
            setValue={(office) => setFormValue('service_office_code')(office?.office_code ?? '')}
            value={serviceOfficeApiData?.office ?? null}
            placeholder='Select Service Office'
            dataKey='office_code'
            displayKey='office_name'
            displayValue2='office_code'
            error={errors?.service_office_code}
            disabled={connection?.service_office_code ? true : false}
            required
          />
        </div>
      </Card>

      {/* Categorization */}
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Categorization</StrongText>
        </div>
        <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
          <SelectList
            label='Primary Purpose'
            list={primaryPurposes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('primary_purpose_id')}
            value={formData.primary_purpose_id}
            error={errors?.primary_purpose_id}
            required
          />

          {tariff && tariff?.length > 0 && (
            <SelectList
              label='Tariff Type'
              list={tariff}
              dataKey='tariff_id'
              displayKey='tariff_name'
              setValue={handleSetTariff}
              value={formData.tariff_type_id}
              error={errors?.tariff_type_id}
              required
            />
          )}
          <SelectList
            label='Billing Process'
            list={billingProcesses}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('billing_process_id')}
            value={formData.billing_process_id}
            error={errors?.billing_process_id}
            required
          />
          <SelectList
            label='Connection Category'
            list={connectionCategory}
            dataKey='id'
            displayKey='parameter_value'
            setValue={handleConnectionCategoryChange}
            value={formData.connection_category_id}
            error={errors?.connection_category_id}
            required
          />
          {subCategories && formData.connection_category_id && (
            <SelectList
              label='Connection Subcategory'
              list={subCategories}
              dataKey='id'
              displayKey='parameter_value'
              setValue={setFormValue('connection_subcategory_id')}
              value={formData.connection_subcategory_id}
              error={errors?.connection_subcategory_id}
              required
            />
          )}
          <SelectList
            label='Metering Type'
            list={meteringTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('metering_type_id')}
            value={formData.metering_type_id}
            error={errors?.metering_type_id}
            required
          />

          <SelectList
            label='Billing Side'
            list={billingSides}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('billing_side_id')}
            value={formData.billing_side_id}
            error={errors?.billing_side_id}
            required
          />
          <SelectList
            label='Phase Type'
            list={phaseTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('phase_type_id')}
            value={formData.phase_type_id}
            error={errors?.phase_type_id}
            required
          />

          <MultiSelectList
            label='Other Purposes'
            list={otherPurposeList}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('other_purposes')}
            value={formData.other_purposes}
            error={errors?.other_purposes}
          />
        </div>
      </Card>
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Load & Capacity</StrongText>
        </div>
        <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
          <Input
            label='Contract Demand (kVA)'
            setValue={setFormValue('contract_demand_kw_val')}
            value={formData.contract_demand_kw_val}
            error={errors?.contract_demand_kw_val}
            required
          />
          <div className='col-span-2 grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Input
              label='Power Load (kW)'
              setValue={setFormValue('power_load_kw_val')}
              value={formData.power_load_kw_val}
              error={errors?.power_load_kw_val}
              required
            />
            <Input
              label='Light Load (kW)'
              setValue={setFormValue('light_load_kw_val')}
              value={formData.light_load_kw_val}
              error={errors?.light_load_kw_val}
              required
            />
            <Input
              label='Connected Load (kW)'
              setValue={setFormValue('connected_load_kw_val')}
              value={formData?.connected_load_kw_val}
              error={errors?.connected_load_kw_val}
              disabled={true}
            />
          </div>
        </div>
      </Card>

      {!connection && (
        <Card>
          <div className='border-b-2 border-gray-200 py-3'>
            <StrongText className='text-base font-semibold'>Prosumers</StrongText>
          </div>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
            <CheckBox
              label='Prosumers'
              value={formData.prosumers}
              toggleValue={toggleBoolean('prosumers')}
            />
          </div>
          <ConnectionGenerationTypeForm
            generationData={generationData}
            updateGenerationData={updateGenerationData}
            updateGenerationSubTypeData={updateGenerationSubTypeData}
            prosumers={formData.prosumers}
          />
        </Card>
      )}
      {!connection && (
        <ConnectionFlagForm
          flagData={flagData}
          updateFlagData={updateFlagData}
        />
      )}

      {/* Submit */}
      {!connection && (
        <div className='flex justify-end'>
          <Button
            variant={'default'}
            type='submit'
            disabled={loading}
          >
            SUBMIT
          </Button>
        </div>
      )}
    </form>
  )
}
