import { Calendar } from '@/interfaces/data_interfaces'
import Modal from '@/ui/Modal/Modal'
import Button from '@/ui/button/Button'
import { useForm } from '@inertiajs/react'

export default function CalendarEditModal({
  calendar,
  setModalOpen,
}: {
  calendar: Calendar
  setModalOpen: () => void
}) {
  const { data, setData, put } = useForm({
    isHoliday: calendar.is_holiday,
    isWeekend: calendar.is_weekend,
    remarks: calendar.remarks || '',
  })

  const submit = () => {
    put(route('calendar.update', calendar.id), {
      onSuccess: () => setModalOpen(),
    })
  }

  return (
    <Modal
      title='Edit Calendar'
      setShowModal={setModalOpen}
    >
      <div className='space-y-4'>
        <label className='flex gap-2'>
          <input
            type='checkbox'
            checked={data.isHoliday}
            onChange={(e) => setData('isHoliday', e.target.checked)}
          />
          Holiday
        </label>

        <label className='flex gap-2'>
          <input
            type='checkbox'
            checked={data.isWeekend}
            onChange={(e) => setData('isWeekend', e.target.checked)}
          />
          Weekend
        </label>

        <textarea
          className='w-full rounded border p-2'
          placeholder='Remarks'
          value={data.remarks}
          onChange={(e) => setData('remarks', e.target.value)}
        />

        <div className='flex justify-end gap-2'>
          <Button
            label='Cancel'
            variant='secondary'
            onClick={setModalOpen}
          />
          <Button
            label='Update'
            onClick={submit}
          />
        </div>
      </div>
    </Modal>
  )
}
