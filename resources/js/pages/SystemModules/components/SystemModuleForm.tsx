import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { SystemModule } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import React, { useCallback, useEffect } from 'react'
import { route } from 'ziggy-js'

interface Props {
  selectedSystemModule?: SystemModule | null
  onSuccess?: () => void
  onCancel?: () => void
}

export default function SystemModuleForm({
  selectedSystemModule,
  onSuccess,
  onCancel,
}: Readonly<Props>) {
  const isEditing = selectedSystemModule != null

  const { formData, setFormValue } = useCustomForm({
    name: '',
  })

  const handleComplete = useCallback(() => {
    setFormValue('name')('')
    onSuccess?.()
  }, [onSuccess, setFormValue])

  const { post, errors, loading } = useInertiaPost(
    isEditing
      ? route('system-module.update', selectedSystemModule.id)
      : route('system-module.store'),
    {
      onComplete: handleComplete,
    }
  )

  // Set form data when editing
  useEffect(() => {
    if (selectedSystemModule) {
      setFormValue('name')(selectedSystemModule.name)
    } else {
      setFormValue('name')('')
    }
  }, [selectedSystemModule, setFormValue])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isEditing) {
      post({ ...formData, _method: 'PUT' })
    } else {
      post(formData)
    }
  }

  return (
    <div className=''>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4'>
          <Input
            label='System Module Name'
            setValue={setFormValue('name')}
            value={formData.name}
            placeholder={isEditing ? '' : 'Type your System Module Name'}
            error={(errors as Record<string, string>)?.name}
            type='text'
            required
          />
        </div>
        <div className='mt-6 flex justify-end gap-3'>
          {onCancel && (
            <Button
              type='button'
              label='Cancel'
              variant='secondary'
              onClick={onCancel}
            />
          )}
          <Button
            type='submit'
            label={isEditing ? 'Update' : 'Create'}
            processing={loading}
          />
        </div>
      </form>
    </div>
  )
}
