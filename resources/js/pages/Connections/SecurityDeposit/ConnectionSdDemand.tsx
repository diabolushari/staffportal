import { consumerNavItems } from '@/components/Navbar/navitems'
import SdDemandList from '@/components/SecurityDeposit/SdDemands/SdDemandList'
import { Connection, SdBalanceSummary, SdDemand } from '@/interfaces/data_interfaces'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import AddButton from '@/ui/button/AddButton'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import { useMemo } from 'react'

interface Props {
  connection: Connection
  sdDemands: Paginator<SdDemand>
  balanceSummary: SdBalanceSummary
}

const ConnectionSdDemand = ({ connection, sdDemands, balanceSummary }: Props) => {
  const breadcrumbs = useMemo(
    () => [
      {
        title: 'Home',
        href: '/',
      },
      { title: 'Connections', href: '/connections' },
      {
        title: connection?.consumer_number?.toString(),
        href: '#',
      },
      {
        title: 'SD Demands',
        href: '#',
      },
    ],
    [connection]
  )
  return (
    <ConnectionsLayout
      connection={connection}
      connectionId={connection?.connection_id ?? 0}
      value={'connection'}
      subTabValue='sd-demands'
      heading='SD Demands'
      description={
        <>
          SD Demands for consumer number {'   '}
          <span className='font-bold'>{connection?.consumer_number}</span>
        </>
      }
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
    >
      {sdDemands.data.length === 0 && (
        <div className='flex justify-end p-5'>
          <AddButton
            onClick={() =>
              router.get(route('sd-demands.create', { connectionId: connection.connection_id }))
            }
            buttonText='Add SD Demand'
          />
        </div>
      )}
      <div>{sdDemands && <SdDemandList sdDemands={sdDemands.data} />}</div>
      <div>{sdDemands && <Pagination pagination={sdDemands} />}</div>
    </ConnectionsLayout>
  )
}

export default ConnectionSdDemand
