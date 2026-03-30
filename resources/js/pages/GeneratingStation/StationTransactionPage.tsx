import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { GeneratingStation } from '@/interfaces/data_interfaces'
import SingleTabGroup from '@/components/ui/single-tab'
import StationTransactionList from '@/components/GeneratingStation/StationTransactionList'
import { ParameterValues } from '@/interfaces/parameter_types'

interface Props {
  transactions: any[]
  stationId: number
  station: GeneratingStation
  filters: StationTransactionFilters
  transactionTypes: ParameterValues[]
}
interface StationTransactionFilters {
  transaction_type_id?: string
  consumer_number?: string
  date_from?: string
  date_to?: string
}

export default function StationTransactionPage({
  transactions,
  stationId,
  station,
  filters,
  transactionTypes,
}: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Generating Stations', href: '/generating-stations' },
    { title: 'Transactions', href: '#' },
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
      title='Transaction Summary'
    >
      <SingleTabGroup
        tabs={tabs}
        defaultValue='transaction'
      />

      <StationTransactionList
        transactions={transactions}
        filters={filters}
        transactionTypes={transactionTypes}
        stationId={stationId}
      />
    </MainLayout>
  )
}
