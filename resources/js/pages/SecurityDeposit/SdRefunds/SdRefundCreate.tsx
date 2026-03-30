import RefundSection from '@/components/SecurityDeposit/SdRefunds/RefundSection'
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

export default function SdRefundCreate({
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
      sheetTitle={'Manage Refunds'}
      sheetAction={setSheetOpen}
      sheetOpen={sheetOpen}
      sheetContent={
        <>
          <RefundSection
            sdDemand={sdDemand}
            paymentModes={paymentModes}
            collectionStatus={collectionStatus}
            connection={connection}
            sdRegister={sdRegister}
            balanceSummary={balanceSummary}
          />
        </>
      }
      highlightedAction={'refund'}
    />
  )
}
