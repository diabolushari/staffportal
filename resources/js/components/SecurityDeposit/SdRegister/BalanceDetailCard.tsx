import { Card } from '@/components/ui/card'
import { SdBalanceSummary, SdRegister } from '@/interfaces/data_interfaces'
import { getDisplayDate } from '@/utils'
import { Wallet, ShieldCheck } from 'lucide-react'

interface Props {
  sdRegister?: SdRegister[]
  balanceSummary: SdBalanceSummary
}

const BalanceDetailCard = ({ sdRegister, balanceSummary }: Props) => {
  const collections = sdRegister?.flatMap((item) => item.sd_demand?.collections ?? []) ?? []

  const sortedCollections = [...collections].sort(
    (a, b) => new Date(b.collection_date).getTime() - new Date(a.collection_date).getTime()
  )

  const bankGuaranteeCollection =
    sortedCollections?.find((c) => c.payment_mode?.parameter_value === 'BANK_GUARANTEE') ?? null

  const bankGuaranteeExpiryDate = bankGuaranteeCollection?.sd_attributes?.find(
    (attr) => attr.attribute_definition.parameter_value.toLowerCase() === 'bg_expiry_date'
  )?.attribute_value

  console.log(balanceSummary)

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      {/* Available Balance */}
      <Card className='flex items-start gap-4 rounded-xl p-6'>
        <div className='rounded-md bg-gray-100 p-2'>
          <Wallet className='text-kseb-primary-600 h-5 w-5' />
        </div>

        <div>
          <p className='mb-1 text-sm text-gray-500'>Available Balance</p>
          <p className='text-kseb-primary-600 text-2xl font-semibold'>
            ₹{balanceSummary.sd_principal_on_file}
          </p>
        </div>
      </Card>

      {/* Bank Guarantee */}
      <Card className='flex items-start gap-4 rounded-xl p-6'>
        <div className='rounded-md bg-gray-100 p-2'>
          <ShieldCheck className='text-kseb-primary-600 h-5 w-5' />
        </div>

        <div>
          <p className='mb-1 text-sm text-gray-500'>Bank Guarantee</p>
          <p className='text-2xl font-semibold text-gray-800'>
            ₹{bankGuaranteeCollection?.collection_amount}
          </p>
          <p className='mt-1 text-xs text-gray-400'>
            Exp: {bankGuaranteeExpiryDate ? getDisplayDate(bankGuaranteeExpiryDate) : '--'}
          </p>
        </div>
      </Card>
    </div>
  )
}

export default BalanceDetailCard
