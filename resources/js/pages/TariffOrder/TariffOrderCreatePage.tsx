import MainLayout from '@/layouts/main-layout'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import TariffOrderForm from '@/components/Tariff/TariffOrderForm'
import { TariffOrder } from '@/interfaces/data_interfaces'

interface PageProps {
  tariff_order: TariffOrder
}
export default function TariffOrderCreatePage({ tariff_order }: Readonly<PageProps>) {
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
      title: tariff_order ? 'Edit Tariff Order' : 'Add Tariff Order',
      href: tariff_order
        ? `/tariff-orders/${tariff_order.tariff_order_id}/edit`
        : '/tariff-orders/create',
    },
  ]
  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={meteringBillingNavItems}
      leftBarTitle='Tariff Management'
      selectedItem='Tariffs'
      title={tariff_order ? 'Edit Tariff Order' : 'Add Tariff Order'}
    >
      {' '}
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-6'>
        <TariffOrderForm tariffOrder={tariff_order} />
      </div>
    </MainLayout>
  )
}
