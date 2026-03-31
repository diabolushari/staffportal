import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Connection, ConnectionPartyMapping } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { Party } from '@/interfaces/parties'
import Button from '@/ui/button/Button'
import ComboBox from '@/ui/form/ComboBox'
import Datepicker from '@/ui/form/DatePicker'
import SelectList from '@/ui/form/SelectList'
import Modal from '@/ui/Modal/Modal'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

interface ConnectionPartiesFormModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  connection: Connection
  connectionParty?: ConnectionPartyMapping
  partyRelationTypes: ParameterValues[]
}
export default function ConnectionPartiesFormModal({
  setShowModal,
  connection,
  connectionParty,
  partyRelationTypes,
}: ConnectionPartiesFormModalProps) {
  const [partyItem, setPartyItem] = useState<Party | null>(null)
  const { formData, setFormValue } = useCustomForm({
    version_id: connectionParty?.version_id ?? '',
    connection_id: connection?.connection_id,
    party_id: partyItem?.party_id ?? '',
    party_relation_type_id: connectionParty?.party_relation_type_id ?? '',
    effective_start: dayjs(connectionParty?.effective_start?.date ?? '').format('YYYY-MM-DD'),
    effective_end: dayjs(connectionParty?.effective_end?.date ?? '').format('YYYY-MM-DD'),
    _method: connectionParty ? 'PUT' : 'POST',
  })
  useEffect(() => {
    if (partyItem) {
      setFormValue('party_id')(partyItem?.party_id ?? '')
    }
  }, [partyItem])
  const { post, loading, errors } = useInertiaPost<typeof formData>(
    connectionParty
      ? route('connection-parties.update', connectionParty?.version_id)
      : route('connection-parties.store'),
    {
      showErrorToast: true,
      onComplete: () => {
        setShowModal(false)
      },
    }
  )
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    post(formData)
  }
  return (
    <Modal
      setShowModal={setShowModal}
      title='Add Party'
      showClosButton={true}
    >
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 space-y-4'
      >
        <ComboBox
          label='Party'
          value={partyItem}
          setValue={setPartyItem}
          dataKey='party_id'
          displayKey='name'
          displayValue2='mobile_number'
          error={errors.party_id}
          url='/api/parties?search='
          placeholder='Search with Name/Phone/Code'
        />
        {partyRelationTypes?.length > 0 && (
          <SelectList
            label='Party Relation Type'
            value={formData.party_relation_type_id}
            setValue={setFormValue('party_relation_type_id')}
            list={partyRelationTypes}
            displayKey='parameter_value'
            dataKey='id'
            error={errors.party_relation_type_id}
          />
        )}
        <Datepicker
          label='From Date'
          value={formData.effective_start}
          setValue={setFormValue('effective_start')}
          error={errors.effective_start}
          required
          placeholder='Select From Date'
        />
        <Datepicker
          label='To Date'
          value={formData.effective_end}
          setValue={setFormValue('effective_end')}
          error={errors.effective_end}
          required
          placeholder='Select To Date'
        />
        <Button
          type='submit'
          label='Submit'
          disabled={loading}
        />
      </form>
    </Modal>
  )
}
