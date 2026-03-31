import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { BillingGroup } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import Datepicker from '@/ui/form/DatePicker'
import MonthPicker from '@/ui/form/MonthPicker'
import Modal from '@/ui/Modal/Modal'
import dayjs from 'dayjs'

interface BillInitializeModalProps {
  setShowModal: (show: boolean) => void
  showModal: boolean
  selectedConnections: number[]
  billingGroup: BillingGroup
  readingMonthYear: string
}

export default function BillInitializeModal({
  setShowModal,
  showModal,
  selectedConnections,
  billingGroup,
  readingMonthYear,
}: BillInitializeModalProps) {
  console.log('readingMonthYear', readingMonthYear)
  const { formData, setFormValue } = useCustomForm({
    billing_group_id: billingGroup.billing_group_id,
    connection_ids: selectedConnections,
    bill_month_year: dayjs(readingMonthYear).add(1, 'month').format('YYYY-MM').toString(),
    reading_month_year: dayjs(readingMonthYear).format('YYYY-MM').toString(),
    bill_date: dayjs().format('YYYY-MM-DD'),
    due_date: dayjs().add(7, 'day').format('YYYY-MM-DD'),
    dc_date: dayjs().add(15, 'day').format('YYYY-MM-DD'),
  })
  const handleBillDateChange = (value: string) => {
    setFormValue('bill_date')(value)

    if (!value) return

    const billDate = dayjs(value)

    // Add 7 business days for Due Date
    const dueDate = billDate.add(7, 'day').format('YYYY-MM-DD')

    // Add 15 business days from Due Date for DC Date
    const dcDate = dayjs(dueDate).add(15, 'day').format('YYYY-MM-DD')

    setFormValue('due_date')(dueDate)
    setFormValue('dc_date')(dcDate)
  }
  const { post, loading, errors } = useInertiaPost<typeof formData>(
    route('billing-group.initialize-bill'),
    {
      showErrorToast: true,
      onComplete: () => {
        setShowModal(false)
      },
    }
  )

  const handleSubmitBill = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  return (
    <Modal
      title='Initialize Bill'
      setShowModal={setShowModal}
      showClosButton={true}
    >
      <form
        action=''
        className='flex flex-col gap-4'
        onSubmit={handleSubmitBill}
      >
        <MonthPicker
          label='Reading Year and Month'
          value={formData.reading_month_year}
          setValue={setFormValue('reading_month_year')}
          error={errors?.reading_month_year}
        />
        <MonthPicker
          label='Bill Year and Month'
          value={formData.bill_month_year}
          setValue={setFormValue('bill_month_year')}
          error={errors?.bill_month_year}
        />
        <Datepicker
          label='Bill Date'
          value={formData.bill_date}
          setValue={handleBillDateChange}
          error={errors?.bill_date}
          placeholder='Select Bill Date'
        />
        <Datepicker
          label='Due Date'
          value={formData.due_date}
          setValue={setFormValue('due_date')}
          error={errors?.due_date}
          placeholder='Select Due Date'
        />
        <Datepicker
          label='DC Date'
          value={formData.dc_date}
          setValue={setFormValue('dc_date')}
          error={errors?.dc_date}
          placeholder='Select DC Date'
        />
        <div className='flex justify-end gap-2'>
          <Button
            label='Initialize'
            type='submit'
            disabled={loading}
            processing={loading}
            variant={loading ? 'loading' : 'primary'}
          />
        </div>
      </form>
    </Modal>
  )
}
