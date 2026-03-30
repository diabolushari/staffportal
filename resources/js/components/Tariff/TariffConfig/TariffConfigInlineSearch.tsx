import { router } from '@inertiajs/react'
import { useState } from 'react'
import Input from '@/ui/form/Input'
import Button from '@/ui/button/Button'
import { ParameterValues } from '@/interfaces/parameter_types'
import useCustomForm from '@/hooks/useCustomForm'
import { TariffOrder } from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'

interface Props {
  oldConnectionTariffId: number
  connectionTariffs: ParameterValues[]
  tariffOrder: TariffOrder
}

export default function TariffConfigInlineSearch({
  oldConnectionTariffId,
  connectionTariffs,
  tariffOrder,
}: Props) {
  const { formData, setFormValue } = useCustomForm<{ connection_tariff_id: number }>({
    connection_tariff_id: oldConnectionTariffId ?? '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    router.get(route('tariff-orders.show', tariffOrder.tariff_order_id), formData)
  }
  return (
    <form
      onSubmit={handleSubmit}
      className='mb-4 flex w-full items-center gap-3'
    >
      <div className='flex-1'>
        <SelectList
          value={formData.connection_tariff_id}
          setValue={setFormValue('connection_tariff_id')}
          list={connectionTariffs}
          dataKey='id'
          displayKey='parameter_value'
          showAllOption
          allOptionText='All Tariff Config'
          className='w-full'
        />
      </div>
      <Button
        type='submit'
        label='Search'
      />
    </form>
  )
}
