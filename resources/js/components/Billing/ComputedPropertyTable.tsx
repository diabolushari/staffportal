import { ComputedProperty } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'

interface Props {
  computedProperties: ComputedProperty[]
  pagination: Paginator<ComputedProperty>
}

export default function ComputedPropertyTable({ computedProperties, pagination }: Props) {
  return (
    <div className='mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm'>
      <table className='min-w-full divide-y divide-gray-200 text-sm'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-2 text-left font-semibold text-gray-700'>#</th>
            <th className='px-4 py-2 text-left font-semibold text-gray-700'>Property Name</th>
            <th className='px-4 py-2 text-left font-semibold text-gray-700'>Effective Start</th>
            <th className='px-4 py-2 text-left font-semibold text-gray-700'>Effective End</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100'>
          {computedProperties.map((prop) => (
            <tr key={prop.id}>
              <td className='px-4 py-2'>{prop.id}</td>
              <td className='px-4 py-2'>{prop.name || '-'}</td>
              <td className='px-4 py-2'>{prop.effective_start || '-'}</td>
              <td className='px-4 py-2'>{prop.effective_end || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination pagination={pagination} />
    </div>
  )
}
