import ConsumerFormComponent from '@/components/Consumer/ConsumerFormComponent'
import { Connection, ConsumerData, RegionOption } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { BreadcrumbItem } from '@/types'
import { useMemo } from 'react'
import { consumerNavItems } from '@/components/Navbar/navitems'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'

interface Props {
  consumerTypes: ParameterValues[]
  consumerOwnershipTypes: ParameterValues[]
  connectionId: number
  consumer?: ConsumerData
  districts: RegionOption[]
  states: RegionOption[]
  connection: Connection | null
  indicators: ParameterValues[]
  departments: ParameterValues[]
}

export default function ConsumerForm({
  consumerTypes,
  consumerOwnershipTypes,
  districts,
  states,
  connectionId,
  consumer,
  connection,
  indicators,
  departments,
}: Readonly<Props>) {
  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [
      {
        title: 'Home',
        href: '/',
      },
      { title: 'Connections', href: '/connections' },
    ]

    if (connection && connectionId) {
      items.push(
        {
          title: connection.consumer_number.toString(),
          href: route('connections.show', connectionId),
        },
        {
          title: 'Consumer Details',
          href: route('connection.consumer', connectionId),
        }
      )
    }

    return items
  }, [connection, connectionId])
  console.log(consumerOwnershipTypes)

  return (
    <ConnectionsLayout
      connection={connection}
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
      connectionId={connectionId}
      heading='Consumer Details'
      description={
        <>
          Consumer details for consumer number {'   '}
          <span className='font-bold'>{connection?.consumer_number}</span>
        </>
      }
      value='connection'
      subTabValue='consumer'
    >
      <ConsumerFormComponent
        consumer_types={consumerTypes}
        consumer_ownership_types={consumerOwnershipTypes}
        districts={districts}
        states={states}
        connection_id={connectionId}
        data={consumer}
        indicators={indicators}
        departments={departments}
      />
    </ConnectionsLayout>
  )
}
