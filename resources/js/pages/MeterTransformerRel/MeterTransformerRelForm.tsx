import SelectUnassignedTransformerModal from '@/components/Meter/MeterTransformer/SelectUnassignedTransformerModal'
import { consumerNavItems } from '@/components/Navbar/navitems'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import {
  Connection,
  Meter,
  MeterTransformer,
  MeterTransformerAssignment,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import Card from '@/ui/Card/Card'
import Datepicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { router } from '@inertiajs/react'
import React, { useMemo, useState } from 'react'

interface MeterTransformerRelFormProps {
  meter: Meter
  statuses: ParameterValues[]
  changeReasons: ParameterValues[]
  relation?: MeterTransformerAssignment
  connection: Connection
  transformerTypes: ParameterValues[]
}

export default function MeterTransformerRelForm({
  meter,
  statuses,
  relation,
  connection,
  transformerTypes,
}: Readonly<MeterTransformerRelFormProps>) {
  const isEditing = Boolean(relation)
  const [showModal, setShowModal] = useState(false)
  const [selectedTransformer, setSelectedTransformer] = useState<MeterTransformer | null>(null)

  const breadcrumbs = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Connections',
      href: route('connections.index'),
    },
    {
      title: connection?.consumer_number.toString(),
      href: route('connections.show', connection?.connection_id),
    },
    {
      title: 'Transformers',
      href: route('connections.meters.ctpts', connection?.connection_id),
    },
    {
      title: isEditing ? 'Modify CTPT' : 'Connect CTPT',
      href: route('connections.meters.ctpt.create', {
        connection_id: connection.connection_id,
        id: meter.meter_id,
      }),
    },
  ]

  const { formData, setFormValue } = useCustomForm({
    version_id: relation?.version_id ?? '',
    ctpt_id: relation?.ctpt_id.toString() ?? '',
    meter_id: meter?.meter_id.toString() ?? '',
    status_id: relation?.status_id ?? '',
    change_reason_id: relation?.change_reason_id ?? '',
    faulty_date: relation?.faulty_date ?? '',
    ctpt_energise_date: relation?.ctpt_energise_date ?? '',
    ctpt_change_date: relation?.ctpt_change_date ?? '',
    _method: isEditing ? 'PUT' : undefined,
    connection_id: connection.connection_id.toString() ?? '',
  })
  
  const { post, loading, errors } = useInertiaPost<typeof formData>(
    isEditing ? `/meter-ctpt-rel/${relation?.version_id}` : '/meter-ctpt-rel'
  )

  const handleTransformerSelect = (transformer: MeterTransformer) => {
    setSelectedTransformer(transformer)
    setFormValue('ctpt_id')(transformer.meter_ctpt_id.toString())
  }

  const handleClearSelection = () => {
    setSelectedTransformer(null)
    setFormValue('ctpt_id')('')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post({
      ...formData,
    })
  }

  const selectedStatusRecord = useMemo(() => {
    return statuses?.find((status) => status.id === formData.status_id)
  }, [statuses, formData.status_id])

  return (
    <ConnectionsLayout
      connectionsNavItems={consumerNavItems}
      value='configuration'
      subTabValue='meter-ctpts'
      heading='Meter and CTPTs'
      description='CTPTs connected with meters'
      breadcrumbs={breadcrumbs}
      connectionId={connection.connection_id}
      connection={connection}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-2'>
        <form
          onSubmit={handleSubmit}
          className='space-y-8'
        >
          <Card>
            <div className='border-b-2 border-gray-200 py-3'>
              <StrongText className='text-base font-semibold'>CTPT Information</StrongText>
            </div>
            <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  CT/PT
                </label>
                <div className='flex gap-2'>
                  <Input
                    value={
                      selectedTransformer
                        ? `${selectedTransformer.type?.parameter_value ?? ''} - ${selectedTransformer.ctpt_serial}`
                        : ''
                    }
                    setValue={() => {}}
                    disabled
                    error={errors.ctpt_id}
                  />
                  <Button
                    type='button'
                    label='Select'
                    onClick={() => setShowModal(true)}
                    variant='secondary'
                    disabled={loading}
                  />
                  {selectedTransformer && (
                    <Button
                      type='button'
                      label='Clear'
                      onClick={handleClearSelection}
                      variant='secondary'
                      disabled={loading}
                    />
                  )}
                </div>
              </div>
              <Input
                label='Meter Serial'
                value={meter.meter_serial}
                setValue={setFormValue('meter_id')}
                error={errors.meter_id}
                disabled
              />
              <div className='grid grid-cols-1 md:col-span-2 md:grid-cols-2'>
                <Datepicker
                  label='CT/PT Energise Date'
                  value={formData.ctpt_energise_date}
                  setValue={setFormValue('ctpt_energise_date')}
                  error={errors.ctpt_energise_date}
                  placeholder='dd/mm/yyyy'
                />
              </div>
              {statuses != null && (
                <SelectList
                  label='Status'
                  value={formData.status_id}
                  setValue={setFormValue('status_id')}
                  list={statuses}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.status_id}
                />
              )}
              {/* <DatePicker
                label='Faulty Date'
                value={formData.faulty_date}
                setValue={setFormValue('faulty_date')}
                error={errors.faulty_date}
                disabled={selectedStatusRecord?.parameter_value.toLocaleLowerCase() !== 'faulty'}
              />
              {changeReasons != null && (
                <SelectList
                  label='Change Reason'
                  value={formData.change_reason_id}
                  setValue={setFormValue('change_reason_id')}
                  list={changeReasons}
                  dataKey='id'
                  displayKey='parameter_value'
                  error={errors.change_reason_id}
                />
              )}
              <DatePicker
                label='CT/PT Change Date'
                value={formData.ctpt_change_date}
                setValue={setFormValue('ctpt_change_date')}
                error={errors.ctpt_change_date}
                disabled
              /> */}
            </div>
          </Card>
          <div className='flex justify-end gap-3 border-t pt-6'>
            <Button
              type='button'
              label='Cancel'
              variant='secondary'
              onClick={() => router.get(route('connection.meters', connection.connection_id))}
              disabled={loading}
            />
            <Button
              type='submit'
              label={isEditing ? 'Update Relation' : 'Connect CTPT'}
              disabled={loading}
            />
          </div>
        </form>
      </div>

      {showModal && (
        <SelectUnassignedTransformerModal
          onClose={() => setShowModal(false)}
          onSelect={handleTransformerSelect}
          currentSelection={selectedTransformer}
          transformerTypes={transformerTypes}
        />
      )}
    </ConnectionsLayout>
  )
}
