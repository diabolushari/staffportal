import { Card } from '@/components/ui/card'
import type { Meter, MeterAssignment } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import { getDisplayDate } from '@/utils'
import { router } from '@inertiajs/react'
import {
  Barcode,
  Calendar,
  Cpu,
  Factory,
  Hash,
  Plus,
  Settings,
  Shield,
  Trash2,
  Wrench,
  Zap,
} from 'lucide-react'

type ConnectionMeter = {
  relationship: MeterAssignment
  meter: Meter
}

interface MeterTabProps {
  meters: ConnectionMeter[] | null
  connectionId: number
}

export function MeterTab({ meters, connectionId }: Readonly<MeterTabProps>) {
  function handleMeterClick(meterId: number) {
    router.get(`/meters/${meterId}`)
  }

  function handleAddMeter() {
    router.visit(route('connection.meter.create', { id: connectionId }))
  }

  function handleDeleteMeter(rel_id: number) {
    router.delete(route('meter-connection-rel.destroy', { id: rel_id }))
  }

  return (
    <Card className='relative w-full rounded-lg bg-white'>
      <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
        <StrongText className='text-lg font-semibold text-gray-900'>Meter Information</StrongText>
        <button
          onClick={handleAddMeter}
          className='inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
        >
          <Plus className='h-4 w-4' />
          Add Meter
        </button>
      </div>
      <div className='flex flex-col px-6 pb-6'>
        {meters && meters.length > 0 ? (
          meters.map((meterData) => {
            const { meter, relationship } = meterData
            return (
              <div
                key={meter.meter_id}
                className='mb-4 rounded-lg border border-gray-200 bg-white px-3 py-4 transition-shadow last:mb-0 hover:shadow-md'
              >
                <button
                  type='button'
                  className='flex w-full items-start justify-between text-left'
                  onClick={() => handleMeterClick(meter.meter_id)}
                >
                  {/* Left side info */}
                  <div className='flex flex-1 flex-col gap-3 p-2'>
                    <div className='flex flex-col gap-2'>
                      {/* Serial + Seal + Status */}
                      <div className='flex flex-wrap items-center gap-3'>
                        <div className='font-inter text-lg font-semibold text-black'>
                          {meter.meter_serial}
                        </div>
                        {meter.company_seal_num && (
                          <div className='rounded-full bg-blue-100 px-3 py-1'>
                            <div className='font-inter text-xs text-blue-800'>
                              Seal: {meter.company_seal_num}
                            </div>
                          </div>
                        )}
                        {relationship.meter_status && (
                          <div
                            className={`rounded-full px-3 py-1 ${
                              relationship.meter_status.parameter_value === 'Working'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <div className='font-inter text-xs'>
                              {relationship.meter_status.parameter_value}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Meter Type + Make + Category */}
                      <div className='flex w-full flex-wrap items-center gap-5 text-sm text-slate-600'>
                        {meter.meter_type && (
                          <div className='flex items-center gap-1'>
                            <Cpu className='h-4 w-4 text-slate-500' />
                            Type: {meter.meter_type.parameter_value}
                          </div>
                        )}
                        {meter.meter_make && (
                          <div className='flex items-center gap-1'>
                            <Factory className='h-4 w-4 text-slate-500' />
                            Make: {meter.meter_make.parameter_value}
                          </div>
                        )}
                        {relationship.meter_use_category && (
                          <div className='flex items-center gap-1'>
                            <Settings className='h-4 w-4 text-slate-500' />
                            {relationship.meter_use_category.parameter_value}
                          </div>
                        )}
                      </div>

                      {/* Accuracy class + ownership + Phase */}
                      <div className='flex w-full flex-wrap items-center gap-5 text-sm text-slate-600'>
                        {meter.accuracy_class && (
                          <div className='flex items-center gap-1'>
                            <Shield className='h-4 w-4 text-slate-500' />
                            Accuracy: {meter.accuracy_class.parameter_value}
                          </div>
                        )}
                        {meter.ownership_type && (
                          <div className='flex items-center gap-1'>
                            <Barcode className='h-4 w-4 text-slate-500' />
                            Owner: {meter.ownership_type.parameter_value}
                          </div>
                        )}
                        {meter.meter_phase && (
                          <div className='flex items-center gap-1'>
                            <Zap className='h-4 w-4 text-slate-500' />
                            Phase: {meter.meter_phase.parameter_value}
                          </div>
                        )}
                      </div>

                      {/* Technical specs */}
                      <div className='flex w-full flex-wrap items-center gap-5 text-sm text-slate-600'>
                        <div className='flex items-center gap-1'>
                          <Hash className='h-4 w-4 text-slate-500' />
                          Constant: {meter.meter_constant}
                        </div>
                        <div className='flex items-center gap-1'>
                          <Wrench className='h-4 w-4 text-slate-500' />
                          MF: {meter.meter_mf}
                        </div>
                        <div className='flex items-center gap-1'>
                          <Settings className='h-4 w-4 text-slate-500' />
                          Digits: {meter.digit_count}
                        </div>
                        <div className='flex items-center gap-1'>
                          <Calendar className='h-4 w-4 text-slate-500' />
                          Warranty: {meter.warranty_period}m
                        </div>
                      </div>

                      {/* Dates */}
                      <div className='flex w-full flex-wrap items-center gap-5 text-sm text-slate-600'>
                        {meter.manufacture_date && (
                          <div className='flex items-center gap-1'>
                            <Calendar className='h-4 w-4 text-slate-500' />
                            Mfg: {getDisplayDate(meter.manufacture_date)}
                          </div>
                        )}
                        {meter.supply_date && (
                          <div className='flex items-center gap-1'>
                            <Calendar className='h-4 w-4 text-slate-500' />
                            Supply: {getDisplayDate(meter.supply_date)}
                          </div>
                        )}
                        {relationship.faulty_date && (
                          <div className='flex items-center gap-1 text-red-600'>
                            <Calendar className='h-4 w-4 text-red-500' />
                            Faulty: {getDisplayDate(relationship.faulty_date)}
                          </div>
                        )}
                      </div>

                      {/* Batch code and billing mode */}
                      {(meter.batch_code || relationship.meter_billing_mode) && (
                        <div className='flex w-full flex-wrap items-center gap-5 text-sm text-slate-600'>
                          {meter.batch_code && (
                            <div className='flex items-center gap-1'>
                              <Barcode className='h-4 w-4 text-slate-500' />
                              Batch: {meter.batch_code}
                            </div>
                          )}
                          <div className='flex items-center gap-1'>
                            <Settings className='h-4 w-4 text-slate-500' />
                            Billing: {relationship.meter_billing_mode}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side status indicators */}
                  <div className='flex flex-col items-end gap-2 py-2 pr-2 pl-4'>
                    <div
                      className={`rounded-full px-3 py-1 ${
                        meter.smart_meter_ind ? 'bg-green-100' : 'bg-gray-100'
                      }`}
                    >
                      <div
                        className={`font-inter text-xs font-medium ${
                          meter.smart_meter_ind ? 'text-green-700' : 'text-gray-700'
                        }`}
                      >
                        {meter.smart_meter_ind ? 'Smart' : 'Standard'}
                      </div>
                    </div>

                    {relationship.bidirectional_ind && (
                      <div className='rounded-full bg-purple-100 px-3 py-1'>
                        <div className='font-inter text-xs font-medium text-purple-700'>
                          Bidirectional
                        </div>
                      </div>
                    )}

                    <div
                      className={`rounded-full px-3 py-1 ${
                        relationship.is_active ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    >
                      <div
                        className={`font-inter text-xs font-medium ${
                          relationship.is_active ? 'text-green-700' : 'text-red-700'
                        }`}
                      >
                        {relationship.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    handleDeleteMeter(relationship.rel_id)
                  }}
                  className='inline-flex items-center justify-center rounded-md border border-red-200 bg-white px-2 py-1 text-red-600 shadow-sm transition-colors hover:border-red-300 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
                  title='Delete meter'
                >
                  <Trash2 className='h-4 w-4' />
                </button>
              </div>
            )
          })
        ) : (
          <div className='p-8 text-center text-slate-500'>
            <div className='flex flex-col items-center gap-2'>
              <Cpu className='h-12 w-12 text-slate-300' />
              <p className='text-lg font-medium'>No meters found</p>
              <p className='text-sm'>No meters are associated with this connection.</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
