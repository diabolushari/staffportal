import Modal from '@/ui/Modal/Modal'
import useConnectionFlagForm, { GroupedFlags } from './useConnectionFlagForm'
import { ConnectionFlag } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import CheckBox from '@/ui/form/CheckBox'
import FormCard from '@/ui/Card/FormCard'
import useInertiaPost from '@/hooks/useInertiaPost'
import Button from '@/ui/button/Button'

interface Props {
  setShowModal: (show: boolean) => void
  currentFlags?: ConnectionFlag[]
  indicators: ParameterValues[]
  connectionId: number
}

export default function ConnectionFlagModal({
  setShowModal,
  currentFlags,
  indicators,
  connectionId,
}: Props) {
  const { flagData, updateFlagData } = useConnectionFlagForm(indicators, currentFlags)
  const { post, errors, loading } = useInertiaPost(route('connection-flag.update', connectionId), {
    onComplete: () => setShowModal(false),
  })
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post({
      indicators: flagData,
      _method: 'PUT',
    })
  }
  return (
    <Modal
      title='Connection Flags'
      setShowModal={setShowModal}
      large
    >
      <div className='flex flex-col gap-4 space-y-4'>
        <form
          onSubmit={handleSubmit}
          action=''
          className='flex flex-col gap-4 space-y-4'
        >
          {flagData.map((group) => (
            <FormCard title={group.group_name}>
              {group.flags.map((indicator) => (
                <div
                  key={indicator.id}
                  className='flex items-center gap-2'
                >
                  <CheckBox
                    label={indicator.label}
                    value={indicator.value}
                    toggleValue={() =>
                      updateFlagData(indicator.id, !indicator.value, indicator.label)
                    }
                  />
                </div>
              ))}
            </FormCard>
          ))}
          <div className='flex justify-between gap-2'>
            <Button
              label='Cancel'
              variant='secondary'
              onClick={() => setShowModal(false)}
            />
            <Button
              type='submit'
              disabled={loading}
              label='Save'
              variant={loading ? 'loading' : 'default'}
              processing={loading}
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}
