import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import DatePicker from '@/ui/form/DatePicker'
import Modal from '@/ui/Modal/Modal'
import { TariffConfig, TariffOrder } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import dayjs from 'dayjs'

interface PageProps {
  tariffOrder: TariffOrder
  connectionTariffs: ParameterValues[]
  setModalOpen: (open: boolean) => void
  tariffConfig?: TariffConfig | null
}

export default function TariffConfigForm({
  tariffOrder,
  connectionTariffs,
  setModalOpen,
  tariffConfig,
}: Readonly<PageProps>) {
  const { formData, setFormValue } = useCustomForm({
    tariff_order_id: tariffOrder.tariff_order_id,
    connection_tariff: tariffConfig?.connection_tariff?.id ?? '',
    consumption_lower_limit: tariffConfig?.consumption_lower_limit ?? '',
    consumption_upper_limit: tariffConfig?.consumption_upper_limit ?? '',
    demand_charge_kva: tariffConfig?.demand_charge_kva ?? '',
    energy_charge_kwh: tariffConfig?.energy_charge_kwh ?? '',
    effective_start:
      tariffConfig?.effective_start ?? dayjs(tariffOrder.effective_start).format('YYYY-MM-DD'),
    effective_end: tariffOrder.effective_end
      ? dayjs(tariffOrder.effective_end).format('YYYY-MM-DD')
      : '',
    tariff_config_id: tariffConfig?.tariff_config_id ?? '',
    _method: tariffConfig ? 'PUT' : 'POST',
  })

  const { post, loading, errors } = useInertiaPost<typeof formData>(
    tariffConfig
      ? route('tariff-configs.update', tariffConfig?.tariff_config_id)
      : route('tariff-configs.store'),
    {
      showErrorToast: true,
      onComplete: () => {
        setModalOpen(false)
      },
    }
  )

  const handleSubmit = () => {
    post(formData)
  }

  return (
    <div>
      {/* Modal contains the only form */}
      <Modal
        title='Add Tariff Config'
        setShowModal={setModalOpen}
        showClosButton={true}
        large={true}
      >
        <div className='grid gap-4 md:grid-cols-2'>
          <SelectList
            label='Connection Tariff'
            list={connectionTariffs}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('connection_tariff')}
            value={formData.connection_tariff}
            error={errors.connection_tariff}
            required
            disabled={!!tariffConfig}
          />

          <Input
            label='Consumption Lower Limit'
            type='number'
            value={formData.consumption_lower_limit}
            setValue={setFormValue('consumption_lower_limit')}
            error={errors.consumption_lower_limit}
            required
          />

          <Input
            label='Consumption Upper Limit'
            type='number'
            value={formData.consumption_upper_limit}
            setValue={setFormValue('consumption_upper_limit')}
            error={errors.consumption_upper_limit}
          />

          <Input
            label='Demand Charge KVA'
            type='number'
            value={formData.demand_charge_kva}
            setValue={setFormValue('demand_charge_kva')}
            required
            error={errors.demand_charge_kva}
          />

          <Input
            label='Energy Charge KWH'
            type='number'
            value={formData.energy_charge_kwh}
            setValue={setFormValue('energy_charge_kwh')}
            required
            error={errors.energy_charge_kwh}
          />

          <DatePicker
            label='Effective Start'
            value={formData.effective_start}
            setValue={setFormValue('effective_start')}
            error={errors.effective_start}
            required
          />

          <DatePicker
            label='Effective End'
            value={formData.effective_end}
            setValue={setFormValue('effective_end')}
            error={errors.effective_end}
          />
        </div>

        {Object.keys(errors).length > 0 && (
          <div className='mt-2 text-sm text-red-600'>
            {Object.values(errors).map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}

        <div className='mt-4 flex justify-between'>
          <Button
            type='button'
            label='Cancel'
            onClick={() => setModalOpen(false)}
            variant='secondary'
          />
          <Button
            type='button'
            label='Save'
            onClick={handleSubmit}
            disabled={loading}
            variant={loading ? 'loading' : 'default'}
            processing={loading}
          />
        </div>
      </Modal>
    </div>
  )
}
