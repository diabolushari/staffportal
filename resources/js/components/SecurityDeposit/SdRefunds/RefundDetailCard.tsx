import { Card } from '@/components/ui/card'
import { SdBalanceSummary, SdRegister } from '@/interfaces/data_interfaces'
import { getDisplayDate } from '@/utils'

interface Props {
  sdRegister: SdRegister[]
  balanceSummary: SdBalanceSummary
}

const RefundDetailCard = ({ sdRegister, balanceSummary }: Props) => {
  const latestRefundedCollections = sdRegister[0].sd_demand?.collections?.filter(
    (item) => item.payment_mode.parameter_value.toLowerCase() === 'refund'
  )
  const diffAmount =
    Number(balanceSummary.sd_principal_on_file) - Number(sdRegister[0].sd_demand?.total_sd_amount)

  const refund = diffAmount > 0 ? diffAmount : 0
  console.log(sdRegister[0].sd_demand?.collections)
  return (
    <div className='space-y-4'>
      <h2 className='mb-2 text-sm font-semibold tracking-wide text-gray-500'>REFUND DETAILS</h2>

      <div className='overflow-hidden rounded-lg border'>
        {latestRefundedCollections && latestRefundedCollections.length > 0 ? (
          <>
            <div className='grid grid-cols-[1.3fr_1.5fr_1fr_1fr] bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500'>
              <span>DATE</span>
              <span>REFERENCE#</span>
              <span>TYPE</span>
              <span className='text-right'>AMOUNT (₹)</span>
            </div>
            {latestRefundedCollections.map((item) => (
              <div className='grid grid-cols-[1.3fr_1.5fr_1fr_1fr] border-t px-4 py-3 text-sm'>
                <span className='break-words text-gray-600'>
                  {getDisplayDate(item.collection_date)}
                </span>
                <span className='break-words text-gray-600'>{item.transaction_ref}</span>
                <span className='whitespace-nowrap text-gray-600'>
                  {item.payment_mode.parameter_value}
                </span>
                <span className='text-right font-medium whitespace-nowrap text-gray-800'>
                  {item.collection_amount}
                </span>
              </div>
            ))}
          </>
        ) : (
          <div className='flex items-center justify-center border-t bg-gray-100 px-4 py-3'>
            <span className='text-sm text-gray-600'>No Refunded Collections</span>
          </div>
        )}

        {/* Footer */}
        <div className='flex items-center justify-between border-t bg-gray-100 px-4 py-3'>
          <span className='text-sm font-semibold text-gray-600'>TOTALADJUSTED</span>
          <span className='text-kseb-primary text-lg font-bold'>00.00</span>
        </div>
      </div>

      {/* Remaining Balance */}
      <Card className='flex items-center justify-between rounded-xl border bg-gray-50 px-4 py-4'>
        <span className='text-sm font-medium text-gray-700'>Remaining Balance to be Refunded</span>
        <span className='text-center text-lg font-bold whitespace-nowrap text-orange-500'>
          ₹ {refund}
        </span>
      </Card>
    </div>
  )
}

export default RefundDetailCard
