import GeneratingStationForm from '@/components/GeneratingStation/GeneratingStationFormComponent'
import { consumerNavItems } from '@/components/Navbar/navitems'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { ParameterValues } from '@/interfaces/parameter_types'
import { RegionOption } from '@/interfaces/data_interfaces'
import Card from '@/ui/Card/Card'
interface Props {
  districts: RegionOption[]
  states: RegionOption[]
  generationStatus: ParameterValues[]
  generationTypes: ParameterValues[]
  voltageCategories: ParameterValues[]
  plantTypes: ParameterValues[]
}

export default function GeneratingStationCreatePage({
  districts,
  states,
  generationStatus,
  generationTypes,
  voltageCategories,
  plantTypes,
}: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Generating Stations',
      href: route('generating-stations.index'),
    },
    {
      title: 'Generating Station Create',
      href: route('generating-stations.create'),
    },
  ]

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      selectedTopNav='Consumers'
      selectedItem='Generating Stations'
      navItems={consumerNavItems}
      title='Generating Stations'
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-2'>
        <Card>
          <GeneratingStationForm
            districts={districts}
            states={states}
            generationStatus={generationStatus}
            generationTypes={generationTypes}
            voltageCategories={voltageCategories}
            plantTypes={plantTypes}
          />
        </Card>
      </div>
    </MainLayout>
  )
}
