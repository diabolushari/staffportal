import { Button } from '@/components/ui/button'
import { MeterConnectionMapping, MeterTransformerAssignment } from '@/interfaces/data_interfaces'
import { router } from '@inertiajs/react'
import {
  Activity,
  ArrowLeftRight,
  Calendar,
  Cpu,
  Link2,
  Plug,
  Settings,
  Wrench,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import ChangeMeterTransformerAssignment from './ChangeMeterTransformerAssignment'
import { ParameterValues } from '@/interfaces/parameter_types'
import UpdateMeterTransformerAssignmentStatus from './UpdateMeterTransformerAssignmentStatus'
import DeleteButton from '@/ui/button/DeleteButton'
import { getDisplayDate } from '@/utils'

interface Props {
  meterMapping: MeterConnectionMapping
  connectionId: number
  onDelete: (mapping: MeterConnectionMapping) => void
  onEdit: (mappingId: number) => void
  onMeterStatusChange: (meter: MeterConnectionMapping) => void
  onMeterChange: (meter: MeterConnectionMapping) => void
  onMeterProfileChange: (mapping: MeterConnectionMapping) => void
  changeReasons: ParameterValues[]
  statuses: ParameterValues[]
}

export default function ConnectionCardSection({
  meterMapping,
  connectionId,
  changeReasons,
  onDelete,
  onEdit,
  onMeterStatusChange,
  onMeterChange,
  onMeterProfileChange,
  statuses,
}: Readonly<Props>) {
  const meterTransformers = meterMapping.meter?.transformers

  const [change, setChange] = useState<boolean>(false)

  const [updateStatus, setUpdateStatus] = useState<boolean>(false)

  const [selectedCtpt, setSelectedCtpt] = useState<MeterTransformerAssignment | null>(null)

  useEffect(() => {
    if (!change && !updateStatus) {
      setSelectedCtpt(null)
    }
  }, [change, updateStatus])

  return (
    <div
      key={meterMapping.version_id}
      className='mb-6 last:mb-0'
    >
      <div className='flex items-start justify-between pb-4'>
        <div className='flex flex-1 flex-col gap-2'>
          <div className='flex flex-wrap items-center gap-3'>
            <a
              href={`/meters/${meterMapping.meter_id}`}
              target='__blank'
            >
              <h3 className='cursor-pointer text-lg font-semibold text-black hover:text-blue-600'>
                {meterMapping.meter?.meter_serial}
              </h3>
            </a>
            {meterMapping.meter_status && (
              <div
                className={`rounded-full px-3 py-1 ${
                  meterMapping.meter_status?.parameter_value === 'Working'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <span className='text-xs font-medium'>
                  {meterMapping.meter_status?.parameter_value}
                </span>
              </div>
            )}
          </div>
          <div className='flex flex-wrap items-center gap-5 text-sm text-slate-600'>
            {meterMapping.meter?.meter_type != null && (
              <div className='flex items-center gap-1.5'>
                <Cpu className='h-4 w-4 text-slate-500' />
                <span>{meterMapping.meter?.meter_type?.parameter_value}</span>
              </div>
            )}
            {meterMapping.meter_use_category != null && (
              <div className='flex items-center gap-1.5'>
                <Settings className='h-4 w-4 text-slate-500' />
                <span>{meterMapping.meter_use_category?.parameter_value}</span>
              </div>
            )}
            {meterMapping?.meter?.meter_timezone_type_rel &&
              meterMapping?.meter?.meter_timezone_type_rel?.length > 0 && (
                <div className='flex items-center gap-1.5'>
                  <Settings className='h-4 w-4 text-slate-500' />
                  <span>
                    {meterMapping?.meter?.meter_timezone_type_rel[0].timezone_type?.parameter_value}
                  </span>
                </div>
              )}
            {meterMapping.meter_profile != null && (
              <div
                className='flex cursor-pointer items-center gap-1.5'
                onClick={() => onMeterProfileChange(meterMapping)}
              >
                Metering Profile:
                <span className='link-button-text'>
                  {meterMapping.meter_profile?.parameter_value}
                </span>
              </div>
            )}

            <div className='flex items-center gap-1.5'>
              <Wrench className='h-4 w-4 text-slate-500' />
              <span>MF: {meterMapping.meter_mf}</span>
            </div>

            {meterMapping.effective_start_ts && (
              <div className='flex items-center gap-1.5'>
                <Calendar className='h-4 w-4 text-slate-500' />
                <span>Changed: {meterMapping.effective_start_ts}</span>
              </div>
            )}

            <div>
              <span>
                Energise Date : <b>{getDisplayDate(meterMapping.energise_date)}</b>
              </span>
            </div>
          </div>

          {/* Change reason */}
          {meterMapping.change_reason?.parameter_value && (
            <div className='text-sm text-slate-600'>
              <span className='font-medium text-slate-700'>Reason: </span>
              {meterMapping.change_reason.parameter_value}
            </div>
          )}
        </div>

        <div className='flex gap-2'>
          {meterMapping?.meter && meterMapping?.meter != undefined && (
            <div className='flex shrink-0 gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='h-8 cursor-pointer gap-1.5 text-xs'
                onClick={() => onMeterStatusChange(meterMapping)}
              >
                Update Meter Status
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='h-8 cursor-pointer gap-1.5 text-xs'
                onClick={() => onMeterChange(meterMapping)}
              >
                <ArrowLeftRight className='h-3.5 w-3.5' />
                Change Meter
              </Button>
            </div>
          )}
          <Button
            variant='outline'
            size='sm'
            className='h-8 cursor-pointer gap-1.5 text-xs'
            onClick={() => onEdit(meterMapping.rel_id)}
          >
            Edit
          </Button>
          <DeleteButton onClick={() => onDelete(meterMapping)} />
        </div>
      </div>
      <div className='my-3'>
        <div className='mb-3 flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <Plug className='h-4 w-4 text-slate-600' />
            <span className='text-sm font-semibold text-slate-700'>
              CT/PT Transformers ({meterTransformers?.length})
            </span>
          </div>
          <Button
            variant='outline'
            className='cursor-pointer transition-transform hover:scale-105'
            onClick={() =>
              router.get(`/connections/${connectionId}/meters/${meterMapping.meter_id}/ctpt/create`)
            }
          >
            <Link2 className='h-5 w-5' /> Attach CT/PT
          </Button>
        </div>
      </div>
      {meterTransformers?.length > 0 && (
        <div className='mt-3'>
          <div className='grid gap-3'>
            {meterTransformers?.map((ctpt) => (
              <div
                key={ctpt?.ctpt_id}
                className='rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm'
              >
                <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
                  <div className='flex flex-wrap items-center gap-4 text-sm'>
                    <div className='flex items-center gap-1'>
                      <a
                        href={`/meter-ctpt/${ctpt?.ctpt_id}`}
                        target='__blank'
                      >
                        <span className='font-medium text-slate-700'>Serial:</span>

                        <span className='cursor-pointer text-slate-600 hover:text-blue-600'>
                          <b>{ctpt?.ctpt?.ctpt_serial ?? 'N/A'}</b>
                        </span>
                      </a>
                    </div>
                    <div className='flex items-center gap-1'>
                      <span className='font-medium text-slate-700'>Type:</span>
                      <span className='text-slate-600'>
                        {ctpt?.ctpt?.type?.parameter_value ?? 'N/A'}
                      </span>
                    </div>
                    {ctpt?.ctpt?.ratio_primary_value != null &&
                      ctpt?.ctpt?.ratio_secondary_value != null && (
                        <div className='flex items-center gap-1'>
                          <span className='font-medium text-slate-700'>Ratio:</span>
                          <span className='text-slate-600'>
                            {ctpt?.ctpt?.ratio_primary_value} / {ctpt?.ctpt?.ratio_secondary_value}
                          </span>
                        </div>
                      )}
                    {ctpt?.status?.parameter_value != null && (
                      <div
                        className={`rounded-full px-2 py-1 ${
                          ctpt?.status?.parameter_value === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <span className='text-xs font-medium'>{ctpt?.status?.parameter_value}</span>
                      </div>
                    )}
                    {ctpt?.ctpt_energise_date && (
                      <div className='flex items-center gap-1'>
                        <Calendar className='h-3 w-3 text-slate-500' />
                        <span className='text-slate-600'>
                          Energized: {getDisplayDate(ctpt?.ctpt_energise_date)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className='flex shrink-0 gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        setUpdateStatus(true)
                        setSelectedCtpt(ctpt)
                      }}
                      className='h-8 cursor-pointer gap-1.5 text-xs'
                    >
                      <Activity className='h-3.5 w-3.5' />
                      Update Status
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        setChange(true)
                        setSelectedCtpt(ctpt)
                      }}
                      className='h-8 cursor-pointer gap-1.5 text-xs'
                    >
                      <ArrowLeftRight className='h-3.5 w-3.5' />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {updateStatus && selectedCtpt && (
        <UpdateMeterTransformerAssignmentStatus
          setUpdate={setUpdateStatus}
          setSelectedCtpt={setSelectedCtpt}
          ctpt={selectedCtpt}
          statuses={statuses}
        />
      )}
      {change && selectedCtpt && (
        <ChangeMeterTransformerAssignment
          ctpt={selectedCtpt}
          changeReasons={changeReasons}
          setSelectedCtpt={setSelectedCtpt}
          setChange={setChange}
        />
      )}
    </div>
  )
}
