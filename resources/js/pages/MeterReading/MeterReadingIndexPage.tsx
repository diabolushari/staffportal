import { meterReadingNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import ListSearch from '@/ui/Search/ListSearch'
import MeterReadingConnectionsList from '@/components/Meter/MeterReading/MeterReadingConnectionsList'
import { MeterReading } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'

interface Props {
  connections: any
  meterReadings: Paginator<MeterReading>
  filter: {
    consumerNumber: string
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Meter Reading',
    href: '/meter-reading',
  },
]

export default function MeterReadingIndexPage({
  connections,
  meterReadings,
  filter,
}: Readonly<Props>) {
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meterReadingNavItems}
    >
      <ListSearch
        title='Connections Search'
        placeholder='Enter consumer number'
        url={route('connections.index')}
        search={filter.consumerNumber}
      />
      <div>
        {connections && <MeterReadingConnectionsList connections={connections} />}
        {meterReadings && (
          <>
            <MeterReadingConnectionsList connections={meterReadings.data} />
            <Pagination pagination={meterReadings} />
          </>
        )}
      </div>

      {/* <div className="flex flex-col gap-4">
      {meterReadings && (
        <>
          <MeterReadingConnectionsList connections={meterReadings.data} />
          <Pagination pagination={meterReadings} /> 
        </>
      )}
    </div> */}
    </MainLayout>
  )
}
