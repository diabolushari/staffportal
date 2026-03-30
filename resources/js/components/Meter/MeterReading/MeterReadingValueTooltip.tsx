import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MeterProfileParameter } from '@/interfaces/data_interfaces'
import { MeterReadingFormState } from './ReadingForm/useMeterReadingForm'

interface Props {
  meterId: number
  readingsByMeter: MeterReadingFormState[]
  profile: MeterProfileParameter
}

const rowLabels = ['initial', 'final', 'diff', 'value']

export default function MeterReadingValueTooltip({
  meterId,
  readingsByMeter,
  profile,
}: Readonly<Props>) {
  const meterData = readingsByMeter?.find((m) => m.meter_id === meterId)
  if (!meterData) {
    return <div className='p-2 text-xs text-gray-500'>No data available</div>
  }

  const paramData = meterData?.parameters?.find(
    (p) => p.meter_parameter_id === profile.meter_parameter_id
  )
  if (!paramData) {
    return <div className='p-2 text-xs text-gray-500'>No data available</div>
  }

  return (
    <div className='max-h-64 overflow-auto rounded-md bg-blue-100 p-2'>
      <Table className='text-xs'>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            {paramData?.readings?.map((tz) => (
              <TableHead
                key={tz?.timezone_id}
                className='text-center'
              >
                {tz?.timezone_name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowLabels.map((rowKey, index) => (
            <TableRow key={index}>
              <TableCell className='text-center font-medium text-black'>
                {rowKey === 'value' ? 'Total' : rowKey.charAt(0).toUpperCase() + rowKey.slice(1)}
              </TableCell>
              {paramData?.readings?.map((tz) => (
                <TableCell
                  key={tz?.timezone_id}
                  className='text-center text-gray-800'
                >
                  {tz?.values?.[rowKey] ?? ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
