import capitalSnakeCase from '@/formaters/capitalcase'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterDomain, SystemModule } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'
import Modal from '@/ui/Modal/Modal'
import { useCallback, useEffect } from 'react'

interface Props {
  title: string
  setShowModal: (value: boolean) => unknown
  parameterDomain?: ParameterDomain
  modules: SystemModule[]
}

export default function ParameterDomainForm({
  title,
  setShowModal,
  parameterDomain,
  modules,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    domain_name: parameterDomain?.domain_name ?? '',
    description: parameterDomain?.description ?? '',
    domain_code: parameterDomain?.domain_code ?? '',
    managed_by_module: parameterDomain?.managed_by_module ?? '',
    _method: parameterDomain != null ? 'PUT' : 'POST',
  })

  console.log(formData)

  useEffect(() => {
    if (parameterDomain) {
      setFormValue('domain_name')(parameterDomain?.domain_name ?? '')
      setFormValue('description')(parameterDomain?.description ?? '')
      setFormValue('domain_code')(parameterDomain?.domain_code ?? '')
      setFormValue('managed_by_module')(parameterDomain?.managed_by_module ?? '')
    } else {
      setFormValue('domain_name')('')
      setFormValue('description')('')
      setFormValue('domain_code')('')
      setFormValue('managed_by_module')('')
    }
  }, [parameterDomain, setFormValue])

  const onComplete = useCallback(() => {
    setShowModal(false)
  }, [setShowModal])

  const { post, errors } = useInertiaPost<typeof formData>(
    parameterDomain
      ? route('parameter-domain.update', parameterDomain.id)
      : route('parameter-domain.store'),
    {
      onComplete: onComplete,
    }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  return (
    <Modal
      title={title}
      setShowModal={setShowModal}
    >
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 p-4'>
          <div className='flex flex-col'>
            <Input
              label='Domain Name'
              value={formData.domain_name}
              setValue={setFormValue('domain_name')}
              error={errors?.domain_name}
            />
          </div>
          <div className='flex flex-col'>
            <TextArea
              label='Description'
              value={formData.description}
              setValue={setFormValue('description')}
              error={errors?.description}
            />
          </div>
          <div className='flex flex-col'>
            <Input
              label='Domain Code'
              value={formData.domain_code}
              setValue={setFormValue('domain_code')}
              required
              error={errors?.domain_code}
              formatter={capitalSnakeCase}
            />
          </div>
          <div className='flex flex-col'>
            <SelectList
              list={modules}
              dataKey='id'
              displayKey='name'
              setValue={setFormValue('managed_by_module')}
              value={formData.managed_by_module}
              label='Managed By Module'
              error={errors?.managed_by_module}
            />
          </div>
          <div className='flex justify-between'>
            <Button
              label='Cancel'
              variant='secondary'
              onClick={() => setShowModal(false)}
            />
            <Button
              label='Save'
              type='submit'
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}
