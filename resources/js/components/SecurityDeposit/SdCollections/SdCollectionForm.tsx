import { Button } from '@/components/ui/button'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Connection, SdDemand, SdRegister } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import CheckBox from '@/ui/form/CheckBox'
import Datepicker from '@/ui/form/DatePicker'
import DynamicAttributeForm, { BaseAttribute } from '@/ui/form/DynamicAttributeForm'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { useEffect, useMemo, useState } from 'react'

interface Props {
  sdDemand: SdDemand
  paymentModes: ParameterValues[]
  collectionStatus: ParameterValues[]
  connection: Connection
  sdRegister: SdRegister
  isRefund?: boolean
}

const SdCollectionForm = ({
  sdDemand,
  paymentModes,
  collectionStatus,
  connection,
  sdRegister,
  isRefund = false,
}: Props) => {
  const [selectedCollectionMode, setSelectedCollectionMode] = useState<ParameterValues | null>(null)
  const [isReversed, setIsReversed] = useState<boolean>(false)

  const refundStatus = collectionStatus.find(
    (status) => status.parameter_value.toLowerCase() === 'refund'
  )

  const statusId = isRefund ? refundStatus?.id : ''

  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    sd_demand_id: sdDemand.sd_demand_id,
    collection_date: '',
    payment_mode_id: '',
    collection_amount: '',
    receipt_number: '',
    collected_at: '',
    collected_by: '',
    is_active: true,
    reversal_reason: '',
    reversed_date: '',
    reversed_by: '',
    transaction_ref: '',
    remarks: '',
    status_id: statusId,
    connection_id: connection.connection_id,
    sd_register_id: sdRegister.sd_register_id,
  })

  //TODO useEffect has missing dependency of collectionModes
  useEffect(() => {
    if (!formData.payment_mode_id) return setSelectedCollectionMode(null)
    // TODO wrong naming convention
    const selectedCollectionMode = paymentModes.find(
      (mode) => mode.id == Number(formData.payment_mode_id)
    )
    setSelectedCollectionMode(selectedCollectionMode ?? null)
  }, [formData.payment_mode_id, paymentModes])

  useEffect(() => {
    setIsReversed(!formData.is_active)
  }, [formData.is_active])

  const url = route('sd-collections.store')

  const { post, loading, errors } = useInertiaPost<typeof formData>(url, {
    showErrorToast: true,
  })

  useEffect(() => {
    if (formData.payment_mode_id) {
      const selectedCollectionMode = paymentModes.find(
        (mode) => mode.id == Number(formData.payment_mode_id)
      )

      if (selectedCollectionMode) {
        setSelectedCollectionMode(selectedCollectionMode)
      }
    }
  }, [formData.payment_mode_id, paymentModes])

  //TODO should default to empty array
  const [attributeData, setAttributeData] = useState<BaseAttribute[] | null>([])

  const customFormData = useMemo(() => {
    return {
      ...formData,
      attributeData: attributeData?.map((item) => {
        return {
          attribute_definition_id: item.attribute_definition_id,
          attribute_value: item.attribute_value,
          file: item.file,
        }
      }),
    }
  }, [attributeData, formData])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    post(customFormData)
  }
  console.log(formData)

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 gap-4'>
          <Datepicker
            label={isRefund ? 'Refund Date' : 'Collection Date'}
            value={formData.collection_date}
            setValue={setFormValue('collection_date')}
            error={errors.collection_date}
            placeholder={isRefund ? 'Select Refund Date' : 'Select Collection Date'}
            required
          />

          <SelectList
            label={isRefund ? 'Refund Mode' : 'Payment Mode'}
            list={paymentModes}
            dataKey='id'
            displayKey='parameter_value'
            value={formData.payment_mode_id}
            setValue={setFormValue('payment_mode_id')}
            error={errors.payment_mode_id}
            required
            placeholder={isRefund ? 'Select Refund Mode' : 'Select Payment Mode'}
          />
          <DynamicAttributeForm
            selectedValue={selectedCollectionMode}
            domainName='Connection'
            parameterName='SD Collection Attribute'
            attributeData={attributeData}
            setAttributeData={setAttributeData}
          />
        </div>

        <div className='grid grid-cols-1 gap-4'>
          <Input
            type='number'
            label={isRefund ? 'Refund Amount' : 'Collection Amount'}
            value={formData.collection_amount}
            setValue={setFormValue('collection_amount')}
            error={errors.collection_amount}
            required
            placeholder={isRefund ? 'Enter Refund Amount' : 'Enter Collection Amount'}
          />

          <Input
            label={isRefund ? 'Refund Receipt Number' : 'Receipt Number'}
            value={formData.receipt_number}
            setValue={setFormValue('receipt_number')}
            error={errors.receipt_number}
            placeholder={isRefund ? 'Enter Refund Receipt Number' : 'Enter Receipt Number'}
          />

          <Input
            label={isRefund ? 'Refunded By' : 'Collected By'}
            value={formData.collected_by}
            setValue={setFormValue('collected_by')}
            error={errors.collected_by}
            placeholder={isRefund ? 'Enter Refunded By' : 'Enter Collected By'}
          />
          <Input
            label={isRefund ? 'Refunded At' : 'Collected At'}
            value={formData.collected_at}
            setValue={setFormValue('collected_at')}
            error={errors.collected_at}
            placeholder={isRefund ? 'Enter Refunded At' : 'Enter Collected At'}
          />
          <CheckBox
            label='Is Active'
            value={formData.is_active}
            toggleValue={toggleBoolean('is_active')}
          />
          {isReversed && (
            <>
              <Input
                label='Reversal Reason'
                value={formData.reversal_reason}
                setValue={setFormValue('reversal_reason')}
                error={errors.reversal_reason}
                placeholder='Reason (if reversed)'
              />

              <Datepicker
                label='Reversed Date'
                value={formData.reversed_date}
                setValue={setFormValue('reversed_date')}
                error={errors.reversed_date}
                placeholder='Select Reversed Date'
              />

              <Input
                label='Reversed By'
                value={formData.reversed_by}
                setValue={setFormValue('reversed_by')}
                error={errors.reversed_by}
                placeholder='Reversed By'
              />
            </>
          )}
          <Input
            label='Transaction Ref'
            value={formData.transaction_ref}
            setValue={setFormValue('transaction_ref')}
            error={errors.transaction_ref}
            placeholder='Enter Transaction Ref'
          />
          <Input
            label='Remarks'
            value={formData.remarks}
            setValue={setFormValue('remarks')}
            error={errors.remarks}
            placeholder='Enter Remarks'
          />
          {!isRefund && (
            <SelectList
              label='Status'
              list={collectionStatus}
              dataKey='id'
              displayKey='parameter_value'
              value={formData.status_id}
              setValue={setFormValue('status_id')}
              error={errors.status_id}
              required
              placeholder='Select Status'
            />
          )}
          <Button
            variant={'default'}
            type='submit'
            disabled={loading}
          >
            {isRefund ? 'PROCESS REFUND' : 'SUBMIT COLLECTION RECORD'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SdCollectionForm
