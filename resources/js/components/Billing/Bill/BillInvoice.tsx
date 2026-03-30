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
  ChargeHeads,
  ComputedProperties,
  OtherChargeItem,
  TotalDemandCharge,
  TotalEnergyCharge,
} from '@/interfaces/bill_pdf_interfaces'
import { Bill } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import { numberToWords, roundedOffAmount } from '@/utils'

export default function BillInvoice({
  chargeHeads,
  totalDemandChargeRows,
  totalEnergyChargeRows,
  bill,
  computedProperties,
  kwhValues,
  selfGenerationkwhValues,
  otherCharges,
}: {
  chargeHeads: ChargeHeads
  totalDemandChargeRows: TotalDemandCharge
  totalEnergyChargeRows: TotalEnergyCharge
  bill: Bill
  computedProperties: ComputedProperties
  kwhValues: BillMeterReading[]
  selfGenerationkwhValues: BillMeterReading[]
  otherCharges: OtherChargeItem[]
}) {
  console.log(chargeHeads)
  const subTotalLabel = totalEnergyChargeRows?.rows
    ?.map((_, index) => String.fromCharCode(97 + index))
    .join('+')
  const buildAlphaSum = (count?: number) =>
    Array.from({ length: count ?? 0 }, (_, i) => String.fromCharCode(97 + i)).join('+')

  return (
    <>
      <div className='flex items-center justify-center border border-black'>
        <StrongText className='text-lg'>Invoice</StrongText>
      </div>
      <div className='grid grid-cols-3'>
        <div className='col-span-2'>
          <Table className='bill-table w-full'>
            <TableHeader>
              <TableRow className='p-0'>
                <TableHead
                  className='border border-black'
                  colSpan={2}
                />
                <TableHead className='border border-black text-right'>Units</TableHead>
                <TableHead className='border border-black text-right'>Rate</TableHead>
                <TableHead className='border border-black text-right'>Amount(Rs)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='border border-black'
                >
                  1.Total Demand Charge
                </TableCell>
              </TableRow>
              {totalDemandChargeRows.rows?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    colSpan={2}
                    className='border border-black'
                  >
                    {String.fromCharCode(97 + index)}. {row?.label}
                  </TableCell>
                  <TableCell className='border border-black'>{row?.units}</TableCell>
                  <TableCell className='border border-black'>
                    {Number(row?.rate).toFixed(2)}
                  </TableCell>
                  <TableCell className='border border-black'>
                    {Number(row?.amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell
                  className='border border-black font-bold'
                  colSpan={4}
                >
                  Sub Total({buildAlphaSum(totalDemandChargeRows.rows?.length)})
                </TableCell>
                <TableCell className='border border-black text-right'>
                  {Number.isNaN(Number(chargeHeads?.total_demand_charge?.result)) ||
                  chargeHeads?.total_demand_charge?.result === null
                    ? '-'
                    : Number(chargeHeads?.total_demand_charge?.result).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='border border-black'
                >
                  2.Total Energy Charges
                </TableCell>
              </TableRow>

              {totalEnergyChargeRows?.rows?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    colSpan={2}
                    className='border border-black'
                  >
                    {String.fromCharCode(97 + index)}. {row?.label}
                  </TableCell>
                  <TableCell className='border border-black'>{row?.units}</TableCell>
                  <TableCell className='border border-black'>
                    {Number(row?.rate?.result).toFixed(4)}
                  </TableCell>
                  <TableCell className='border border-black'>
                    {Number(row?.amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  className='border border-black font-bold'
                  colSpan={4}
                >
                  Sub Total ({buildAlphaSum(totalEnergyChargeRows?.rows?.length)})
                </TableCell>
                <TableCell className='border border-black text-right'>
                  {Number.isNaN(Number(chargeHeads?.energy_charge?.result)) ||
                  chargeHeads?.energy_charge?.result === null
                    ? '-'
                    : Number(chargeHeads?.energy_charge?.result).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className='border border-black'
                  colSpan={4}
                >
                  3. PF Incentive / Disincentive
                </TableCell>
                <TableCell className='border border-black text-right'>
                  {Number.isNaN(
                    Number(chargeHeads.power_factor_incentive_and_disincentive?.result)
                  ) || chargeHeads.power_factor_incentive_and_disincentive?.result === null
                    ? '-'
                    : Number(chargeHeads.power_factor_incentive_and_disincentive?.result)?.toFixed(
                        2
                      )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className='border border-black font-bold'
                  colSpan={4}
                >
                  Total Energy Charge
                </TableCell>
                <TableCell className='border border-black text-right'>
                  {Number.isNaN(Number(chargeHeads?.energy_charge?.result)) ||
                  chargeHeads?.energy_charge?.result === null ||
                  Number.isNaN(Number(chargeHeads?.power_factor_incentive_and_disincentive?.result))
                    ? '-'
                    : (
                        Number(chargeHeads?.energy_charge?.result) +
                        Number(chargeHeads.power_factor_incentive_and_disincentive?.result)
                      )?.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='border border-black'
                >
                  4.Energy Charges on Lighting load
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  a.Factory lighting
                </TableCell>
                <TableCell className='border border-black'>
                  {Number(computedProperties?.total_consumption_factory_lighting?.result).toFixed(
                    2
                  ) ?? '-'}
                </TableCell>
                <TableCell className='border border-black'>
                  {Number(computedProperties?.factory_lighting_unit_rate?.result).toFixed(2) ?? '-'}
                </TableCell>
                <TableCell className='border border-black'>
                  {Number(chargeHeads?.factory_lighting?.result).toFixed(2) ?? '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  b. Colony lighting
                </TableCell>
                <TableCell className='border border-black'>
                  {Number(computedProperties?.total_consumption_colony_lighting?.result).toFixed(
                    2
                  ) ?? '-'}
                </TableCell>
                <TableCell className='border border-black'>
                  {Number(computedProperties?.colony_lighting_unit_rate?.result).toFixed(2) ?? '-'}
                </TableCell>
                <TableCell className='border border-black'>
                  {Number(chargeHeads?.colony_lighting?.result).toFixed(2) ?? '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className='border border-black font-bold'
                  colSpan={4}
                >
                  Sub Total(a+b)
                </TableCell>
                <TableCell className='border border-black text-right'>
                  {Number.isNaN(Number(chargeHeads?.colony_lighting?.result)) ||
                  chargeHeads?.colony_lighting?.result === null ||
                  Number.isNaN(Number(chargeHeads?.factory_lighting?.result)) ||
                  chargeHeads?.factory_lighting?.result === null
                    ? '-'
                    : (
                        Number(chargeHeads?.colony_lighting?.result) +
                        Number(chargeHeads?.factory_lighting?.result)
                      ).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  5. Electricity Duty
                </TableCell>
                <TableCell className='border border-black'>
                  {Number(chargeHeads?.energy_charge?.result)?.toFixed(2) ?? '-'}
                </TableCell>
                <TableCell className='border border-black'>
                  {Number(computedProperties?.electricity_duty_rate?.result)?.toFixed(3) ?? '-'}
                </TableCell>
                <TableCell className='border border-black'>
                  {Number(chargeHeads?.electricity_duty?.result)?.toFixed(2) ?? '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  6.Ele. Surcharge(*)
                </TableCell>
                <TableCell className='border border-black'>
                  {kwhValues?.reduce((s, r) => s + (r?.value ?? 0), 0)}
                </TableCell>
                <TableCell className='border border-black'>
                  {Number(computedProperties?.electricity_surcharge_rate?.result)?.toFixed(3) ??
                    '-'}
                </TableCell>
                <TableCell className='border border-black'>
                  {Number(chargeHeads?.electricity_surcharge?.result)?.toFixed(2) ?? '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  7. Duty On Self Generated Energy
                </TableCell>
                <TableCell className='border border-black'>
                  {Number(
                    selfGenerationkwhValues?.reduce((s, r) => s + (r?.value ?? 0), 0)
                  )?.toFixed(2) ?? '-'}
                </TableCell>
                <TableCell className='border border-black'>
                  {Number(computedProperties?.self_generation_duty_rate?.result)?.toFixed(3) ?? '-'}
                </TableCell>
                <TableCell className='border border-black'>
                  {Number(chargeHeads?.self_generation_duty?.result)?.toFixed(2) ?? '0'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className='border border-black'
                  colSpan={4}
                >
                  8.Penalty for non-segn. of light load
                </TableCell>
                <TableCell className='border border-black text-right'>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className='flex h-full flex-col border border-black'>
          <Table className='bill-table w-full border border-black'>
            <TableHeader>
              <TableRow>
                <TableHead
                  colSpan={2}
                  className='border border-black'
                />
                <TableHead className='border border-black text-right'>Amount (Rs)</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* 9. Other Charges */}
              <TableRow>
                <TableCell
                  colSpan={3}
                  className='border border-black font-semibold'
                >
                  9. Other Charges
                </TableCell>
              </TableRow>

              {otherCharges?.map((charge, index) => (
                <TableRow key={index}>
                  <TableCell
                    colSpan={2}
                    className='border border-black'
                  >
                    {charge?.name +
                      ' (' +
                      charge?.units +
                      ' units at rate of ' +
                      charge?.rate +
                      ')'}
                  </TableCell>
                  <TableCell className='border border-black text-right'>
                    {Number(charge?.amount)?.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {/* Spacer rows like printed bill */}

              {/* 10. Total */}
            </TableBody>
          </Table>
          <div className='mt-auto w-full border'>
            <Table className='bill-table'>
              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black font-bold'
                >
                  10. Total (add 1 to 9)
                </TableCell>
                <TableCell className='border border-black text-right font-bold'>
                  {Number(bill?.bill_amount) ? Number(bill?.bill_amount).toFixed(2) : '-'}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  Plus / Minus (Round off)
                </TableCell>
                <TableCell className='border border-black text-right'>
                  {bill.bill_amount ? roundedOffAmount(Number(bill.bill_amount)).roundOff : '-'}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  UnDisputed Arr Amount
                </TableCell>
                <TableCell className='border border-black text-right'>0.00</TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  ACD_FY Assessment
                </TableCell>
                <TableCell className='border border-black text-right'>0.00</TableCell>
              </TableRow>

              {/* Less section */}
              <TableRow>
                <TableCell
                  rowSpan={3}
                  className='border border-black align-top'
                >
                  Less
                </TableCell>
                <TableCell className='border border-black'>1. Advance / Credit</TableCell>
                <TableCell className='border border-black text-right'>0.00</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='border border-black'>2. CD Interest</TableCell>
                <TableCell className='border border-black text-right'>0.00</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='border border-black'>3. CD / Oth Ref</TableCell>
                <TableCell className='border border-black text-right'>0.00</TableCell>
              </TableRow>

              {/* Net Payable */}
              <TableRow className='text-base font-bold'>
                <TableCell
                  colSpan={2}
                  className='border border-black'
                >
                  Net Payable
                </TableCell>
                <TableCell className='border border-black text-right'>
                  {bill.bill_amount
                    ? roundedOffAmount(Number(bill.bill_amount)).updatedAmount
                    : '-'}
                </TableCell>
              </TableRow>
            </Table>
          </div>
        </div>
        <div className='col-span-12 w-full border border-black'>
          <Table className='bill-table'>
            <TableRow>
              <TableCell
                colSpan={12}
                className='border border-black font-bold italic'
              >
                ( {numberToWords(Number(roundedOffAmount(Number(bill.bill_amount)).updatedAmount))}{' '}
                )
              </TableCell>
            </TableRow>
          </Table>
        </div>
        <div className='col-span-12 w-full border border-black'>
          <Table className='bill-table w-full'>
            <TableRow>
              <TableCell
                colSpan={8}
                className='border border-black'
              >
                E & O.E
              </TableCell>
              <TableCell
                colSpan={4}
                className='border border-black text-left font-bold italic'
              >
                Balance Advance at Credit, if any
              </TableCell>
              <TableCell className='border border-black text-right'></TableCell>
            </TableRow>
          </Table>
        </div>
      </div>
    </>
  )
}
