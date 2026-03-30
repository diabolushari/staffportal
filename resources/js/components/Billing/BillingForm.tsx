import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { BillingRule, BillingRuleJson } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import FileInput from '@/ui/form/FileInput'
import Input from '@/ui/form/Input'
import { formatDateForInput } from '@/utils/DateConverter'
import { Card } from '../ui/card'
import StrongText from '@/typography/StrongText'
import React, { useEffect, useState } from 'react'
import Datepicker from '@/ui/form/DatePicker'

export default function BillingForm({ billingRule }: { billingRule?: BillingRule }) {
  const [billingRuleJson, setBillingRuleJson] = useState<BillingRuleJson | null>(
    billingRule?.rule ?? null
  )
  const { formData, setFormValue } = useCustomForm({
    name: billingRule?.name ?? '',
    effective_start: formatDateForInput(billingRule?.effective_start ?? ''),
    effective_end: formatDateForInput(billingRule?.effective_end ?? ''),
    billing_rule: null,
    billing_rule_json: billingRule?.rule ?? '',
    _method: billingRule ? 'PUT' : undefined,
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    billingRule ? route('billing-rules.update', billingRule.id) : route('billing-rules.store'),
    { showErrorToast: true }
  )
  useEffect(() => {
    if (formData.billing_rule != null || billingRule?.rule != null) {
      if (formData.billing_rule_json) {
        setBillingRuleJson(formData.billing_rule_json as BillingRuleJson)
      }
    } else {
      setBillingRuleJson(null)
    }
  }, [formData, billingRule])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  const handleBillingRuleChange = (file: File) => {
    setFormValue('billing_rule')(file)

    // Read the file content
    if (file && file.type === 'application/json') {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string)
          setFormValue('billing_rule_json')(jsonData)
        } catch (err) {
          setFormValue('billing_rule_json')({ error: 'Invalid JSON content' })
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className=''
    >
      <Card>
        <div className='flex justify-between border-b-2 border-gray-200 py-4'>
          <StrongText className='text-base font-semibold'>Basic Information</StrongText>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Input
            label='Name'
            value={formData.name}
            setValue={setFormValue('name')}
            error={errors.name}
          />
          <FileInput
            label='Billing Rule'
            setValue={(file) => {
              handleBillingRuleChange(file)
            }}
            file={
              typeof formData.billing_rule === 'string'
                ? { name: formData.billing_rule, size: 0, type: '' }
                : formData.billing_rule
            }
            error={errors?.billing_rule}
          />

          <Datepicker
            label='Effective Start'
            setValue={setFormValue('effective_start')}
            value={formData.effective_start}
            error={errors?.effective_start}
            placeholder='Select Effective Start'
          />
          <Datepicker
            label='Effective End'
            setValue={setFormValue('effective_end')}
            value={formData.effective_end}
            error={errors?.effective_end}
            placeholder='Select Effective End'
          />
        </div>
      </Card>

      <div className='mt-4 flex justify-end'>
        <Button
          type='submit'
          disabled={loading}
          label={loading ? 'Saving...' : 'Save'}
        />
      </div>

      {/* JSON Preview Section */}
      {billingRuleJson && (
        <Card className='max-h-[400px] max-w-[1200px] overflow-x-auto overflow-y-scroll'>
          <StrongText className='mb-2 text-base font-semibold'>Billing Rule Data</StrongText>
          <div className=''>
            <pre>{JSON.stringify(billingRuleJson ?? {}, null, 2)}</pre>
          </div>
        </Card>
      )}
    </form>
  )
}
