import '../../../css/bill.css'

import BillArrears from '@/components/Billing/Bill/BillArrears'
import BillInvoice from '@/components/Billing/Bill/BillInvoice'
import BillReadingDetails from '@/components/Billing/Bill/BillReadingDetails'
import BillSummary from '@/components/Billing/Bill/BillSummary'
import {
  BillMeterReading,
  ChargeHeads,
  ComputedProperties,
  ComputedProperty,
  MeterWithMf,
  OtherChargeItem,
  TotalDemandCharge,
  TotalEnergyCharge,
} from '@/interfaces/bill_pdf_interfaces'
import { Bill, Connection } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'

interface BillShowPageProps {
  bill: Bill
  meter: MeterWithMf
  connection: Connection
  kwhValues: BillMeterReading[]
  kvahValues: BillMeterReading[]
  kvaValues: BillMeterReading[]
  lagValues: BillMeterReading[]
  leadValues: BillMeterReading[]
  chargeHeads: ChargeHeads
  computedProperties: ComputedProperties
  totalDemandCharge: TotalDemandCharge
  totalEnergyCharge: TotalEnergyCharge
  averageAndTotalKva: { totalKva: number; averageKva: number }
  averageAndTotalKwh: { averageKwh: number; totalKwh: number }
  selfGenerationkwhValues: BillMeterReading[]
  timeZones: ComputedProperty
  otherCharges: OtherChargeItem[]
}

export default function BillShowPage({
  bill,
  meter,
  connection,
  kwhValues,
  kvahValues,
  kvaValues,
  lagValues,
  leadValues,
  chargeHeads,
  computedProperties,
  totalDemandCharge,
  totalEnergyCharge,
  selfGenerationkwhValues,
  timeZones,
  otherCharges,
}: BillShowPageProps) {
  const mf = meter?.meter_mf ?? 1

  console.log('kwhValues', kwhValues)

  return (
    <div className='page bill-root bill-page w-full'>
      <div className='flex items-center justify-end'>
        {' '}
        <Button
          onClick={() => {
            window.open(`/pdf-download/${bill?.bill_id}`)
          }}
          label='Download'
        />
      </div>
      <table className='no-border'>
        <tr>
          <td className='center text-2xl'>KERALA STATE ELECTRICITY BOARD LIMITED</td>
        </tr>
        <tr>
          <td className='center text-sm'>
            Office of the Special Officer (Revenue), Pattom, Thiruvananthapuram
          </td>
        </tr>
        <tr>
          <td className='center text-lg font-bold'>
            DEMAND CUM DISCONNECTION NOTICE FOR NOVEMBER 2025
          </td>
        </tr>
        <tr>
          <td className='center text-sm'>
            (As per CHAPTER VII OF KERALA ELECTRICITY SUPPLY CODE –2014)
          </td>
        </tr>
      </table>

      {/* Main Bill Container - Like Original PDF */}
      <div className='mt-2'>
        <BillSummary
          bill={bill}
          connection={connection}
          tariff={computedProperties?.tariff}
        />
        <BillArrears
          bill={bill}
          connection={connection}
          kvaValues={kvaValues}
          kwhValues={kwhValues}
          mf={mf}
          computedProperties={computedProperties}
        />
        <BillReadingDetails
          bill={bill}
          meter={meter}
          kwhValues={kwhValues}
          kvahValues={kvahValues}
          kvaValues={kvaValues}
          lagValues={lagValues}
          leadValues={leadValues}
          computedProperties={computedProperties}
          selfGenerationkwhValues={selfGenerationkwhValues}
          timeZones={timeZones}
        />

        {/* Final Charges */}
        <BillInvoice
          chargeHeads={chargeHeads}
          totalDemandChargeRows={totalDemandCharge}
          totalEnergyChargeRows={totalEnergyCharge}
          bill={bill}
          computedProperties={computedProperties}
          kwhValues={kwhValues}
          selfGenerationkwhValues={selfGenerationkwhValues}
          otherCharges={otherCharges}
        />
      </div>

      {/* Footer Outside Border */}
      <div className='border border-black text-xs'>
        <div className='border border-black'>
          <p className=''>
            1. As per Regulation 130 of Kerala Electricity Supply Code 2014 any complaint regarding
            accuracy of a bill shall be first taken up with the officer designated to issue the bill
            (Special Officer(Revenue)). For Enquiry, please contact: 0471 2514323, 2514262.
          </p>
        </div>
        <div className='border border-black'>
          <p className=''>
            2. The connection will be disconnected without further notice, if the amount is not
            remitted on or before the DC date above.
          </p>
        </div>
      </div>
    </div>
  )
}
