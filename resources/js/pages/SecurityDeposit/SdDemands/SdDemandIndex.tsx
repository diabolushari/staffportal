import { metadataNavItems } from '@/components/Navbar/navitems'
import SdDemandIndexSearch from '@/components/SecurityDeposit/SdDemands/SdDemandIndexSearch'
import SdDemandList from '@/components/SecurityDeposit/SdDemands/SdDemandList'
import { Connection, SdDemand } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Security Deposit Demands',
    href: '/sd-demands',
  },
]

interface Props {
  sdDemands: Paginator<SdDemand>
  calculationBasics: ParameterValues[]
  demandTypes: ParameterValues[]
  oldConnection?: Connection
  oldCalculationBasicId?: string
  oldDemandTypeId?: string
  oldTotalSdAmount?: string
}

export default function SdDemandIndex({
  sdDemands,
  calculationBasics,
  demandTypes,
  oldConnection,
  oldCalculationBasicId,
  oldDemandTypeId,
  oldTotalSdAmount,
}: Readonly<Props>) {
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={metadataNavItems}
      addBtnText='Security Deposit Demand'
      addBtnUrl={route('sd-demands.create')}
      selectedTopNav='Security Deposit Demands'
      title='Security Deposit Demands'
    >
      <SdDemandIndexSearch
        calculationBasics={calculationBasics}
        demandTypes={demandTypes}
        oldConnection={oldConnection}
        oldCalculationBasicId={oldCalculationBasicId}
        oldDemandTypeId={oldDemandTypeId}
        oldTotalSdAmount={oldTotalSdAmount}
      />
      <div>{sdDemands && <SdDemandList sdDemands={sdDemands.data} />}</div>
      <div>{sdDemands && <Pagination pagination={sdDemands} />}</div>
    </MainLayout>
  )
}
