import ConnectionPartiesFormModal from '@/components/Connections/ConnectionPartiesFormModal'
import ConnectionPartiesList from '@/components/Connections/ConnectionPartiesList'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { Connection, ConnectionPartyMapping } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import AddButton from '@/ui/button/AddButton'
import { useMemo, useState } from 'react'

interface ConnectionPartiesProps {
  connection: Connection
  party_relation_types: ParameterValues[]
  connection_parties: ConnectionPartyMapping[]
}

export default function ConnectionParties({
  connection,
  party_relation_types,
  connection_parties,
}: ConnectionPartiesProps) {
  const [addPartiesModal, setAddPartiesModal] = useState(false)

  const breadcrumbs = useMemo(
    () => [
      {
        title: 'Home',
        href: '/',
      },
      { title: 'Connections', href: '/connections' },
      {
        title: connection?.consumer_number?.toString(),
        href: connection?.connection_id
          ? route('connections.show', connection?.connection_id)
          : '#',
      },
      {
        title: 'Parties',
        href: '#',
      },
    ],
    [connection]
  )

  return (
    <ConnectionsLayout
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
      connectionId={connection?.connection_id}
      connection={connection}
      value='connection'
      subTabValue='parties'
      heading='Connection Details'
      description={
        <>
          Connection Parties Details for {'  '}
          <span className='font-bold'>{connection?.consumer_number}</span>
        </>
      }
    >
      <div className='flex justify-between'>
        <div></div>
        <AddButton
          onClick={() => {
            setAddPartiesModal(true)
          }}
          buttonText='Add Party'
        />
      </div>
      <ConnectionPartiesList
        connectionParties={connection_parties}
        connection={connection}
        partyRelationTypes={party_relation_types}
      />
      {addPartiesModal && (
        <ConnectionPartiesFormModal
          connection={connection}
          setShowModal={setAddPartiesModal}
          partyRelationTypes={party_relation_types}
        />
      )}
    </ConnectionsLayout>
  )
}
