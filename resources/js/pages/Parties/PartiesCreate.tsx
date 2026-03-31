import { consumerNavItems } from '@/components/Navbar/navitems'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Party } from '@/interfaces/parties'
import MainLayout from '@/layouts/main-layout'
import Button from '@/ui/button/Button'
import Card from '@/ui/Card/Card'
import Datepicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'
import { router } from '@inertiajs/react'

interface PartiesFormProps {
  partyTypes: Array<{ id: number; parameterValue: string }>
  partyStatus: Array<{ id: number; parameterValue: string }>
  party?: Party // provided in edit mode
}

interface PartiesFormData {
  party_code: string
  party_legacy_code: string
  name: string
  party_type_id?: number
  status_id?: number
  effective_start: string
  effective_end: string
  mobile_number: string
  telephone_number: string
  email_address: string
  address: string
  fax_number: string
  __party_id?: number
  __version_id?: number
}

const breadcrumbs = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Parties',
    href: '/parties',
  },
]

//TODO use library for date operation
const toYMD = (iso?: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  return !Number.isNaN(d.getTime()) ? d.toISOString().split('T')[0] : ''
}

const toISOorNull = (ymd: string) => (ymd ? new Date(ymd).toISOString() : null)
const toNumberOrUndef = (v: unknown) => {
  if (v === null || v === undefined || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

//TODO name the component PartyCreate to match with rest of application
export default function PartiesCreate({ partyTypes, partyStatus, party }: PartiesFormProps) {
  console.log(party)
  console.log(partyTypes)
  console.log(partyStatus)

  const isEditing = Boolean(party)

  const { formData, setFormValue } = useCustomForm<PartiesFormData>({
    party_code: party?.party_code?.toString() ?? '',
    party_legacy_code: party?.party_legacy_code ?? '',
    name: party?.name ?? '',
    party_type_id: party?.party_type_id,
    status_id: party?.status_id,
    effective_start: toYMD(party?.effective_start),
    effective_end: toYMD(party?.effective_end),
    mobile_number: party?.mobile_number?.toString() ?? '',
    telephone_number: party?.telephone_number?.toString() ?? '',
    email_address: party?.email_address ?? '',
    address: party?.address ?? '',
    fax_number: party?.fax_number?.toString() ?? '',
    __party_id: party?.party_id,
    __version_id: party?.version_id,
  })
  console.log(formData)
  const { post, loading, errors } = useInertiaPost(
    isEditing ? `/parties/${formData.__version_id}` : '/parties'
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      party_code: toNumberOrUndef(formData.party_code),
      party_legacy_code: formData.party_legacy_code || '',
      name: formData.name,
      party_type_id: toNumberOrUndef(formData.party_type_id),
      status_id: toNumberOrUndef(formData.status_id),
      effective_start: toISOorNull(formData.effective_start),
      effective_end: toISOorNull(formData.effective_end),
      mobile_number: toNumberOrUndef(formData.mobile_number),
      telephone_number: toNumberOrUndef(formData.telephone_number),
      email_address: formData.email_address || '',
      address: formData.address || '',
      fax_number: toNumberOrUndef(formData.fax_number),
    }

    if (isEditing) {
      post({
        ...payload,
        party_id: formData.__party_id,
        version_id: formData.__version_id,
        _method: 'PUT',
      })
    } else {
      post(payload)
    }
  }

  //TODO separate component
  const renderSection = (title: string, children: React.ReactNode) => (
    <div className='rounded-md border border-slate-200 p-4'>
      <h3 className='mb-4 text-lg font-medium'>{title}</h3>
      <div className='grid grid-cols-1 items-start gap-4 md:grid-cols-2'>{children}</div>
    </div>
  )

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={consumerNavItems}
      selectedItem='Parties'
    >
      <div className='p-6'>
        <Card>
          <form
            onSubmit={handleSubmit}
            className='space-y-8'
          >
            {renderSection(
              'Basic Information',
              <>
                <Input
                  label='Party Code'
                  required
                  value={formData.party_code}
                  setValue={setFormValue('party_code')}
                  error={errors.party_code}
                  placeholder='Enter numeric party code'
                />
                <Input
                  label='Legacy Code'
                  value={formData.party_legacy_code}
                  setValue={setFormValue('party_legacy_code')}
                  error={errors.party_legacy_code}
                />
                <Input
                  label='Name'
                  required
                  value={formData.name}
                  setValue={setFormValue('name')}
                  error={errors.name}
                />

                <SelectList
                  label='Party Type'
                  value={formData.party_type_id}
                  setValue={setFormValue('party_type_id')}
                  list={partyTypes}
                  dataKey='id'
                  displayKey='parameter_value'
                />

                <SelectList
                  label='Status'
                  value={formData.status_id}
                  setValue={setFormValue('status_id')}
                  list={partyStatus}
                  dataKey='id'
                  displayKey='parameter_value'
                />
              </>
            )}

            {renderSection(
              'Contact Information',
              <>
                <Input
                  label='Mobile Number'
                  type='tel'
                  value={formData.mobile_number}
                  setValue={setFormValue('mobile_number')}
                  error={errors.mobile_number}
                />
                <Input
                  label='Telephone Number'
                  type='tel'
                  value={formData.telephone_number}
                  setValue={setFormValue('telephone_number')}
                  error={errors.telephone_number}
                />
                <Input
                  label='Email Address'
                  type='email'
                  value={formData.email_address}
                  setValue={setFormValue('email_address')}
                  error={errors.email_address}
                />
                <div className='md:col-span-2'>
                  <TextArea
                    label='Address'
                    value={formData.address}
                    setValue={setFormValue('address')}
                    rows={3}
                    maxLength={500}
                  />
                </div>
                <Input
                  label='Fax Number'
                  type='tel'
                  value={formData.fax_number}
                  setValue={setFormValue('fax_number')}
                  error={errors.fax_number}
                />
              </>
            )}

            {renderSection(
              'Validity Period',
              <>
                <Datepicker
                  label='Effective Start Date'
                  value={formData.effective_start}
                  setValue={setFormValue('effective_start')}
                />
                <Datepicker
                  label='Effective End Date'
                  value={formData.effective_end}
                  setValue={setFormValue('effective_end')}
                />
              </>
            )}

            <div className='flex justify-end gap-3 border-t pt-6'>
              <Button
                type='button'
                label='Cancel'
                variant='secondary'
                onClick={() => router.get('/parties')}
                disabled={loading}
              />
              <Button
                type='submit'
                label={isEditing ? 'Update Party' : 'Create Party'}
                disabled={loading}
              />
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  )
}
