import { Button } from '@/components/ui/button'
import useInertiaPost from '@/hooks/useInertiaPost'
import React from 'react'
import Modal from './Modal'

interface Properties {
  setShowModal: (show: boolean) => any
  title: string
  children?: React.ReactNode
  url: string
  preserveState?: boolean
  onSuccess?: () => unknown
  large?: boolean
}

export default function DeleteModal({
  setShowModal,
  children,
  title,
  url,
  preserveState = false,
  onSuccess,
  large = false,
}: Readonly<Properties>) {
  const { post, loading } = useInertiaPost(url, {
    preserveState: preserveState,
    onComplete: onSuccess,
    showErrorToast: true,
  })

  const onDelete = () => {
    post({
      _method: 'DELETE',
    })
  }

  return (
    <Modal
      setShowModal={setShowModal}
      title={title}
      large={large}
    >
      <div className='flex w-full flex-col gap-3 p-2'>
        {children}
        <div className='flex w-full justify-end'>
          <Button
            onClick={onDelete}
            variant='destructive'
          >
            DELETE
          </Button>
        </div>
      </div>
    </Modal>
  )
}
