import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { ComputedProperty } from '@/interfaces/bill_pdf_interfaces'
import { Bill, Connection } from '@/interfaces/data_interfaces'
import NormalText from '@/typography/NormalText'
import { getDisplayDate } from '@/utils'

export default function BillSummary({
  bill,
  connection,
  tariff,
}: {
  bill: Bill
  connection: Connection
  tariff?: ComputedProperty
}) {
  return (
    <Table className='bill-table'>
      <TableBody>
        <TableRow>
          <TableCell className=''>Cons#</TableCell>
          <TableCell className=''>{connection?.consumer_number ?? '-'}</TableCell>
          <TableCell className=''>Bill Date</TableCell>
          <TableCell className='font-semibold'>{getDisplayDate(bill?.bill_date) ?? '-'}</TableCell>
          <TableCell className=''>Due Date</TableCell>
          <TableCell className='font-semibold'>{getDisplayDate(bill?.due_date) ?? '-'}</TableCell>
          <TableCell className=''>DC Date</TableCell>
          <TableCell className='font-semibold'>{getDisplayDate(bill?.dc_date) ?? '-'}</TableCell>
          <TableCell className=''>Bill.No</TableCell>
          <TableCell
            colSpan={2}
            className=''
          >
            {bill?.bill_number ?? '-'}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className=''>LCN</TableCell>
          <TableCell className=''>{connection?.consumer_legacy_code ?? '-'}</TableCell>
          <TableCell className=''>Tariff</TableCell>
          <TableCell
            colSpan={4}
            className=''
          >
            {tariff?.result ?? connection?.tariff?.parameter_value ?? '-'}
          </TableCell>
          <TableCell className=''>CD</TableCell>
          <TableCell className=''> 0.00</TableCell>
          <TableCell className=''>BG</TableCell>
          <TableCell className=''>0</TableCell>
        </TableRow>
        {/* Address + Virtual Account + GSTIN */}
        <TableRow>
          {/* LEFT: Address (3 rows high) */}
          <TableCell
            rowSpan={4}
            colSpan={5}
            className='bill-table td'
          >
            {connection?.consumer_profiles?.[0]?.organization_name ?? '-'} <br />
            {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address
              ?.address_line1 ?? '-'}
            {', '}
            {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address
              ?.address_line2 ?? '-'}
            <br />
            {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address
              ?.city_town_village ?? '-'}
            {', '}
            {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address?.district
              ?.name ?? '-'}
            <br />
            {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address?.state
              ?.name ?? '-'}
            {' - '}
            {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.billing_address?.pincode ??
              '-'}
            <br />
            {connection?.consumer_profiles?.[0]?.contact_person ?? '-'}
            {' , '}
            Phone: {connection?.consumer_profiles?.[0]?.contact_details?.[0]?.primary_phone ?? '-'}
          </TableCell>

          {/* RIGHT: Virtual Account */}
          <TableCell
            colSpan={6}
            rowSpan={1}
          >
            <NormalText>SBI Virtual A/c No(IFS Code:SBIN0070493):</NormalText>{' '}
            {connection?.consumer_profiles?.[0]?.virtual_account_number ?? '-'}
          </TableCell>
        </TableRow>

        <TableRow>
          {/* RIGHT: Consumer GSTIN */}
          <TableCell
            colSpan={6}
            rowSpan={4}
          >
            <NormalText>Consumer GSTIN:</NormalText>{' '}
            {connection?.consumer_profiles?.[0]?.consumer_gstin ?? '-'}
          </TableCell>
        </TableRow>

        <TableRow></TableRow>
      </TableBody>
    </Table>
  )
}
