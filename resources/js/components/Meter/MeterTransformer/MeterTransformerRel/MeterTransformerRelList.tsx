import { router } from '@inertiajs/react'
import { Activity, Calendar, Pencil, Trash2, Link2 } from 'lucide-react'

interface Relation {
  version_id: number
  ctpt_id: number
  meter_id: number
  meter_serial?: string
  ctpt_type?: string
  ratio?: number
  faulty_date?: string | null
  ctpt_energise_date?: string | null
  ctpt_change_date?: string | null
  status_id: number
  change_reason_id: number
  // effective_start_ts: string;
  // effective_end_ts?: string | null;
  //is_active: boolean;
}

interface Props {
  relations: Relation[]
  onShow: (id: number) => void
  onEdit?: (rel: Relation) => void
  onDelete?: (rel: Relation) => void
}

export default function MeterTransformerRelList({
  relations,
  onShow,
  onEdit,
  onDelete,
}: Readonly<Props>) {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='font-inter text-dark-gray px-7 pt-[21px] pb-3 text-[15px] leading-[23px] font-semibold tracking-[-0.0924px]'>
        Relations Info
      </div>
      <div className='flex flex-col px-7 pb-7'>
        {relations.map((rel) => (
          <div
            key={rel.version_id}
            onClick={() => onShow(rel.version_id)}
            className='mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
          >
            <div className='flex items-start justify-between'>
              {/* Left content */}
              <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    {/* <div className="font-inter text-base font-semibold leading-normal text-black">
                      {rel.version_id}
                    </div> */}
                    <div className='rounded-[50px] bg-blue-100 px-2.5 py-px'>
                      <div className='font-inter text-xs leading-6 font-normal tracking-[-0.072px] text-blue-800'>
                        CTPT: {rel.ctpt_id} - {rel.ctpt_type} - {rel.ratio}
                      </div>
                    </div>
                    <div className='rounded-[50px] bg-indigo-100 px-2.5 py-px'>
                      <div className='font-inter text-xs leading-6 font-normal tracking-[-0.072px] text-indigo-800'>
                        Meter {rel.meter_serial ?? rel.meter_id}
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  {/* <div className="flex w-full flex-wrap items-center gap-5">
                    <div className="flex items-center gap-[3px]">
                      <Calendar className="h-3.5 w-3.5 text-dark-gray" />
                      <div className="font-inter text-sm font-normal leading-6 tracking-[-0.084px] text-dark-gray">
                        Start: {formatDate(rel.effective_start_ts)}
                      </div>
                    </div>
                    {rel.effective_end_ts && (
                      <div className="flex items-center gap-[3px]">
                        <Calendar className="h-3.5 w-3.5 text-dark-gray" />
                        <div className="font-inter text-sm font-normal leading-6 tracking-[-0.084px] text-dark-gray">
                          End: {formatDate(rel.effective_end_ts)}
                        </div>
                      </div>
                    )}
                  </div> */}

                  {/* Faulty / Energise / Change */}
                  <div className='text-dark-gray flex flex-wrap gap-3 text-sm'>
                    <span>Faulty Date: {formatDate(rel.faulty_date)}</span>
                    <span>Energise Date: {formatDate(rel.ctpt_energise_date)}</span>
                    <span>Change Date: {formatDate(rel.ctpt_change_date)}</span>
                  </div>
                </div>
              </div>

              {/* Right content (status + delete) */}
              <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                {/* <div
                  className={`rounded-[50px] px-2.5 py-px ${
                    rel.is_active ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <div
                    className={`font-inter text-xs font-normal leading-6 tracking-[-0.072px] ${
                      rel.is_active ? "text-deep-green" : "text-red-800"
                    }`}
                  >
                    {rel.is_active ? "Active" : "Inactive"}
                  </div>
                </div> */}

                <div className='mt-2 flex items-center gap-3'>
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(rel)
                      }}
                      className='flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800'
                    >
                      <Pencil className='h-4 w-4' />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(rel)
                      }}
                      className='flex items-center gap-1 text-sm text-red-600 hover:text-red-800'
                    >
                      <Trash2 className='h-4 w-4' />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
