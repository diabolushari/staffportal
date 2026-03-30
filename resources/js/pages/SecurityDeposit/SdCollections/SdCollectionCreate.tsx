import SdCollectionForm from '@/components/SecurityDeposit/SdCollections/SdCollectionForm'
import AssessmentSummaryCard from '@/components/SecurityDeposit/SdRefunds/AssessmentSummaryCard'
import SdRegisterDetailView from '@/components/SecurityDeposit/SdRegister/SdRegisterDetailView'
import {
  ChargeHeadDefinition,
  Connection,
  SdBalanceSummary,
  SdDemand,
  SdRegister,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { useState } from 'react'

interface Props {
  sdDemand: SdDemand
  paymentModes: ParameterValues[]
  collectionStatus: ParameterValues[]
  connection: Connection
  sdRegister: SdRegister[]
  balanceSummary: SdBalanceSummary
  occupancyTypes: ParameterValues[]
  sdTypes: ChargeHeadDefinition[]
  page?: number
  pageSize?: number
}
//TODO need to show demand details in this page, currently only showing consumer number in heading, can show more details in description or in a separate section
export default function SdCollectionCreate({
  sdDemand,
  paymentModes,
  collectionStatus,
  connection,
  sdRegister,
  balanceSummary,
  occupancyTypes,
  sdTypes,
  page,
  pageSize,
}: Readonly<Props>) {
  const [sheetOpen, setSheetOpen] = useState<boolean>(true)
  return (
    <SdRegisterDetailView
      sdRegister={sdRegister}
      connection={connection}
      balanceSummary={balanceSummary}
      occupancyTypes={occupancyTypes}
      sdTypes={sdTypes}
      page={page}
      pageSize={pageSize}
      sheetTitle={'Register Collection'}
      sheetAction={setSheetOpen}
      sheetOpen={sheetOpen}
      sheetContent={
        <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-2'>
          <AssessmentSummaryCard
            balanceSummary={balanceSummary}
            sdRegister={sdRegister[0]}
            isCollectionCard={true}
          />
          <SdCollectionForm
            sdDemand={sdDemand}
            paymentModes={paymentModes}
            collectionStatus={collectionStatus}
            connection={connection}
            sdRegister={sdRegister[0]}
          />
        </div>
      }
      highlightedAction={'collection'}
    />
  )
}
