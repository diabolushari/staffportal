import MeterReadingTable from '@/components/Meter/MeterReading/MeterReadingTable/MeterReadingTable'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import {
  Connection,
  Meter,
  MeterConnectionMapping,
  MeterHealth,
  MeterReading,
  MeterReadingValue,
} from '@/interfaces/data_interfaces'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import { useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import dayjs from 'dayjs'

interface ReadingsByMeter {
  meterId: number
  meter: Meter | null
  serial: string | undefined
  profile: string | undefined
  readings: MeterReadingValue[]
  meterPf: number | undefined
  meterMF: number | null | undefined
  health: MeterHealth
}

interface Props {
  meterReading: MeterReading
  connectionId: number
  connection: Connection
  meterConnectionMapping: MeterConnectionMapping[]
}

export default function MeterReadingShowPage({
  meterReading,
  connectionId,
  connection,
  meterConnectionMapping,
}: Readonly<Props>) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    { title: 'Connections', href: `/connections/${Number(connectionId)}` },
    { title: connection?.consumer_number, href: `/connections/${Number(connectionId)}` },
    { title: 'Meter Reading', href: `/connection/${Number(connectionId)}/meter-reading` },
    {
      title: 'Show',
      href: `/connection/${Number(connectionId)}/meter-reading/${meterReading.id}`,
    },
  ]

  const readingsByMeter = useMemo(() => {
    const result: {
      [meterId: number]: ReadingsByMeter
    } = {}

    meterReading.values?.forEach((reading: MeterReadingValue) => {
      const meterId = reading.meter_id
      if (!result[meterId]) {
        result[meterId] = {
          meterId,
          meter: reading.meter ?? null,
          serial: reading.meter?.meter_serial,
          profile: meterConnectionMapping.find((mapping) => mapping.meter_id === meterId)
            ?.meter_profile?.parameter_value,
          readings: [] as MeterReadingValue[],
          meterPf: meterReading.power_factors?.filter((pf) => pf.meter_id === meterId)[0]
            ?.average_power_factor,
          meterMF: meterConnectionMapping.find((mapping) => mapping.meter_id === meterId)?.meter_mf,
          health: meterReading.healths?.filter((health) => health.meter_id === meterId)[0],
        }
      }
      result[meterId].readings.push(reading)
    })
    return Object.values(result)
  }, [meterReading, meterConnectionMapping])

  console.log(meterReading, meterConnectionMapping)
  return (
    <ConnectionsLayout
      connection={connection}
      breadcrumbs={breadcrumb}
      connectionsNavItems={consumerNavItems}
      connectionId={connectionId}
      heading='Meter Reading'
      description='Meter Reading'
      value='meter-reading'
      subTabValue='reading'
    >
      <div className='flex flex-col gap-6'>
        <StrongText>Consumer Number: {connection.consumer_number}</StrongText>
        <h1 className='text-2xl font-bold'>Meter Reading</h1>
        <p className='text-sm text-gray-500'>
          Date: {dayjs(meterReading.metering_date).format('DD-MM-YYYY')} (From{' '}
          {dayjs(meterReading.reading_start_date).format('DD-MM-YYYY')} to{' '}
          {dayjs(meterReading.reading_end_date).format('DD-MM-YYYY')})
        </p>

        {readingsByMeter.map((meter) => (
          <div
            key={meter.meterId}
            className='flex flex-col gap-4 rounded-lg border p-4 shadow'
          >
            <h2 className='mb-2 text-xl font-bold'>
              Meter: {meter.serial} ({meter.profile})
            </h2>
            <h3 className='text-sm font-semibold'>MF: {meter?.meterMF ?? '-'}</h3>
            {meter?.meterPf && (
              <h3 className='text-sm font-semibold'>
                Meter Power Factor: {meter?.meterPf?.toFixed(2) ?? '-'}
              </h3>
            )}
            <Card>
              <div className='mb-4'>
                <h3 className='mb-2 text-lg font-semibold'>Phase Voltage & Current</h3>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead className='text-center'>R</TableHead>
                      <TableHead className='text-center'>Y</TableHead>
                      <TableHead className='text-center'>B</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <TableRow>
                      <TableCell className='font-medium'>Voltage (kV)</TableCell>
                      <TableCell className='text-center'>
                        {meter.health.voltage_r ? meter.health.voltage_r.toFixed(2) : '-'}
                      </TableCell>
                      <TableCell className='text-center'>
                        {meter.health.voltage_y ? meter.health.voltage_y.toFixed(2) : '-'}
                      </TableCell>
                      <TableCell className='text-center'>
                        {meter.health.voltage_b ? meter.health.voltage_b.toFixed(2) : '-'}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className='font-medium'>Current (A)</TableCell>
                      <TableCell className='text-center'>
                        {meter.health.current_r ? meter.health.current_r.toFixed(2) : '-'}
                      </TableCell>
                      <TableCell className='text-center'>
                        {meter.health.current_y ? meter.health.current_y.toFixed(2) : '-'}
                      </TableCell>
                      <TableCell className='text-center'>
                        {meter?.health?.current_b ? meter.health.current_b.toFixed(2) : '-'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
            <MeterReadingTable readings={meter.readings} />
          </div>
        ))}
      </div>
    </ConnectionsLayout>
  )
}
