import SdRegisterDetailView from '@/components/SecurityDeposit/SdRegister/SdRegisterDetailView'
import {
  ChargeHeadDefinition,
  Connection,
  SdBalanceSummary,
  SdRegister,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'

interface Props {
  sdRegister?: SdRegister[]
  connection: Connection
  balanceSummary: SdBalanceSummary
  occupancyTypes: ParameterValues[]
  sdTypes: ChargeHeadDefinition[]
  page?: number
  pageSize?: number
}

const SdRegisterShow = ({
  sdRegister,
  connection,
  balanceSummary,
  occupancyTypes,
  sdTypes,
  page,
  pageSize,
}: Props) => {
  return (
    <SdRegisterDetailView
      sdRegister={sdRegister}
      connection={connection}
      balanceSummary={balanceSummary}
      occupancyTypes={occupancyTypes}
      sdTypes={sdTypes}
      page={page}
      pageSize={pageSize}
    />
  )
}

export default SdRegisterShow
