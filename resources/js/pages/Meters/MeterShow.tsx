import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import Field from '@/components/ui/field'
import { Meter, MeterTimezoneType, MeterTransformer } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import type { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import { getDisplayDate } from '@/utils'
import { router } from '@inertiajs/react'

interface Props {
  meter: Meter
  transformers: MeterTransformer[]
  currentTimezone: MeterTimezoneType
  timezoneTypes: ParameterValues[]
}

// --- MAIN COMPONENT: MeterShow ---
export default function MeterShow({ meter, currentTimezone, timezoneTypes }: Readonly<Props>) {
  // --- BREADCRUMBS AND FORMATTERS ---
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Settings',
      href: '/settings-page',
    },
    {
      title: 'Meters',
      href: route('meters.index'),
    },
    {
      title: meter?.meter_serial ?? '',
      href: route('meters.show', meter?.meter_id ?? 0),
    },
  ]

  // --- EVENT HANDLERS ---
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this meter?')) {
      router.delete(route('meters.destroy', meter?.meter_id ?? 0))
    }
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='Meters'
      title='Meter Details'
      description={<>Meter Details for {meter?.meter_serial ?? ''}</>}
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        {/* Header */}
        <div className='flex flex-col gap-4 pr-3 sm:flex-row sm:items-end sm:justify-end'>
          {!meter?.has_meter_reading && (
            <button
              onClick={() => router.get(route('meters.edit', meter?.meter_id ?? 0))}
              className='link-button-text'
            >
              EDIT
            </button>
          )}
          <button
            onClick={handleDelete}
            className='delete-link'
          >
            DELETE
          </button>
        </div>

        {/* Main Content Card */}

        {/* --- General Information --- */}
        <Card className='rounded-lg p-7'>
          <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
            General Information
          </StrongText>
          <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Field
              label='Smart Meter'
              value={meter?.smart_meter_ind ? 'Yes' : 'No'}
            />
            <Field
              label='Bidirectional'
              value={meter?.bidirectional_ind ? 'Yes' : 'No'}
            />
            <Field
              label='Meter Serial'
              value={meter?.meter_serial ?? ''}
            />
            <Field
              label='Company Seal Number'
              value={meter?.company_seal_num ?? ''}
            />
            <Field
              label='Meter Type'
              value={meter?.meter_type?.parameter_value}
            />

            <Field
              label='Ownership Type'
              value={meter?.ownership_type?.parameter_value}
            />
            <Field
              label='Meter Make'
              value={meter?.meter_make?.parameter_value}
            />

            <Field
              label='Batch Code'
              value={meter?.batch_code ?? ''}
            />
          </div>
        </Card>

        {/* --- Technical Specifications --- */}
        <Card className='rounded-lg p-7'>
          <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
            Technical Specifications
          </StrongText>
          <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Field
              label='Manufacture Date'
              value={getDisplayDate(meter?.manufacture_date ?? '')}
            />
            <Field
              label='Supply Date'
              value={getDisplayDate(meter?.supply_date ?? '')}
            />
            <Field
              label='Accuracy Class'
              value={meter?.accuracy_class?.parameter_value}
            />
            <Field
              label='Dialing Factor'
              value={meter?.dialing_factor?.parameter_value}
            />
            <Field
              label='Unit'
              value={meter?.meter_unit?.parameter_value}
            />
            <Field
              label='Reset Type'
              value={meter?.meter_reset_type?.parameter_value}
            />
            <Field
              label='Phase'
              value={meter?.meter_phase?.parameter_value}
            />
            <div></div>
            <Field
              label='Digit Count'
              value={meter?.digit_count ?? ''}
            />
            <Field
              label='Decimal Digit Count'
              value={meter?.decimal_digit_count ?? ''}
            />
            <Field
              label='Meter Constant'
              value={meter?.meter_constant ?? ''}
            />

            <Field
              label='Warranty Period (Months)'
              value={meter?.warranty_period ?? ''}
            />
          </div>
        </Card>

        {/* --- CT/PT Specifications --- */}
        <Card className='rounded-lg p-7'>
          <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
            CT/PT Specifications
          </StrongText>
          <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Field
              label='Internal CT Ratio'
              value={
                meter?.internal_ct_primary && meter?.internal_ct_secondary
                  ? `${meter?.internal_ct_primary} / ${meter?.internal_ct_secondary}`
                  : '-'
              }
            />
            <Field
              label='Internal PT Ratio'
              value={
                meter?.internal_pt_primary && meter?.internal_pt_secondary
                  ? `${meter?.internal_pt_primary} / ${meter?.internal_pt_secondary}`
                  : '-'
              }
            />
            <Field
              label='CT Count'
              value={meter?.ct_count ?? ''}
            />
            <Field
              label='PT Count'
              value={meter?.pt_count ?? ''}
            />
          </div>
        </Card>

        {/* --- Timezone Information --- */}
        {/* <MeterTimezoneCard
          meter={meter}
          currentTimezone={currentTimezone}
          timezoneTypes={timezoneTypes}
        /> */}
      </div>
    </MainLayout>
  )
}
