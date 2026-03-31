import { Office } from '@/interfaces/data_interfaces'
import Modal from '@/ui/Modal/Modal'

interface Props {
  office: Office
}
export default function OfficeBasicInfoForm({ office }: Props) {
  return (
    <Modal
      title='Edit Office Basic Information'
      setShowModal={() => {}}
    ></Modal>
  )
}
