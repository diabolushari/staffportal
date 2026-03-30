import SdCollectionForm from '../SdCollections/SdCollectionForm'
import AssessmentSummaryCard from './AssessmentSummaryCard'
import { SdBalanceSummary, SdDemand, SdRegister } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { Connection } from '@/interfaces/data_interfaces'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RefundDetailCard from './RefundDetailCard'

interface Props {
  sdDemand: SdDemand
  paymentModes: ParameterValues[]
  collectionStatus: ParameterValues[]
  connection: Connection
  sdRegister: SdRegister[]
  balanceSummary: SdBalanceSummary
}

const RefundSection = ({
  sdDemand,
  paymentModes,
  collectionStatus,
  connection,
  sdRegister,
  balanceSummary,
}: Props) => {
  return (
    <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-2'>
      <AssessmentSummaryCard
        balanceSummary={balanceSummary}
        sdRegister={sdRegister[0]}
        isRefundCard={true}
      />

      <Tabs defaultValue='details'>
        <TabsList>
          <TabsTrigger
            value='details'
            className='text-kseb-primary'
          >
            Refund Details
          </TabsTrigger>
          <TabsTrigger
            value='initiate'
            className='text-kseb-primary'
          >
            Initiate Refund
          </TabsTrigger>
        </TabsList>

        <TabsContent value='details'>
          <RefundDetailCard
            sdRegister={sdRegister}
            balanceSummary={balanceSummary}
          />
        </TabsContent>

        <TabsContent value='initiate'>
          <SdCollectionForm
            sdDemand={sdDemand}
            paymentModes={paymentModes}
            collectionStatus={collectionStatus}
            connection={connection}
            sdRegister={sdRegister[0]}
            isRefund={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RefundSection
