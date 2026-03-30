import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import TariffConfigEditForm from '@/components/Tariff/TariffConfig/TariffConfigEditForm'
import { TariffConfig, TariffOrder } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'

interface Props {
  tariff_config: TariffConfig
  tariff_orders: TariffOrder[]
  consumption_tariffs: ParameterValues[]
  connection_purposes: ParameterValues[]
}

export default function TariffConfigEditPage({
  tariff_config,
  tariff_orders,
  consumption_tariffs,
  connection_purposes,
}: Props) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Settings',
      href: '/settings-page',
    },
    {
      title: 'Tariff Order',
      href: route('tariff-orders.index'),
    },
    {
      title: tariff_config?.tariff_order?.order_descriptor ?? 'Tariff Order',
      href: route('tariff-orders.show', tariff_config.tariff_order_id),
    },
    {
      title: 'Edit',
      href: route('tariff-configs.edit', tariff_config.tariff_config_id),
    },
  ]
  return (
    <MainLayout
      navItems={meteringBillingNavItems}
      breadcrumb={breadcrumb}
      selectedItem='Tariffs'
    >
      <TariffConfigEditForm
        tariff_config={tariff_config}
        tariffOrders={tariff_orders}
        consumptionTariffs={consumption_tariffs}
        connectionPurposes={connection_purposes}
      />
    </MainLayout>
  )
}
