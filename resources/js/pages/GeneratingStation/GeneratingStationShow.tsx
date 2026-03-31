import { Card } from '@/components/ui/card'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Field from '@/components/ui/field'
import StrongText from '@/typography/StrongText'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { getDisplayDate } from '@/utils'
import { GeneratingStation } from '@/interfaces/data_interfaces'
import SingleTabGroup from '@/components/ui/single-tab'

interface Props {
  station: GeneratingStation
}

export default function GeneratingStationShowPage({ station }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Generating Stations', href: '/generating-stations' },
    { title: station?.station_name, href: '#' },
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
      title='Generating Station Details'
    >
      <SingleTabGroup
        tabs={tabs}
        defaultValue='station'
      />
      <Card className='rounded-lg p-7'>
        <StrongText className='mb-6 block text-base font-semibold'>General Information</StrongText>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Field
            label='Station Name'
            value={station?.station_name ?? '-'}
          />

          <Field
            label='Consumer Number'
            value={station?.connection?.consumer_number ?? '-'}
          />

          <Field
            label='Generation Type'
            value={station?.generation_type?.parameter_value ?? '-'}
          />

          <Field
            label='Plant Type'
            value={station?.plant_type?.parameter_value ?? '-'}
          />
          {station?.attributes?.length > 0 &&
            station?.attributes?.map((attr: any, index: number) => (
              <Field
                key={index}
                label={attr.attribute_definition?.parameter_value ?? '-'}
                value={attr.attribute_value ?? '-'}
              />
            ))}
        </div>
      </Card>
      <Card className='rounded-lg p-7'>
        <StrongText className='mb-6 block text-base font-semibold'>Plant Properties</StrongText>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Field
            label='Installed Capacity'
            value={`${station?.installed_capacity ?? '-'}`}
          />

          <Field
            label='Voltage Category'
            value={station?.voltage_category?.parameter_value ?? '-'}
          />

          <Field
            label='Commissioning Date'
            value={getDisplayDate(station.commissioning_date) ?? '-'}
          />

          <Field
            label='Generation Status'
            value={station?.generation_status?.parameter_value ?? '-'}
          />
        </div>
      </Card>

      <Card className='mt-4 rounded-lg p-7'>
        <StrongText className='mb-6 block text-base font-semibold'>Station Address</StrongText>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Field
            label='Address Line 1'
            value={station?.address?.address_line1 ?? '-'}
          />
          <Field
            label='Address Line 2'
            value={station?.address?.address_line2 ?? '-'}
          />
          <Field
            label='Village'
            value={station?.address?.city_town_village ?? '-'}
          />
          <Field
            label='District'
            value={station?.address?.district?.name ?? '-'}
          />
        </div>
      </Card>
    </MainLayout>
  )
}
