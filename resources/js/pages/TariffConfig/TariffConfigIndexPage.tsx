import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import TariffConfigList from '@/components/Tariff/TariffConfigList'
import { TariffConfig } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Pagination from '@/ui/Pagination/Pagination'
import ListSearch from '@/ui/Search/ListSearch'
import { Paginator } from '@/ui/ui_interfaces'

const breadcrumb: BreadcrumbItem[] = [
  {
    title: 'Tariff Config',
    href: '/tariff-config',
  },
]
interface Props {
  filters: {
    search: string
    sort: string
    sortBy: string
  }
  tariff_configs: Paginator<TariffConfig>
}
export default function TariffConfigIndexPage({ filters, tariff_configs }: Props) {
  return (
    <MainLayout
      navItems={meteringBillingNavItems}
      breadcrumb={breadcrumb}
      selectedItem='Tariffs'
      addBtnUrl='/tariff-config/create'
      addBtnText='Create Tariff Config'
    >
      <ListSearch
        placeholder='Search Tariff Config'
        search={filters.search}
        title='Tariff Config'
        url='/tariff-config'
      />
      {tariff_configs?.data?.length > 0 ? (
        <>
          <TariffConfigList tariff_configs={tariff_configs.data} />
          <Pagination pagination={tariff_configs} />
        </>
      ) : (
        <div className='flex h-[calc(100vh-200px)] items-center justify-center'>
          <div className='text-center'>No tariff configs found</div>
        </div>
      )}
    </MainLayout>
  )
}
