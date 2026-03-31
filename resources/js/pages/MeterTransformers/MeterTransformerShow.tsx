import { Card } from '@/components/ui/card'
import MainLayout from '@/layouts/main-layout'
import type { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import Field from '@/components/ui/field'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { MeterTransformer } from '@/interfaces/data_interfaces'
import { getDisplayDate } from '@/utils'
import { router } from '@inertiajs/react'

interface Props {
  transformer: MeterTransformer
}

export default function MeterTransformerShow({ transformer }: Readonly<Props>) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    { title: 'Settings', href: '/settings-page' },
    { title: 'CTPTs', href: '/meter-ctpt' },
    { title: 'Detail', href: `/meter-ctpt/${transformer.meter_ctpt_id}` },
  ]
  const handleEdit = () => {
    router.get(route('meter-ctpt.edit', transformer.meter_ctpt_id))
  }
  console.log(transformer)
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='CTPTs'
      title={'CTPT Details'}
      description={
        <>
          CTPT Details for <span className='font-semibold'>{transformer.ctpt_serial}</span>
        </>
      }
    >
      <div>
        <div className='flex flex-col gap-4 pr-3 sm:flex-row sm:items-end sm:justify-end'>
          {transformer.is_edit && (
            <button
              onClick={handleEdit}
              className='link-button-text'
            >
              EDIT
            </button>
          )}
        </div>
      </div>
      {/* Main Content Card */}
      <Card className='rounded-lg p-7'>
        <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
          General Information
        </StrongText>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Field
            label='Type'
            value={transformer.type?.parameter_value}
          />
          <Field
            label='CTPT Serial'
            value={transformer.ctpt_serial}
          />
          <Field
            label='Ownership Type'
            value={transformer.ownership_type?.parameter_value}
          />
          <Field
            label='Make'
            value={transformer.make?.parameter_value}
          />
        </div>
      </Card>

      {/* Technical Specifications */}
      <Card className='rounded-lg p-7'>
        <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
          Technical Specifications
        </StrongText>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Field
            label='Internal Ratio'
            value={
              transformer.ratio_primary_value && transformer.ratio_secondary_value
                ? `${transformer.ratio_primary_value} / ${transformer.ratio_secondary_value}`
                : '-'
            }
          />
          <Field
            label='Accuracy Class'
            value={transformer.accuracy_class?.parameter_value}
          />
          <Field
            label='Burden'
            value={transformer.burden?.parameter_value}
          />
          <Field
            label='Manufacture Date'
            value={getDisplayDate(transformer.manufacture_date)}
          />
        </div>
      </Card>
    </MainLayout>
  )
}
