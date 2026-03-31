import { Card } from '@/components/ui/card'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { TariffConfig, TariffOrder } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import Datepicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'

interface Props {
  tariff_config: TariffConfig
  tariffOrders: TariffOrder[]
  consumptionTariffs: ParameterValues[]
  connectionPurposes: ParameterValues[]
}

const convertToDate = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toISOString().split('T')[0]
}

export default function TariffConfigEditForm({
  tariff_config,
  tariffOrders,
  consumptionTariffs,
  connectionPurposes,
}: Props) {
  const { formData, setFormValue } = useCustomForm({
    tariff_config_id: tariff_config.tariff_config_id,
    tariff_order_id: tariff_config.tariff_order_id.toString() ?? '',
    connection_tariff_id: tariff_config.connection_tariff?.id?.toString() ?? '',
    connection_purpose_id: tariff_config.connection_purpose?.id?.toString() ?? '',
    effective_start: convertToDate(tariff_config.effective_start ?? '') ?? '',
    effective_end: convertToDate(tariff_config.effective_end ?? '') ?? '',
    consumption_lower_limit: tariff_config.consumption_lower_limit.toString() ?? 0,
    consumption_upper_limit: tariff_config.consumption_upper_limit.toString() ?? 0,
    demand_charge_kva: tariff_config.demand_charge_kva.toString() ?? 0,
    energy_charge_kwh: tariff_config.energy_charge_kwh.toString() ?? 0,
    _method: 'PUT',
  })
  
  const { post, errors, loading } = useInertiaPost<typeof formData>(
    route('tariff-configs.update', tariff_config.tariff_config_id)
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <div className='flex justify-between border-b-2 border-gray-200 py-4'>
          <StrongText className='text-base font-semibold'>Basic Information</StrongText>
        </div>
        <div className='mt-4 md:grid md:grid-cols-2 md:gap-4'>
          {tariffOrders && (
            <SelectList
              label='Tariff Order'
              list={tariffOrders}
              dataKey='tariff_order_id'
              displayKey='order_descriptor'
              setValue={setFormValue('tariff_order_id')}
              value={formData.tariff_order_id}
              error={errors.tariff_order_id}
              disabled={true}
            />
          )}
        </div>
        <div className='grid gap-4 md:grid-cols-2'>
          {connectionPurposes && (
            <SelectList
              label='Connection Purpose'
              list={connectionPurposes}
              dataKey='id'
              displayKey='parameter_value'
              setValue={setFormValue('connection_purpose_id')}
              value={formData.connection_purpose_id}
            />
          )}
          {consumptionTariffs && (
            <SelectList
              label='Connection Tariff'
              list={consumptionTariffs}
              dataKey='id'
              displayKey='parameter_value'
              setValue={setFormValue('connection_tariff_id')}
              value={formData.connection_tariff_id}
              disabled={true}
            />
          )}
          <Input
            label='Consumption Lower Limit'
            type='number'
            value={formData.consumption_lower_limit}
            setValue={setFormValue('consumption_lower_limit')}
          />
          <Input
            label='Consumption Upper Limit'
            type='number'
            value={formData.consumption_upper_limit}
            setValue={setFormValue('consumption_upper_limit')}
          />
          <Input
            label='Demand Charge KVA'
            type='number'
            value={formData.demand_charge_kva}
            setValue={setFormValue('demand_charge_kva')}
          />
          <Input
            label='Energy Charge KWH'
            type='number'
            value={formData.energy_charge_kwh}
            setValue={setFormValue('energy_charge_kwh')}
          />
          <Datepicker
            label='Effective Start'
            value={formData.effective_start}
            setValue={setFormValue('effective_start')}
          />
          <Datepicker
            label='Effective End'
            value={formData.effective_end}
            setValue={setFormValue('effective_end')}
          />
        </div>
      </Card>
      {/* Modal */}

      <div className='mt-4 flex justify-between'>
        <Button
          type='submit'
          disabled={loading}
          label={loading ? 'Saving...' : 'Save'}
        />
      </div>
    </form>
  )
}
