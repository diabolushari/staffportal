import { Office } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import { Card } from '../ui/card'
import useCustomForm from '@/hooks/useCustomForm'
import Input from '@/ui/form/Input'
import EditButton from '@/ui/button/EditButton'
import { router } from '@inertiajs/react'

export default function OfficeDetails({ office }: { office: Office }) {
  const {
    office_id,
    office_name,
    office_code,
    office_description,
    office_type_id,
    parent_office_id,
    effective_start,
    effective_end,
    contact_folio,
    office_type,
    is_current,
  } = office
  const { formData, setFormValue } = useCustomForm({
    office_id,
    office_name,
    office_code,
    office_description,
    office_type_id,
    parent_office_id,
    effective_start,
    effective_end,
    contact_folio,
    office_type,
    is_current,
  })
  return (
    <div className='flex w-full flex-col gap-4'>
      <Card>
        <div className='flex justify-between border-b-2 border-gray-200 py-4 pe-8'>
          <StrongText className='text-base font-semibold'>Basic Information</StrongText>
          <EditButton onClick={() => router.visit(route('offices.edit', office.office_id))} />
        </div>
        <div className='grid gap-4 gap-y-8 p-4 md:grid-cols-2'>
          <Input
            label='Office Code'
            setValue={setFormValue('office_code')}
            value={formData.office_code}
            disabled={true}
            style='disabled'
          />
          <Input
            label='Office Name'
            setValue={setFormValue('office_name')}
            value={formData.office_name}
            disabled={true}
            style='disabled'
          />
          <Input
            label='Office Type'
            setValue={() => {}}
            value={formData.office_type.parameter_value}
            disabled={true}
            style='disabled'
          />
        </div>
      </Card>
      <Card>
        <div className='flex justify-between border-b-2 border-gray-200 py-4'>
          <StrongText className='text-base font-semibold'>Other Information</StrongText>
        </div>
        <div className='grid gap-4 gap-y-8 p-4 md:grid-cols-2'>
          <Input
            label='Effective Start'
            setValue={setFormValue('effective_start')}
            value={formData.effective_start}
            disabled={true}
            style='disabled'
          />
          <Input
            label='Effective End'
            setValue={setFormValue('effective_end')}
            value={formData.effective_end}
            disabled={true}
            style='disabled'
          />
        </div>
      </Card>
    </div>
  )
}
