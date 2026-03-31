import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import TariffOrderList from '@/components/Tariff/TariffOrderList'
import { TariffOrder } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Pagination from '@/ui/Pagination/Pagination'
import ListSearch from '@/ui/Search/ListSearch'
import { Paginator } from '@/ui/ui_interfaces'

const breadcrumb: BreadcrumbItem[] = [
  {
    title: 'Settings',
    href: '/settings-page',
  },
  {
    title: 'Tariff Orders',
    href: '/tariff-orders',
  },
]
interface Props {
  filters: {
    search: string
    orderBy: string
    orderDirection: string
  }
  tariffOrders: Paginator<TariffOrder>
}

export default function TariffOrderIndexPage({ filters, tariffOrders }: Props) {
  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={meteringBillingNavItems}
      leftBarTitle='Tariff Management'
      addBtnUrl={route('tariff-orders.create')}
      selectedItem='Tariffs'
      addBtnText='Tariff Orders'
      title='Tariff Orders'
    >
      <ListSearch
        title=''
        placeholder='Find Tariff Orders'
        url={route('tariff-orders.index')}
        search={filters?.search}
      />
      {tariffOrders?.data?.length > 0 ? (
        <>
          <TariffOrderList tariff_orders={tariffOrders.data} />
          <Pagination pagination={tariffOrders} />
        </>
      ) : (
        <div className='flex h-[calc(100vh-200px)] items-center justify-center'>
          <div className='text-center'>No tariff orders found</div>
        </div>
      )}
    </MainLayout>
  )
}
