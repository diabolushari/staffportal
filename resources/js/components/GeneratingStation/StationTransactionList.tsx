import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import StationTransactionSearch from './StationTransactionSearch'
import { StationTransaction } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { tr } from 'date-fns/locale'
import dayjs from 'dayjs'

interface Props {
  transactions: StationTransaction[]
  filters: StationTransactionFilters
  transactionTypes: ParameterValues[]
  stationId: number
}
interface StationTransactionFilters {
  transaction_type_id?: string
  consumer_number?: string
  date_from?: string
  date_to?: string
}

export default function StationTransactionTable({
  transactions,
  filters,
  transactionTypes,
  stationId,
}: Props) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className='flex h-full items-center justify-center text-gray-500'>
        No Transactions Found
      </div>
    )
  }

  // Compute only Generated Units
  //const generatedUnits = transactions.reduce((sum, txn) => sum + (txn.txn_units || 0), 0)
  const generatedUnits = transactions
    .filter((txn) => txn.txn_type?.parameter_code === 'GEN_CREDIT')
    .reduce((sum, txn) => sum + (txn.txn_units || 0), 0)

  const adjustedUnits = transactions
    .filter((txn) => txn.txn_direction?.trim().toUpperCase() === 'D')
    .reduce((sum, txn) => sum + (txn.pre_conversion_units || 0), 0)
  console.log(transactions)

  return (
    <div className='rounded-lg bg-white p-4'>
      {/* Generated Units Card */}
      {/* <div className='mb-4 w-40 rounded-lg border bg-white p-4 text-center shadow-sm'>
        <div className='text-sm font-semibold text-green-600'>+ Generated Units</div>
        <div className='text-xl font-bold text-green-600'>{generatedUnits.toLocaleString()}</div>
      </div> */}
      <div className='mb-4 flex gap-4'>
        {/* Generated Units Card */}
        <div className='w-40 rounded-lg border bg-white p-4 text-center shadow-sm'>
          <div className='text-sm font-semibold text-green-600'>Generated Units</div>
          <div className='text-xl font-bold text-green-700'>{generatedUnits.toLocaleString()}</div>
        </div>

        {/* Adjusted Units Card */}
        <div className='w-40 rounded-lg border bg-white p-4 text-center shadow-sm'>
          <div className='text-sm font-semibold text-blue-800'>Adjusted Units</div>
          <div className='text-xl font-bold'>{adjustedUnits.toLocaleString()}</div>
        </div>
      </div>
      <StationTransactionSearch
        filters={filters}
        transactionTypes={transactionTypes}
        stationId={stationId}
      />

      {/* Transaction Table */}
      <Table>
        <TableHeader className='bg-gray-100'>
          <TableRow>
            <TableHead className='font-semibold text-blue-700'>Date</TableHead>
            <TableHead className='font-semibold text-blue-700'>Transaction Type</TableHead>
            <TableHead className='font-semibold text-blue-700'>Adjusted To</TableHead>
            <TableHead className='font-semibold text-blue-700'>Source Zone</TableHead>
            <TableHead className='font-semibold text-blue-700'>Target Zone</TableHead>
            <TableHead className='font-semibold text-blue-700'>Direction</TableHead>
            <TableHead className='font-semibold text-blue-700'>Adjusted Units</TableHead>
            <TableHead className='font-semibold text-blue-700'>Conversion Factor</TableHead>
            <TableHead className='font-semibold text-blue-700'>Banked Units</TableHead>
            <TableHead className='font-semibold text-blue-700'>Transaction Group Ref</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((txn) => {
            const direction = txn.txn_direction?.trim().toUpperCase()

            const sourceZone =
              direction === 'D'
                ? txn.timezone?.parameter_value
                : txn.source_timezone?.parameter_value

            const targetZone =
              direction === 'D'
                ? txn.source_timezone?.parameter_value
                : txn.timezone?.parameter_value

            return (
              <TableRow key={txn.txn_id}>
                <TableCell className='py-3 text-gray-700'>
                  {txn.txn_date ? dayjs(txn.txn_date).format('MMM DD, YYYY') : '-'}
                </TableCell>

                <TableCell className='py-3 text-gray-700'>
                  {txn.txn_type?.parameter_value ?? '-'}
                </TableCell>

                <TableCell className='py-3 text-gray-700'>
                  {txn.consumer_connection?.consumer_number ?? '-'}
                </TableCell>

                <TableCell className='py-3 text-gray-700'>
                  <span className='rounded-full bg-gray-100 px-2 py-1 text-xs'>
                    {sourceZone ?? '-'}
                  </span>
                </TableCell>
                <TableCell className='py-3 text-gray-700'>
                  <span className='rounded-full bg-gray-100 px-2 py-1 text-xs'>
                    {targetZone ?? '-'}
                  </span>
                </TableCell>

                <TableCell className='py-3 text-gray-700'>
                  {direction === 'C' ? 'C' : 'D'}
                </TableCell>

                <TableCell className='py-3 text-gray-700'>
                  {(() => {
                    //const isGen = txn.txn_type?.parameter_code === 'GEN_CREDIT'
                    // const value = isGen ? txn.txn_units : txn.pre_conversion_units
                    const isGen = txn.txn_type?.parameter_code === 'GEN_CREDIT'
                    const isInterZone = txn.txn_type?.parameter_code?.includes('INTER_ZONE')

                    let value = null

                    if (isGen) {
                      value = txn.txn_units
                    } else if (isInterZone) {
                      value = direction === 'D' ? txn.pre_conversion_units : txn.txn_units
                    } else {
                      value = txn.txn_units
                    }

                    if (value == null) return '-'

                    const isPositive = isGen || direction === 'C'

                    return (
                      <span
                        className={
                          isPositive ? 'font-semibold text-green-600' : 'font-semibold text-red-600'
                        }
                      >
                        {isPositive ? '+' : '-'}
                        {value}
                      </span>
                    )
                  })()}
                </TableCell>

                <TableCell className='py-3 text-gray-700'>{txn.conversion_factor ?? '-'}</TableCell>
                <TableCell className='py-3 font-medium text-gray-700'>
                  {txn.unit_balance != null ? txn.unit_balance : '-'}
                </TableCell>
                <TableCell className='py-3 text-gray-700'>{txn.txn_group_ref ?? '-'}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
