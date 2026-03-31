import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import { router } from '@inertiajs/react'

import ConnectMeterTransformerModal from '@/components/Connections/ConnectionMeter/ConnectMeterTransformerModal'
import SelectUnassignedMeterModal from '@/components/Connections/ConnectionMeter/SelectUnassignedMeterModal'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import {
  Connection,
  Meter,
  MeterConnectionMapping,
  MeterTransformer,
  MeterTransformerAssignment,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import Datepicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { useEffect, useState } from 'react'

interface Props {
  connection_id: number
  relation?: MeterConnectionMapping
  useCategory: ParameterValues[]
  meterStatus: ParameterValues[]
  changeReason: ParameterValues[]
  connection: Connection
  ctpts: MeterTransformer[]
  statuses: ParameterValues[]
  changeReasons: ParameterValues[]
  meterProfiles: ParameterValues[]
  timezoneTypes: ParameterValues[]
}

export default function ConnectMeterForm({
  connection_id,
  relation,
  useCategory,
  meterStatus,
  connection,
  ctpts,
  statuses,
  meterProfiles,
  timezoneTypes,
}: Readonly<Props>) {
  const [meterTransformers, setMeterTransformers] = useState<MeterTransformerAssignment[]>([])

  const [showModal, setShowModal] = useState(false)
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null)
  const [showMeterModal, setShowMeterModal] = useState(false)

  const [selectedUseCategory, setSelectedUseCategory] = useState<ParameterValues | null>(null)
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    rel_id: relation?.rel_id ?? '',
    connection_id: connection_id,
    meter_id: relation?.meter_id ?? '',
    meter_use_category: relation?.meter_use_category?.id ?? '',
    meter_profile_id: relation?.meter_profile?.id ?? '',
    meter_status_id: relation?.meter_status?.id ?? '',
    timezone_type_id:
      relation?.meter?.meter_timezone_type_rel?.[0]?.timezone_type?.id?.toString() ?? '',
    sort_priority: relation?.sort_priority ?? '0',
    is_meter_reading_mandatory: relation?.is_meter_reading_mandatory ?? false,
    meter_mf: relation?.meter_mf ?? '',
    energise_date: relation?.energise_date ?? '',
    _method: relation ? 'PUT' : undefined,
    meter_transformers: meterTransformers,
  })

  useEffect(() => {
    if (relation?.meter) {
      setSelectedMeter(relation.meter)

      setFormValue('meter_id')(relation.meter.meter_id.toString())
    }
    if (relation?.energise_date) {
      setFormValue('energise_date')(relation.energise_date)
    }
  }, [relation, setFormValue])

  const { post, loading, errors } = useInertiaPost<typeof formData>(
    relation
      ? route('meter-connection-rel.update', connection_id)
      : route('meter-connection-rel.store'),
    {
      showErrorToast: true,
    }
  )

  useEffect(() => {
    setFormValue('meter_transformers')(meterTransformers)
  }, [meterTransformers, setFormValue])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    post(formData)
  }

  useEffect(() => {
    if (formData.meter_use_category) {
      const selectedCategory = useCategory.find(
        (category) => category.id == Number(formData.meter_use_category)
      )
      if (selectedCategory != null) {
        setSelectedUseCategory(selectedCategory)
        if (selectedCategory.parameter_value == 'Energy Consumption') {
          setFormValue('meter_mf')('')
        }
      }
    }
  }, [formData.meter_use_category, useCategory, setFormValue])

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Connections',
      href: route('connections.index'),
    },
    {
      title: connection?.consumer_number.toString() ?? '',
      href: route('connections.show', connection?.connection_id ?? 0),
    },
    {
      title: 'Meters',
      href: route('connection.meters', connection?.connection_id),
    },
    {
      title: 'Connect Meter',
      href: route('connection.meter.create', connection?.connection_id),
    },
  ]
  const availableCtpts = ctpts?.filter(
    (ct) => !meterTransformers?.some((m) => m.ctpt_id == ct.meter_ctpt_id)
  )
  const handleClearSelection = () => {
    setSelectedMeter(null)
    setFormValue('meter_id')('')
  }

  return (
    <ConnectionsLayout
      connectionsNavItems={consumerNavItems}
      breadcrumbs={breadcrumbs}
      value='configuration'
      subTabValue='meter'
      heading='Connect Meter'
      description=''
      connectionId={connection?.connection_id ?? 0}
      connection={connection}
    >
      <form
        onSubmit={handleSubmit}
        className='space-y-8'
      >
        <Card>
          <div className='border-b-2 border-gray-200 py-3'>
            <StrongText className='text-base font-semibold'>Connect Meter</StrongText>
          </div>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Meter
              </label>
              <div className='flex gap-2'>
                <Input
                  value={
                    selectedMeter
                      ? `#${selectedMeter.meter_id} - ${selectedMeter.meter_serial}`
                      : ''
                  }
                  setValue={() => {}}
                  disabled
                  error={errors.meter_id}
                />
                <Button
                  type='button'
                  label='Select'
                  onClick={() => setShowMeterModal(true)}
                  variant='secondary'
                  disabled={loading || !!relation}
                />
                {selectedMeter && (
                  <Button
                    type='button'
                    label='Clear'
                    onClick={handleClearSelection}
                    variant='secondary'
                    disabled={loading || !!relation}
                  />
                )}
              </div>
            </div>
            <SelectList
              label='Meter Status'
              value={formData.meter_status_id}
              setValue={setFormValue('meter_status_id')}
              list={meterStatus}
              dataKey='id'
              displayKey='parameter_value'
              error={errors.meter_status_id}
              disabled={!!relation}
              required
            />

            <SelectList
              label='Meter Use Category'
              value={formData.meter_use_category}
              setValue={setFormValue('meter_use_category')}
              list={useCategory}
              dataKey='id'
              displayKey='parameter_value'
              error={errors.meter_use_category}
              required
            />
            {selectedUseCategory?.parameter_value !== 'Energy Consumption' && (
              <Input
                type='number'
                label='MF'
                value={formData.meter_mf}
                setValue={setFormValue('meter_mf')}
                error={errors.meter_mf}
              />
            )}

            <SelectList
              label='Metering Profile'
              value={formData.meter_profile_id}
              setValue={setFormValue('meter_profile_id')}
              list={meterProfiles}
              dataKey='id'
              displayKey='parameter_value'
              error={errors.meter_profile_id}
              required
            />

            <SelectList
              label='Meter Timezone'
              value={formData.timezone_type_id}
              setValue={setFormValue('timezone_type_id')}
              list={timezoneTypes}
              dataKey='id'
              displayKey='parameter_value'
              error={errors.timezone_type_id}
              required
            />

            <Input
              label='Sort Priority'
              type='number'
              value={formData.sort_priority}
              setValue={setFormValue('sort_priority')}
              error={errors.sort_priority}
            />
            <Datepicker
              label='Energise Date'
              value={formData.energise_date}
              setValue={setFormValue('energise_date')}
              error={errors.energise_date}
              placeholder='dd/mm/yyyy'
            />

            <CheckBox
              label='Meter Reading Mandatory'
              value={formData.is_meter_reading_mandatory}
              toggleValue={toggleBoolean('is_meter_reading_mandatory')}
              error={errors.is_meter_reading_mandatory}
            />
          </div>

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
              label={relation ? 'Save Changes' : 'Connect Meter'}
              disabled={loading}
            />
          </div>
        </Card>
      </form>

      {showModal && (
        <ConnectMeterTransformerModal
          setShowModal={setShowModal}
          relation={relation}
          statuses={statuses}
          ctpts={availableCtpts}
          onAdd={(item) => {
            setMeterTransformers((prev) => [...prev, item])
          }}
        />
      )}
      {showMeterModal && (
        <SelectUnassignedMeterModal
          onClose={() => setShowMeterModal(false)}
          onSelect={(item) => {
            setSelectedMeter(item)
            setFormValue('meter_id')(item.meter_id.toString())
          }}
          currentSelection={selectedMeter}
        />
      )}
    </ConnectionsLayout>
  )
}
