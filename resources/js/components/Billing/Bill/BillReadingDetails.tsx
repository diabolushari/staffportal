import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BillMeterReading,
  ComputedProperties,
  ComputedProperty,
  MeterWithMf,
} from '@/interfaces/bill_pdf_interfaces'
import { Bill } from '@/interfaces/data_interfaces'
import { getDisplayMonthYear } from '@/utils'

interface BillReadingDetailsProps {
  bill: Bill
  meter: MeterWithMf
  kwhValues: BillMeterReading[]
  kvahValues: BillMeterReading[]
  kvaValues: BillMeterReading[]
  lagValues: BillMeterReading[]
  leadValues: BillMeterReading[]
  computedProperties: ComputedProperties
  selfGenerationkwhValues: BillMeterReading[]
  timeZones?: ComputedProperty
}

export default function BillReadingDetails({
  bill,
  meter,
  kwhValues,
  kvahValues,
  kvaValues,
  lagValues,
  leadValues,
  computedProperties,
  selfGenerationkwhValues,
  timeZones,
}: Readonly<BillReadingDetailsProps>) {
  const mf = meter?.meter_mf ?? 1
  console.log(timeZones, 'timezoens')
  return (
    <div className='mb-2'>
      <div className='flex items-center justify-center border border-black p-2'>
        <h3 className='font-bold'>
          Reading Details of meter {meter?.meter?.meter_serial ?? '-'} - Working (KVA, KWh, KVAh &
          KVARh) for {getDisplayMonthYear(bill?.reading_year_month) ?? '-'}
        </h3>
      </div>

      {/* kWh + kVARh */}
      <div className='grid grid-cols-2'>
        <Table className='bill-table mb-0 w-full border border-black'>
          <TableHeader>
            {/* SECTION TITLES */}
            <TableRow>
              <TableHead
                colSpan={12}
                className='border border-black text-center font-bold'
              >
                1. Energy Consumption (kWh)
              </TableHead>
            </TableRow>

            {/* COLUMN HEADERS */}
            <TableRow className='text-center font-bold italic'>
              {/* kWh (LEFT HALF) */}
              <TableCell
                colSpan={1}
                className='w-12 border border-black text-center'
              >
                Zone
              </TableCell>
              <TableCell
                colSpan={3}
                className='border border-black text-center'
              >
                FR
              </TableCell>
              <TableCell
                colSpan={3}
                className='border border-black text-center'
              >
                IR
              </TableCell>
              <TableCell
                colSpan={2}
                className='border border-black text-center'
              >
                MF
              </TableCell>
              <TableCell
                colSpan={2}
                className='border border-black text-center'
              >
                Units
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {kwhValues?.map((kwh, i) => {
              return (
                <TableRow key={i}>
                  {/* kWh */}
                  <TableCell
                    colSpan={1}
                    className='w-12 border border-black text-center'
                  >
                    {timeZones?.result[i]?.result && timeZones.result.length <= 2
                      ? `${timeZones?.result[i]?.result}`
                      : i + 1}
                  </TableCell>
                  <TableCell
                    colSpan={3}
                    className='border border-black text-right'
                  >
                    {kwh?.final_reading.toFixed(2) ?? 0}
                  </TableCell>
                  <TableCell
                    colSpan={3}
                    className='border border-black text-right'
                  >
                    {kwh?.initial_reading.toFixed(2) ?? 0}
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    className='border border-black text-center'
                  >
                    {kwh?.meter_mf?.toFixed(4) ?? 0}
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    className='border border-black text-right'
                  >
                    {kwh.value}
                  </TableCell>

                  {/* kVARh LAG */}
                </TableRow>
              )
            })}

            {/* TOTAL ROW */}
            <TableRow className='bg-gray-100 font-bold'>
              {/* kWh total */}
              <TableCell
                colSpan={9}
                className='border border-black text-right'
              >
                Total
              </TableCell>
              <TableCell
                colSpan={2}
                className='border border-black text-right'
              >
                {kwhValues?.reduce((s, r) => s + (r?.value ?? 0), 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className='bill-table'>
          <TableHeader>
            {/* SECTION TITLES */}
            <TableRow className='border border-black'>
              <TableHead
                colSpan={5}
                className='text-center font-bold'
              >
                3. Energy Consumption (kVARh) Lag &
              </TableHead>
              <TableHead
                colSpan={4}
                className='text-center font-bold'
              >
                Consumption (kVARh) Lead
              </TableHead>
            </TableRow>
            <TableRow className='text-center font-bold italic'>
              <TableCell className='w-12 border border-black font-bold italic'>Zone</TableCell>
              <TableCell className='border border-black font-bold italic'>FR</TableCell>
              <TableCell className='border border-black font-bold italic'>IR</TableCell>
              <TableCell className='border border-black font-bold italic'>MF</TableCell>
              <TableCell className='border border-black font-bold italic'>Units</TableCell>

              {/* kVARh LEAD (1/3 of right half) */}
              <TableCell className='border border-black font-bold italic'>FR</TableCell>
              <TableCell className='border border-black font-bold italic'>IR</TableCell>
              <TableCell className='border border-black font-bold italic'>Units</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lagValues?.map((lag, i) => {
              const lead = leadValues?.[i] ?? {}
              return (
                <TableRow key={i}>
                  <TableCell className='w-12 border border-black text-center'>
                    {timeZones?.result[i]?.result && timeZones.result.length <= 2
                      ? `${timeZones?.result[i]?.result}`
                      : i + 1}
                  </TableCell>
                  <TableCell className='border border-black text-right'>
                    {lag?.final_reading ?? 0}
                  </TableCell>
                  <TableCell className='border border-black text-right'>
                    {lag?.initial_reading ?? 0}
                  </TableCell>
                  <TableCell className='border border-black text-center'>
                    {lag?.meter_mf?.toFixed(4) ?? 0}
                  </TableCell>
                  <TableCell className='border border-black text-right'>
                    {lag?.value ?? 0}
                  </TableCell>

                  {/* kVARh LEAD */}
                  <TableCell className='border border-black text-right'>
                    {lead?.final_reading ?? 0}
                  </TableCell>
                  <TableCell className='border border-black text-right'>
                    {lead?.initial_reading ?? 0}
                  </TableCell>
                  <TableCell className='border border-black text-right'>
                    {lead?.value ?? 0}
                  </TableCell>
                </TableRow>
              )
            })}
            <TableRow>
              {/* kVARh Lag total */}
              <TableCell
                colSpan={4}
                className='border border-black text-right'
              >
                Total kVARh (Lag)
              </TableCell>
              <TableCell className='border border-black text-right'>
                {lagValues?.reduce((s, r) => s + (r?.value ?? 0), 0)}
              </TableCell>

              {/* kVARh Lead total */}
              <TableCell
                colSpan={2}
                className='border border-black text-right'
              >
                Total kVARh (Lead)
              </TableCell>
              <TableCell
                colSpan={3}
                className='border border-black text-right'
              >
                {leadValues?.reduce((s, r) => s + (r?.value ?? 0), 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* kVAh + Demand */}
      <div className='grid grid-cols-2'>
        <Table className='bill-table w-full border border-black'>
          <TableHeader>
            <TableRow>
              <TableHead
                colSpan={5}
                className='border border-black font-bold'
              >
                2. Energy Consumption (kVAh)
              </TableHead>
            </TableRow>

            <TableRow className='text-center font-bold italic'>
              <TableCell className='w-12 border border-black text-center'>Zone</TableCell>
              <TableCell className='border border-black text-center'>FR</TableCell>
              <TableCell className='border border-black text-center'>IR</TableCell>
              <TableCell className='border border-black text-center'>MF</TableCell>
              <TableCell className='border border-black text-center'>Units</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {kvahValues?.map((kvah, i) => {
              const kva = kvaValues?.[i] ?? {}

              return (
                <TableRow
                  key={i}
                  className=''
                >
                  <TableCell className='border border-black text-center'>
                    {timeZones?.result[i]?.result && timeZones.result.length <= 2
                      ? `${timeZones?.result[i]?.result}`
                      : i + 1}
                  </TableCell>
                  <TableCell className='border border-black text-right'>
                    {kvah?.final_reading ?? '-'}
                  </TableCell>
                  <TableCell className='border border-black text-right'>
                    {kvah?.initial_reading ?? '-'}
                  </TableCell>
                  <TableCell className='border border-black text-center'>
                    {kvah?.meter_mf?.toFixed(4) ?? 0}
                  </TableCell>
                  <TableCell className='border border-black text-right'>
                    {kvah?.value ?? 0}
                  </TableCell>
                </TableRow>
              )
            })}

            <TableRow className='bg-gray-100 font-bold'>
              <TableCell
                colSpan={4}
                className='border border-black'
              >
                Total
              </TableCell>
              <TableCell className='border border-black text-right'>
                {kvahValues?.reduce((s, r) => s + (r?.value ?? 0), 0) ?? '-'}
              </TableCell>
            </TableRow>
            <TableRow className='bg-gray-100'>
              <TableCell
                colSpan={3}
                className='border border-black'
              >
                Ave.PF=KWh/KVAh
              </TableCell>
              <TableCell
                colSpan={2}
                className='border border-black'
              >
                {Number(computedProperties?.power_factor?.result).toFixed(2) ?? '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className='bill-table border border-black'>
          <TableHeader>
            <TableRow className='text-center'>
              <TableHead
                colSpan={0}
                className='border border-black font-bold'
              >
                4. Demand (kVA)
              </TableHead>
              <TableHead className='border border-black text-center font-bold italic'>
                Readings
              </TableHead>
              <TableHead className='border border-black text-center font-bold italic'>MF</TableHead>
              <TableHead className='border border-black text-center font-bold italic'>
                Units
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kvaValues?.map((kva, i) => {
              return (
                <TableRow key={i}>
                  <TableCell className='border border-black text-center'>
                    {timeZones?.result[i]?.result && timeZones.result.length <= 2
                      ? `${timeZones?.result[i]?.result}`
                      : i + 1}
                  </TableCell>
                  <TableCell className='border border-black text-right'>
                    {kva?.final_reading ?? '-'}
                  </TableCell>
                  <TableCell className='border border-black text-center'>
                    {kva?.meter_mf?.toFixed(4) ?? 0}
                  </TableCell>
                  <TableCell className='border border-black text-right'>
                    {kva?.value.toFixed(2) ?? 0}
                  </TableCell>
                </TableRow>
              )
            })}
            <TableRow className='bg-gray-100'>
              <TableCell
                colSpan={2}
                className='border border-black font-bold'
              >
                5. Factory lighting
              </TableCell>
              <TableCell
                colSpan={2}
                className='border border-black text-right'
              >
                {Number(computedProperties?.total_consumption_factory_lighting?.result).toFixed(
                  2
                ) ?? '-'}
              </TableCell>
            </TableRow>
            <TableRow className='bg-gray-100'>
              <TableCell
                colSpan={2}
                className='border border-black font-bold'
              >
                6. Colony lighting
              </TableCell>
              <TableCell
                colSpan={2}
                className='border border-black text-right'
              >
                {Number(computedProperties?.total_consumption_colony_lighting?.result).toFixed(2) ??
                  '-'}
              </TableCell>
            </TableRow>
            <TableRow className='bg-gray-100'>
              <TableCell
                colSpan={2}
                className='border border-black font-bold'
              >
                7. Generator
              </TableCell>
              <TableCell
                colSpan={2}
                className='border border-black text-right'
              >
                {selfGenerationkwhValues?.reduce((s, r) => s + (r?.value ?? 0), 0).toFixed(2) ??
                  '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
