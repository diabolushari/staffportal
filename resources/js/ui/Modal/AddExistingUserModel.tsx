import { useMemo, useState } from 'react'
import Modal from './Modal'
import useCustomForm from '@/hooks/useCustomForm'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import { Person } from '@/interfaces/data_interfaces'
import { router } from '@inertiajs/react'

interface SearchFormField {
  id_number: number | null
}
const AddExistingUserModel = () => {
  const [addExistingUser, setAddExistingUser] = useState<boolean>(true)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  const { formData, setFormValue } = useCustomForm<SearchFormField>({
    id_number: null,
  })
  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      id_number: {
        type: 'autocomplete',
        placeholder: 'Enter name or unique ID',
        label: 'To add an individual from directory, please search using name or unique ID',

        autoCompleteSelection: selectedPerson,
        dataKey: 'id',
        displayKey: 'id_number',
        displayKey2: 'full_name',
        selectListUrl: route('people-id-list', {
          search: '',
        }),
        setValue: (value: Person) => {
          setSelectedPerson(value)
          setFormValue('id_number')(value.id)
        },
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, selectedPerson])

  const peopleId = selectedPerson?.id

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.get(route('people.edit', { id: peopleId, backUrl: '/staff', persona: 'Staff' }))
  }
  return (
    <Modal
      setShowModal={setAddExistingUser}
      title='Lookup person '
    >
      <div className='ml-4 w-full'>
        <FormBuilder
          loading={false}
          formData={formData}
          onFormSubmit={handleFormSubmit}
          formItems={formItems}
          buttonText='Add & Continue'
        ></FormBuilder>
      </div>
    </Modal>
  )
}

export default AddExistingUserModel
