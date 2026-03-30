import { consumerNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import { Connection, MeterReading } from '@/interfaces/data_interfaces'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import { router } from '@inertiajs/react'
import { Cpu } from 'lucide-react'

import MeterReadingCard from '@/components/Meter/MeterReading/MeterReadingCard'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'
import AddButton from '@/ui/button/AddButton'

interface ConnectionMeterReadingPageProps {
  connection: Connection
  meterReadings: Paginator<MeterReading>
}

export default function ConnectionMeterReadingPage({
  connection,
  meterReadings,
}: Readonly<ConnectionMeterReadingPageProps>) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    { title: 'Connections', href: route('connections.index') },
    {
      title: connection?.consumer_number.toString() ?? '',
      href: connection == null ? '' : route('connections.show', connection?.connection_id),
    },
    {
      title: 'Meter Reading',
      href: '#',
    },
  ]

  const handleAddMeterReading = () => {
    router.visit(route('connection-meter-reading.create', { id: connection?.connection_id }))
  }

  return (
    <ConnectionsLayout
      connection={connection}
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
      connectionId={connection?.connection_id}
      heading='Connection Details'
      description={
        <>
          Meter Reading Details for Consumer Number {'  '}
          <span className='font-bold'>{connection?.consumer_number}</span>
        </>
      }
      value='meter-reading'
      subTabValue='reading'
    >
      <Card className='relative w-full rounded-lg bg-white'>
        <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
          <StrongText className='text-lg font-semibold text-gray-900'>
            Meter Reading Information
          </StrongText>
          <AddButton
            onClick={handleAddMeterReading}
            buttonText='Add Meter Reading'
          />
        </div>
        <div className='flex flex-col gap-6 px-6 pb-6'>
          <div>
            {meterReadings?.data && meterReadings.data.length > 0 ? (
              meterReadings?.data.map((meterReading) => (
                <MeterReadingCard
                  meterReading={meterReading}
                  meters={connection?.meter_mappings ?? []}
                  key={meterReading.id}
                />
              ))
            ) : (
              <div className='p-8 text-center text-slate-500'>
                <div className='flex flex-col items-center gap-2'>
                  <Cpu className='h-12 w-12 text-slate-300' />
                  <p className='text-lg font-medium'>No meter readings found</p>
                  <p className='text-sm'>No kWh readings available for this connection.</p>
                </div>
              </div>
            )}
          </div>
          {meterReadings?.data && meterReadings?.data?.length > 0 && (
            <Pagination pagination={meterReadings} />
          )}
        </div>
      </Card>
    </ConnectionsLayout>
  )
}
