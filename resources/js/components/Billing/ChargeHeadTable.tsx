import { ChargeHead } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'

interface Props {
  chargeHeads: ChargeHead[]
  pagination: Paginator<ChargeHead>
}

export default function ChargeHeadTable({ chargeHeads, pagination }: Props) {
  return (
    <div className='mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm'>
      <table className='min-w-full divide-y divide-gray-200 text-sm'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-2 text-left font-semibold text-gray-700'>#</th>
            <th className='px-4 py-2 text-left font-semibold text-gray-700'>Name</th>
            <th className='px-4 py-2 text-left font-semibold text-gray-700'>Effective Start</th>
            <th className='px-4 py-2 text-left font-semibold text-gray-700'>Effective End</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100'>
          {chargeHeads?.map((head) => (
            <tr key={head?.id}>
              <td className='px-4 py-2'>{head?.id}</td>
              <td className='px-4 py-2'>{head?.charge_head_definitions[0]?.name}</td>
              <td className='px-4 py-2'>
                {head?.charge_head_definitions[0]?.effective_from || '-'}
              </td>
              <td className='px-4 py-2'>{head?.charge_head_definitions[0]?.effective_to || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination pagination={pagination} />
    </div>
  )
}
