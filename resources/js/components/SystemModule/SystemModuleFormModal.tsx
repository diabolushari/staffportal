import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { SystemModule } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import Modal from '@/ui/Modal/Modal'

export default function SystemModuleFormModal({
  setShowModal,
  initialData,
}: {
  setShowModal: (show: boolean) => void
  initialData?: SystemModule | null
}) {
  const { formData, setFormValue } = useCustomForm({
    name: initialData?.name ?? '',
  })
  const { post, errors, loading } = useInertiaPost(
    initialData ? route('system-module.update', initialData.id) : route('system-module.store'),
    {
      onComplete: () => {
        setShowModal(false)
        setFormValue('name')('')
      },
    }
  )
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(initialData ? { ...formData, _method: 'PUT' } : formData)
  }
  return (
    <Modal
      title='System Module'
      setShowModal={setShowModal}
    >
      <div className='p-4 text-gray-800 dark:text-gray-100'>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4'>
              <Input
                label='System Module Name'
                setValue={setFormValue('name')}
                value={formData.name}
                placeholder='Type your System Module Name'
                error={errors?.name}
                type='text'
              />
            </div>
          </div>
          <div className='mt-5'>
            <Button
              type='submit'
              label={initialData ? 'Update' : 'Submit'}
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}
