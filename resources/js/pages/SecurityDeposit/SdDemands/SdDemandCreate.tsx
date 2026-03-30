import { consumerNavItems } from '@/components/Navbar/navitems'
import SdDemandForm from '@/components/SecurityDeposit/SdDemands/SdDemandForm'
import { ChargeHeadDefinition, Connection, SdDemand } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'

interface Props {
  demandTypes: ParameterValues[]
  calculationBasics: ParameterValues[]
  connection?: Connection
  sdDemand?: SdDemand
  sdRegisterTypes: ParameterValues[]
  occupancyTypes: ParameterValues[]
  chargeHeadDefinitions: ChargeHeadDefinition[]
}

export default function SdDemandCreate({
  demandTypes,
  calculationBasics,
  connection,
  sdDemand,
  sdRegisterTypes,
  occupancyTypes,
  chargeHeadDefinitions,
}: Readonly<Props>) {
  const connectionData = connection ?? sdDemand?.connection

  if (!connectionData) {
    throw new Error('Connection data not found')
  }

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: connectionData?.consumer_number,
      href: `/connections/${connectionData?.connection_id}`,
    },
    {
      title: 'Security Deposit Demands',
      href: `/connection/${connectionData?.connection_id}/sd-demands`,
    },
    {
      title: sdDemand ? 'Edit SD Demand' : 'Add SD Demand',
      href: '#',
    },
  ]
  return (
    <ConnectionsLayout
      connection={connectionData}
      connectionId={connectionData?.connection_id ?? 0}
      value={'connection'}
      subTabValue='sd-demands'
      heading='SD Demands'
      description={
        sdDemand ? (
          <>
            Edit SD Demand for consumer number {'   '}
            <span className='font-bold'>{connectionData?.consumer_number}</span>
          </>
        ) : (
          <>
            Create SD Demands for consumer number {'   '}
            <span className='font-bold'>{connectionData?.consumer_number}</span>
          </>
        )
      }
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-6'>
        <SdDemandForm
          demandTypes={demandTypes}
          calculationBasics={calculationBasics}
          connection={connectionData}
          sdDemand={sdDemand}
          sdRegisterTypes={sdRegisterTypes}
          occupancyTypes={occupancyTypes}
          chargeHeadDefinitions={chargeHeadDefinitions}
        />
      </div>
    </ConnectionsLayout>
  )
}
