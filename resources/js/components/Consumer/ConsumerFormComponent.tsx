import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ConsumerData, RegionOption } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { useEffect, useState } from 'react'
import { Card } from '../ui/card'
import ConsumerContactFolioModal from './ConsumerContactFolioModal'
import useConnectionFlagForm from '../Connections/useConnectionFlagForm'
import ConnectionFlagForm from '../Connections/ConnectionFlagForm'
import AddressCard from '../Connections/AddressCard'
import useFetchRecord from '@/hooks/useFetchRecord'

interface Props {
  consumer_types: ParameterValues[]
  consumer_ownership_types: ParameterValues[]
  districts: RegionOption[]
  states: RegionOption[]
  connection_id: number
  data?: ConsumerData
  indicators: ParameterValues[]
  departments: ParameterValues[]
}

const isSameAddress = (primary?: any, other?: any) => {
  return primary?.address_id === other?.address_id
}

export default function ConsumerFormComponent({
  consumer_types,
  consumer_ownership_types,
  districts,
  states,
  connection_id,
  data,
  indicators,
  departments,
}: Props) {
  console.log(consumer_ownership_types)
  let consumer = null
  let contact = null
  if (data) {
    consumer = data.consumer
    contact = data.contact
  }

  const primary = contact?.primary_address

  const { updateFlagData, flagData } = useConnectionFlagForm(indicators ?? [])
  const [premisesAddress, setPremisesAddress] = useState<boolean>(false)
  const [billingAddress, setBillingAddress] = useState<boolean>(false)
  const { formData, setFormValue, setAll, toggleBoolean } = useCustomForm({
    // Primary Address
    address_id: primary?.address_id ?? null,
    connection_id: consumer?.connection_id ?? connection_id,
    consumer_type_id: consumer?.consumer_type_id ?? '',
    consumer_ownership_type_id: consumer?.consumer_ownership_type_id ?? '',
    consumer_name: consumer?.consumer_name ?? '',
    contact_person: consumer?.contact_person ?? '',
    organization_name: consumer?.organization_name ?? '',
    department_id: consumer?.department_name_id ?? '',
    consumer_pan: consumer?.consumer_pan ?? '',
    consumer_tan: consumer?.consumer_tan ?? '',
    consumer_gstin: consumer?.consumer_gstin ?? '',
    consumer_cin: consumer?.consumer_cin ?? '',
    address_line1: primary?.address_line1 ?? '',
    address_line2: primary?.address_line2 ?? '',
    city_town_village: primary?.city_town_village ?? '',
    pincode: primary?.pincode ?? '',
    district_id: primary?.district_id ?? '',
    state_id: primary?.state_id ?? '',
    virtual_account_number: consumer?.virtual_account_number ?? '',

    // Other addresses
    other_addresses: {
      billing:
        contact?.billing_address && !isSameAddress(primary, contact.billing_address)
          ? contact.billing_address
          : null,
      premises:
        contact?.premises_address && !isSameAddress(primary, contact.premises_address)
          ? contact.premises_address
          : null,
    },

    primary_email: contact?.primary_email ?? '',
    primary_phone: contact?.primary_phone?.toString() ?? '',

    // ✅ NEW: Add array for extra contacts
    contact_folio: contact?.contact_folio ?? [],
    indicators: flagData,

    _method: consumer ? 'PUT' : undefined,
  })
  useEffect(() => {
    if (!data?.contact) return

    setPremisesAddress(!!data.contact.premises_address)
    setBillingAddress(!!data.contact.billing_address)
  }, [data])

  const { post, loading, errors } = useInertiaPost<typeof formData>(
    consumer ? route('consumers.update', consumer.connection_id) : route('consumers.store'),
    {
      showErrorToast: true,
    }
  )

  const [showContactModal, setShowContactModal] = useState(false)
  const [showDepartmentField, setShowDepartmentField] = useState(false)

  const setOtherAddress = (type: 'billing' | 'premises', value: any) => {
    setAll({
      other_addresses: {
        ...formData.other_addresses,
        [type]: value,
      },
    })
  }
  const handleDepartmentField = (value: string) => {
    const consumerType = consumer_types.find((type) => type.id === Number(value))
    setFormValue('consumer_type_id')(value)
    if (consumerType?.parameter_value.toLowerCase().includes('gov')) {
      setShowDepartmentField(true)
    } else {
      setShowDepartmentField(false)
    }
  }
  const updateOtherAddressField = (type: 'billing' | 'premises', field: string, value: any) => {
    if (!formData.other_addresses[type]) return
    setOtherAddress(type, {
      ...formData.other_addresses[type],
      [field]: value,
    })
  }

  const removeOtherAddress = (type: 'billing' | 'premises') => {
    setOtherAddress(type, null)
  }

  const handleRemoveContact = (index: number) => {
    const updated = formData.contact_folio.filter((_, i) => i !== index)
    setFormValue('contact_folio')(updated)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload = {
      ...formData,
      indicators: flagData,
    }
    post(payload)
  }

  const [selectedOwnership, setSelectedOwnership] = useState<ParameterValues | null>(null)

  useEffect(() => {
    if (formData.consumer_ownership_type_id) {
      const ownership = consumer_ownership_types.find(
        (type) => type.id === Number(formData.consumer_ownership_type_id)
      )
      setSelectedOwnership(ownership || null)
    }
  }, [consumer_ownership_types, formData.consumer_ownership_type_id])

  const [consumerType, setConsumerType] = useState<ParameterValues | null>(null)

  useEffect(() => {
    if (formData.consumer_type_id) {
      const type = consumer_types.find((type) => type.id === Number(formData.consumer_type_id))
      setConsumerType(type || null)
    }
  }, [consumer_types, formData.consumer_type_id])

  const [filteredDepartments] = useFetchRecord<ParameterValues[]>(
    `/api/parameter-values?domain_name=Connection&parameter_name=Departments&attribute_name=attribute1Value&attribute_value=${consumerType?.parameter_value}`
  )

  return (
    <form
      className='flex flex-col gap-6'
      onSubmit={handleSubmit}
    >
      {/* Basic Information */}
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Basic Information</StrongText>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
            {consumer_types && (
              <SelectList
                label='Consumer Type'
                list={consumer_types}
                dataKey='id'
                displayKey='parameter_value'
                setValue={handleDepartmentField}
                value={formData.consumer_type_id}
                required
                error={errors?.consumer_type_id}
              />
            )}
            {showDepartmentField && filteredDepartments && (
              <SelectList
                label='Department'
                list={filteredDepartments}
                dataKey='id'
                displayKey='parameter_value'
                setValue={setFormValue('department_id')}
                value={formData.department_id}
                required
                error={errors?.department_id}
              />
            )}
            {consumer_ownership_types && (
              <SelectList
                label='Consumer Ownership Type'
                list={consumer_ownership_types}
                dataKey='id'
                displayKey='parameter_value'
                setValue={setFormValue('consumer_ownership_type_id')}
                value={formData.consumer_ownership_type_id}
                required
                error={errors?.consumer_ownership_type_id}
              />
            )}
            <Input
              label='Consumer Name'
              setValue={setFormValue('consumer_name')}
              value={formData.consumer_name}
              error={errors?.consumer_name}
              required
            />
            {selectedOwnership &&
              selectedOwnership.parameter_value.toLowerCase().includes('organization') && (
                <Input
                  label='Organization Name'
                  setValue={setFormValue('organization_name')}
                  value={formData.organization_name}
                  error={errors?.organization_name}
                  required
                />
              )}
            {selectedOwnership &&
              selectedOwnership.parameter_value.toLowerCase().includes('organization') && (
                <Input
                  label='Contact Person'
                  setValue={setFormValue('contact_person')}
                  value={formData.contact_person}
                  error={errors?.contact_person}
                />
              )}

            <Input
              label='Consumer CIN'
              setValue={setFormValue('consumer_cin')}
              value={formData.consumer_cin}
              error={errors?.consumer_cin}
            />
            <Input
              label='Consumer PAN'
              setValue={setFormValue('consumer_pan')}
              value={formData.consumer_pan}
              error={errors?.consumer_pan}
            />
            <Input
              label='Consumer TAN'
              setValue={setFormValue('consumer_tan')}
              value={formData.consumer_tan}
              error={errors?.consumer_tan}
            />
            <Input
              label='Consumer GSTIN'
              setValue={setFormValue('consumer_gstin')}
              value={formData.consumer_gstin}
              error={errors?.consumer_gstin}
            />
            <Input
              label='Virtual Account Number'
              setValue={setFormValue('virtual_account_number')}
              value={formData.virtual_account_number}
              error={errors?.virtual_account_number}
            />
          </div>
        </div>
      </Card>

      {/* Primary Address */}
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Primary Address</StrongText>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
            <Input
              label='Address Line1'
              setValue={setFormValue('address_line1')}
              value={formData.address_line1}
              error={errors?.address_line1}
              required
            />
            <Input
              label='Address Line2'
              setValue={setFormValue('address_line2')}
              value={formData.address_line2}
              error={errors?.address_line2}
            />
            <Input
              label='City / Town / Village'
              setValue={setFormValue('city_town_village')}
              value={formData.city_town_village}
              error={errors?.city_town_village}
              required
            />
            <Input
              label='Pincode'
              type='number'
              setValue={setFormValue('pincode')}
              value={formData.pincode}
              error={errors?.pincode}
              required
            />
            {districts && (
              <SelectList
                label='District'
                list={districts}
                dataKey='region_id'
                displayKey='region_name'
                setValue={setFormValue('district_id')}
                value={formData.district_id}
                required
              />
            )}
            {states && (
              <SelectList
                label='State'
                list={states}
                dataKey='region_id'
                displayKey='region_name'
                setValue={setFormValue('state_id')}
                value={formData.state_id}
                required
              />
            )}
          </div>
        </div>
      </Card>

      <div className='flex flex-col gap-4'>
        {!premisesAddress && (
          <div>
            <Button
              type='button'
              label='Add Premises Address'
              onClick={() => {
                setOtherAddress('premises', {
                  address_id: null,
                  address_line1: '',
                  address_line2: '',
                  city_town_village: '',
                  pincode: '',
                  district_id: '',
                  state_id: '',
                })
                setPremisesAddress(true)
              }}
            />
          </div>
        )}
        {premisesAddress && (
          <AddressCard
            title='Premises Address'
            address={formData.other_addresses.premises}
            districts={districts}
            states={states}
            onChange={(field: string, value: any) =>
              updateOtherAddressField('premises', field, value)
            }
            onRemove={() => {
              setOtherAddress('premises', null)
              setPremisesAddress(false)
            }}
          />
        )}
        {!billingAddress && (
          <div>
            <Button
              type='button'
              label='Add Billing Address'
              onClick={() => {
                setOtherAddress('billing', {
                  address_id: null,
                  address_line1: '',
                  address_line2: '',
                  city_town_village: '',
                  pincode: '',
                  district_id: '',
                  state_id: '',
                })
                setBillingAddress(true)
              }}
            />
          </div>
        )}
        {billingAddress && (
          <AddressCard
            title='Billing Address'
            address={formData.other_addresses.billing}
            districts={districts}
            states={states}
            onRemove={() => {
              removeOtherAddress('billing')
              setBillingAddress(false)
            }}
            onChange={(field: string, value: any) =>
              updateOtherAddressField('billing', field, value)
            }
          />
        )}
      </div>

      {/* Contact Information */}
      <Card>
        <div className='border-b-2 border-gray-200 py-3'>
          <StrongText className='text-base font-semibold'>Contact Information</StrongText>
          <div className='mt-6 grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
            <Input
              label='Primary Email'
              type='email'
              setValue={setFormValue('primary_email')}
              value={formData.primary_email}
              error={errors?.primary_email}
              required
            />
            <Input
              label='Primary Phone'
              type='text'
              setValue={setFormValue('primary_phone')}
              value={formData.primary_phone}
              error={errors?.primary_phone}
              required
            />
          </div>

          <div className='flex justify-end px-4'>
            <Button
              type='button'
              label='Add More Contact'
              onClick={() => setShowContactModal(true)}
            />
          </div>

          {/* Show added contacts */}
          {formData.contact_folio.length > 0 && (
            <div className='mt-4 border-t border-gray-200 p-4'>
              <StrongText className='mb-2 block font-medium'>Additional Contacts</StrongText>
              <div className='flex flex-col gap-2'>
                {formData.contact_folio.map((c, i) => (
                  <div
                    key={i}
                    className='flex justify-between rounded border border-gray-200 p-2 text-sm'
                  >
                    <div>
                      <div>
                        <strong>Email:</strong> {c.email || '-'}
                      </div>
                      <div>
                        <strong>Phone:</strong> {c.phone || '-'}
                      </div>
                    </div>
                    <button
                      type='button'
                      className='text-red-500 hover:text-red-700'
                      onClick={() => handleRemoveContact(i)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
      {!consumer && (
        <ConnectionFlagForm
          flagData={flagData}
          updateFlagData={updateFlagData}
        />
      )}

      {/* Modal */}
      {showContactModal && (
        <ConsumerContactFolioModal
          setShowModal={setShowContactModal}
          formData={formData}
          setFormValue={setFormValue}
        />
      )}
      <div className='flex justify-end'>
        <Button
          type='submit'
          label='Submit'
          processing={loading}
        />
      </div>
    </form>
  )
}
