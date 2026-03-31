import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { consumerNavItems } from '@/components/Navbar/navitems'
import StationConsumerList from '@/components/GeneratingStation/StationConsumerList'
import { GeneratingStation, StationConsumerRel } from '@/interfaces/data_interfaces'
import SingleTabGroup from '@/components/ui/single-tab'
import { Value } from '@radix-ui/react-select'

interface Props {
  relations: StationConsumerRel[]
  stationId: number
  station: GeneratingStation
}

export default function StationConsumersPage({ relations, stationId, station }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Generating Stations', href: '/generating-stations' },
    { title: 'Consumers', href: '#' },
  ]

  const tabs = [
    {
      value: 'station',
      label: 'Station',
      icon: '',
      href: route('generating-stations.show', station?.station_id),
    },
    {
      value: 'consumer',
      label: 'Consumers',
      icon: '',
      href: route('generating-stations.consumers', station?.station_id),
    },
    {
      value: 'transaction',
      label: 'Transactions',
      icon: '',
      href: route('generating-stations.transactions', station?.station_id),
    },
  ]
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={consumerNavItems}
      selectedItem='Generating Stations'
      title='Station Consumers'
    >
      <SingleTabGroup
        tabs={tabs}
        defaultValue='consumer'
      />

      <StationConsumerList relations={relations} />
    </MainLayout>
  )
}
