import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import TariffConfigForm from '@/components/Tariff/TariffConfigForm'
import Field from '@/components/ui/field'
import { TariffConfig, TariffOrder } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import CustomCard from '@/ui/Card/CustomCard'

const dateToString = (date: string | null) => {
  return date ? date.split('T')[0] : ''
}

interface Props {
  tariff_config?: TariffConfig
  tariff_order?: TariffOrder
  connection_purpose?: ParameterValues[]
  connection_tariffs: ParameterValues[]
}

export default function TariffConfigCreatePage({ tariff_order, connection_tariffs }: Props) {
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
      title: tariff_order?.order_descriptor ?? 'Tariff Order',
      href: `/tariff-orders/${tariff_order?.tariff_order_id}`,
    },
    {
      title: 'Create Tariff Config',
      href: '/tariff-configs/create',
    },
  ]
  return (
    <MainLayout
      navItems={meteringBillingNavItems}
      selectedItem='Tariffs'
      breadcrumb={breadcrumb}
      leftBarTitle='Tariff Management'
    >
      <CustomCard
        title='Add Tariff Rule'
        className='p-4'
      >
        <div className='mb-6 flex items-center justify-between'>
          <StrongText className='text-base font-semibold text-[#252c32]'>
            Tariff Order Details
          </StrongText>
        </div>
        <div className='grid gap-4 md:grid-cols-2'>
          <Field
            label='Tariff Order'
            value={tariff_order?.order_descriptor}
          />
          <Field
            label='Reference Document'
            value={tariff_order?.reference_document}
            link={`/api/tariff-order/${tariff_order?.tariff_order_id}/download`}
          />
          <Field
            label='Effective Start'
            value={dateToString(tariff_order?.effective_start ?? null)}
          />
          <Field
            label='Effective End'
            value={dateToString(tariff_order?.effective_end ?? null)}
          />
        </div>
      </CustomCard>
      {tariff_order && (
        <TariffConfigForm
          tariffOrder={tariff_order}
          connectionTariffs={connection_tariffs ?? []}
        />
      )}
    </MainLayout>
  )
}
