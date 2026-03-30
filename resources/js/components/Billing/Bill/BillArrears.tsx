import { useMemo } from 'react'

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { BillMeterReading, ComputedProperties } from '@/interfaces/bill_pdf_interfaces'
import { Bill, Connection } from '@/interfaces/data_interfaces'
import { getDisplayDate } from '@/utils'

export default function BillArrears({
  bill,
  connection,
  kvaValues,
  kwhValues,
  mf,
  computedProperties,
}: {
  bill: Bill
  connection: Connection
  kvaValues: BillMeterReading[]
  kwhValues: BillMeterReading[]
  mf: number
  computedProperties: ComputedProperties
}) {
  console.log(computedProperties)

  const totalConsumption = useMemo(() => {
    if (!kwhValues?.length) {
      return null
    }

    return kwhValues.reduce((sum, reading) => sum + (reading?.value ?? 0), 0)
  }, [kwhValues])

  const recordedMaxDemand = useMemo(() => {
    return computedProperties?.recorded_max_demand?.result as string
  }, [computedProperties])

  return (
    <Table className='bill-table border border-black'>
      <TableBody>
        {/* ───── Row 1 : Arrears + Reading Dates + Email ───── */}
        <TableRow>
          <TableCell
            colSpan={6}
            className='border border-black text-center font-semibold'
          >
            Arrears as on {getDisplayDate(connection?.previous_reading?.reading_end_date) ?? '-'}
          </TableCell>

          <TableCell
            colSpan={2}
            className='border border-black'
          >
            Date of Previous Reading
          </TableCell>
          <TableCell
            colSpan={1}
            className='border border-black font-semibold'
          >
            {getDisplayDate(connection?.previous_reading?.reading_end_date) ?? '-'}
          </TableCell>
          <TableCell
            colSpan={1}
            className='border border-black'
          >
            {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.primary_email ?? '-'}
          </TableCell>
        </TableRow>

        {/* ───── Row 2 : Disputed / Undisputed + Present Reading + Voltage ───── */}
        <TableRow>
          <TableCell className='border border-black'>Disputed</TableCell>
          <TableCell className='border border-black text-right'>0.00</TableCell>
          <TableCell className='border border-black'>Undisputed</TableCell>
          <TableCell className='border border-black text-right'>0.00</TableCell>

          <TableCell
            colSpan={4}
            className='border border-black'
          >
            Date of Present Reading
          </TableCell>
          <TableCell
            colSpan={1}
            className='border border-black font-semibold'
          >
            {getDisplayDate(connection?.latest_meter_reading?.reading_end_date) ?? '-'}
          </TableCell>
          <TableCell className='flex border border-black p-0'>
            <div className='border border-black p-1'>Supply Voltage </div>{' '}
            <div className='border border-black p-1'>
              {connection?.voltage?.parameter_value ?? '-'} kV{' '}
            </div>
            <div className='border border-black p-1'>
              {connection?.connection_type?.parameter_value ?? '-'}{' '}
            </div>
          </TableCell>
        </TableRow>

        {/* ───── Row 3 : Contract Demand headers + Average header + Billing Type ───── */}
        <TableRow>
          <TableCell className='border border-black text-center'>Contract Demand (kVA)</TableCell>
          <TableCell className='border border-black text-center'>75% of CD (kVA)</TableCell>
          <TableCell className='border border-black text-center'>130% of CD (kVA)</TableCell>
          <TableCell
            colSpan={3}
            className='border border-black text-center'
          >
            Connected Load (kW)
          </TableCell>

          <TableCell
            colSpan={3}
            className='border border-black text-center font-semibold'
          >
            Average
          </TableCell>

          <TableCell
            colSpan={3}
            className='border border-black'
          >
            Billing Type : {connection?.billing_process?.parameter_value ?? '-'}
          </TableCell>
        </TableRow>

        {/* ───── Row 4 : Contract Demand values + Average values + Section ───── */}
        <TableRow>
          <TableCell className='border border-black text-center'>
            {connection?.contract_demand_kva_val ?? '-'}
          </TableCell>
          <TableCell className='border border-black text-center'>
            {Number(computedProperties?.['75_of_contract_demand']?.result).toFixed(2) ?? '-'}
          </TableCell>
          <TableCell className='border border-black text-center'>
            {Number(computedProperties?.['130_of_contract_demand']?.result).toFixed(2) ?? '-'}
          </TableCell>
          <TableCell
            colSpan={3}
            className='border border-black text-center'
          >
            {connection?.connected_load_kw_val ?? '-'}
          </TableCell>

          <TableCell className='border border-black text-center'>MD (kVA)</TableCell>
          <TableCell className='border border-black text-center'>Consumption (kWh)</TableCell>
          <TableCell className='border border-black text-center'>PF</TableCell>

          <TableCell
            colSpan={3}
            className='border border-black'
          >
            Section : {connection?.service_office?.office_name ?? '-'}
          </TableCell>
        </TableRow>

        {/* ───── Row 5 : Average numbers + Circle ───── */}
        <TableRow>
          <TableCell
            colSpan={6}
            className='border border-black'
          />

          <TableCell className='border border-black text-center'>
            {recordedMaxDemand ?? '-'}
          </TableCell>

          <TableCell className='border border-black text-center'>
            {totalConsumption !== null ? totalConsumption : '-'}
          </TableCell>

          <TableCell className='border border-black text-center'>
            {computedProperties?.power_factor?.result
              ? Number(computedProperties.power_factor.result).toFixed(2)
              : '-'}
          </TableCell>

          <TableCell
            colSpan={3}
            className='border border-black'
          >
            Circle : {connection?.admin_office?.office_name ?? '-'}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
