import MainLayout from '@/layouts/main-layout'
import { meteringBillingNavItems, meterNavItems } from '@/components/Navbar/navitems'
import { BreadcrumbItem } from '@/types'
import { PurposeInfo } from '@/interfaces/data_interfaces'
import PurposeInfoForm from '@/components/PurposeInfo/PurposeInfoForm'

interface PageProps {
  purposeInfo?: PurposeInfo
}
export default function TariffOrderCreatePage({ purposeInfo }: Readonly<PageProps>) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Settings',
      href: '/settings-page',
    },
    {
      title: 'Purpose Info',
      href: '/purpose-info',
    },
    {
      title: purposeInfo ? 'Edit Purpose Info' : 'Add Purpose Info',
      href: purposeInfo ? `/purpose-info/${purposeInfo.id}/edit` : '/purpose-info/create',
    },
  ]
  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={meteringBillingNavItems}
      leftBarTitle='Tariff Mappings'
      selectedItem='Tariff Mappings'
      title={purposeInfo ? 'Configure Tariff Mapping' : 'Configure Tariff Mapping'}
    >
      {' '}
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-6'>
        <PurposeInfoForm purposeInfo={purposeInfo} />
      </div>
    </MainLayout>
  )
}
