import { X } from 'lucide-react'

interface Props {
  label: string
  value: string
  onRemove: () => void
}

const FilterBox = ({ label, value, onRemove }: Props) => (
  <span className='border-kseb-line border bg-kseb-primary-100 flex items-center gap-2 rounded-full bg-kseb-light p-2 px-3 py-1 text-xs text-gray-700'>
    <span className='pr-2'>
     <b> {label}:</b> {value}
    </span>
    <X
      size={14}
      className='cursor-pointer hover:text-red-500 text-kseb-primary'
      onClick={onRemove}
    />
  </span>
)

export default FilterBox
