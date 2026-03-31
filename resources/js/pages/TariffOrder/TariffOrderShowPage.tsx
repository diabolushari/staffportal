import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { TariffConfig, TariffOrder } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { Paginator } from '@/ui/ui_interfaces'
import Field from '@/components/ui/field'
import TariffConfigTable from '@/components/Tariff/TariffConfig/TariffConfigTable'
import { ParameterValues } from '@/interfaces/parameter_types'
import ShowPageCard from '@/ui/Card/ShowPageCard'
import { getDisplayDate } from '@/utils'

interface Props {
  tariff_order: TariffOrder
  tariff_configs: Paginator<TariffConfig>
  connection_tariffs: ParameterValues[]
  oldConnectionTariffId: number
}

export default function TariffOrderShowPage({
  tariff_order,
  tariff_configs,
  connection_tariffs,
  oldConnectionTariffId,
}: Props) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Settings',
      href: '/settings-page',
    },
    {
      title: 'Tariff Order',
      href: '/tariff-orders',
    },
    {
      title: tariff_order.order_descriptor,
      href: `/tariff-orders/${tariff_order?.tariff_order_id}`,
    },
  ]

  return (
    <MainLayout
      leftBarTitle='Tariff Management'
      navItems={meteringBillingNavItems}
      selectedItem='Tariffs'
      breadcrumb={breadcrumb}
      title={tariff_order?.order_descriptor}
      description={
        <>
          Tariff Order details for{'  '}
          <span className='font-bold'>{tariff_order?.order_descriptor}</span>
        </>
      }
    >
      {/* ---- Tariff Order Card ---- */}
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        <ShowPageCard
          title='Basic Information'
          // editUrl={`/tariff-orders/${tariff_order?.tariff_order_id}/edit`}
        >
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Field
              label='Published Date'
              value={getDisplayDate(tariff_order?.published_date)}
            />

            <Field
              label='Effective Start'
              value={getDisplayDate(tariff_order?.effective_start)}
            />

            <Field
              label='Effective End'
              value={getDisplayDate(tariff_order?.effective_end)}
            />

            <div>
              <Field
                label='Reference Document'
                value={tariff_order?.reference_document}
              />
              <a
                href={`/api/tariff-order/${tariff_order?.tariff_order_id}/download`}
                target='_blank'
                className='text-blue-600 underline'
              >
                View PDF
              </a>
            </div>
          </div>
        </ShowPageCard>

        {/* ---- Tariff Config Table ---- */}
        <TariffConfigTable
          tariff_configs={tariff_configs}
          tariffOrder={tariff_order}
          connectionTariffs={connection_tariffs}
          oldConnectionTariffId={oldConnectionTariffId}
        />
      </div>
    </MainLayout>
  )
}
