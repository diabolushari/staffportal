import MeterForm from '@/components/Meter/MeterForm'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { Meter } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import Card from '@/ui/Card/Card'

export interface MeterFormProps {
  ownershipTypes: ParameterValues[]
  meterProfiles: ParameterValues[]
  types: ParameterValues[]
  categories: ParameterValues[]
  accuracyClasses: ParameterValues[]
  phases: ParameterValues[]
  dialingFactors: ParameterValues[]
  units: ParameterValues[]
  resetTypes: ParameterValues[]
  internalPtRatios: ParameterValues[]
  internalCtRatios: ParameterValues[]
  meterPtPrimary: ParameterValues[]
  meterPtSecondary: ParameterValues[]
  meter?: Meter
}

const breadcrumbs = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Settings',
    href: '/settings-page',
  },
  { title: 'Meters', href: '/meters' },
  {
    title: 'Add Meter',
    href: '/meters/create',
  },
]

export default function MeterCreatePage({
  ownershipTypes,
  meterProfiles,
  types,
  accuracyClasses,
  phases,
  dialingFactors,
  units,
  resetTypes,
  meter,
  meterPtPrimary,
  meterPtSecondary,
}: Readonly<MeterFormProps>) {
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='Meters'
      title={meter ? 'Edit Meter' : 'Add Meter'}
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-2'>
        <Card>
          <MeterForm
            ownershipTypes={ownershipTypes}
            meterProfiles={meterProfiles}
            types={types}
            accuracyClasses={accuracyClasses}
            phases={phases}
            dialingFactors={dialingFactors}
            units={units}
            resetTypes={resetTypes}
            internalPtPrimary={meterPtPrimary}
            internalPtSecondary={meterPtSecondary}
            meter={meter}
          />
        </Card>
      </div>
    </MainLayout>
  )
}
