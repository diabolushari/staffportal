import { Calendar } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'
import CustomCard from '@/ui/Card/CustomCard'
import { useState } from 'react'
import ActionButton from '@/components/action-button'
import CalendarEditModal from './CalendarEditModal'
import { getDisplayDate } from '@/utils'

export default function CalendarTable({ calendar }: { calendar: Paginator<Calendar> }) {
  const [editItem, setEditItem] = useState<Calendar | null>(null)
  const calendarItems = calendar?.data ?? []

  return (
    <CustomCard>
      <div className='relative w-full rounded-lg bg-white'>
        <div className='flex flex-col px-7 pb-7'>
          {calendarItems.length > 0 ? (
            calendarItems.map((item, index) => (
              <div
                key={item.id}
                className='mb-4 w-full rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                    <div className='flex items-center gap-2'>
                      <div className='font-inter text-base font-semibold text-black'>
                        {getDisplayDate(item.calendar_date)}
                      </div>
                      <div className='rounded-[50px] bg-blue-100 px-2.5 py-px'>
                        <div className='font-inter text-xs text-blue-800'>#{index + 1}</div>
                      </div>
                    </div>

                    <div className='flex w-full flex-wrap items-center gap-5 text-sm text-slate-600'>
                      <div className='flex items-center gap-1'>
                        Day of Week: <b>{item.day_of_week}</b>
                      </div>
                      <div className='flex items-center gap-1'>
                        Day of Year: <b>{item.day_of_year}</b>
                      </div>
                    </div>

                    <div className='flex w-full flex-wrap items-center gap-5 text-sm text-slate-600'>
                      <div className='flex items-center gap-1'>
                        Holiday: <b>{item.is_holiday ? 'Yes' : 'No'}</b>
                      </div>
                      <div className='flex items-center gap-1'>
                        Weekend: <b>{item.is_weekend ? 'Yes' : 'No'}</b>
                      </div>
                    </div>

                    <div className='flex w-full flex-wrap items-center gap-5 text-sm text-slate-600'>
                      <div className='flex items-center gap-1'>
                        Remarks: <b>{item.remarks || '-'}</b>
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                    <ActionButton onEdit={() => setEditItem(item)} />

                    <div
                      className={`rounded-[50px] px-2.5 py-px ${item.is_holiday ? 'bg-red-100' : 'bg-green-100'}`}
                    >
                      <div
                        className={`font-inter text-xs ${item.is_holiday ? 'text-red-700' : 'text-green-700'}`}
                      >
                        {item.is_holiday ? 'Holiday' : 'Working Day'}
                      </div>
                    </div>

                    <div
                      className={`rounded-[50px] px-2.5 py-px ${item.is_weekend ? 'bg-amber-100' : 'bg-slate-100'}`}
                    >
                      <div
                        className={`font-inter text-xs ${item.is_weekend ? 'text-amber-700' : 'text-slate-700'}`}
                      >
                        {item.is_weekend ? 'Weekend' : 'Weekday'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='p-6 text-center text-slate-500'>
              <p>No calendar entries found.</p>
            </div>
          )}
        </div>
      </div>

      <div className='mt-4'>
        <Pagination pagination={calendar} />
      </div>

      {editItem && (
        <CalendarEditModal
          calendar={editItem}
          setModalOpen={() => setEditItem(null)}
        />
      )}
    </CustomCard>
  )
}
