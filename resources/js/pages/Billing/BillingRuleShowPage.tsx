import ChargeHeadTable from '@/components/Billing/ChargeHeadTable'
import ComputedPropertyTable from '@/components/Billing/ComputedPropertyTable'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import Field from '@/components/ui/field'
import { BillingRule, ChargeHead, ComputedProperty } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import { PencilIcon } from 'lucide-react'
import { route } from 'ziggy-js'

interface Props {
  billingRule: BillingRule
  paginatedComputedProperties: Paginator<ComputedProperty>
  paginatedChargeHeads: Paginator<ChargeHead>
}

export default function BillingRuleShowPage({
  billingRule,
  paginatedComputedProperties,
  paginatedChargeHeads,
}: Props) {
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
      title: 'Billing',
      href: '/billing-rules',
    },
    {
      title: 'Billing Rule Show',
      href: route('billing-rules.show', billingRule.id),
    },
  ]

  return (
    <MainLayout
      navItems={meteringBillingNavItems}
      breadcrumb={breadcrumbs}
      selectedItem='Billing Rule'
      selectedTopNav='Billing'
      title={billingRule?.name}
    >
      <div className='flex flex-col gap-6'>
        <Card className='rounded-lg p-7'>
          <div className='mb-6 flex items-center justify-between'>
            <StrongText className='text-base font-semibold text-[#252c32]'>
              Basic Information
            </StrongText>
            <button
              onClick={() => router.visit(route('billing-rules.edit', billingRule.id))}
              className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0078d4] transition-colors hover:bg-gray-50'
            >
              <PencilIcon className='h-4 w-4' />
              Edit
            </button>
          </div>
          <hr className='mb-6 border-[#e5e9eb]' />
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Field
              label='Name'
              value={billingRule.name}
            />
            <Field
              label='Effective Start Date'
              value={billingRule.effective_start}
            />
            <Field
              label='Effective End Date'
              value={billingRule.effective_end}
            />
          </div>
        </Card>

        <Card>
          <div className='mb-6 flex items-center justify-between'>
            <StrongText className='text-base font-semibold text-[#252c32]'>Charge Heads</StrongText>
          </div>
          {paginatedChargeHeads?.data?.length > 0 ? (
            <ChargeHeadTable
              chargeHeads={paginatedChargeHeads?.data}
              pagination={paginatedChargeHeads}
            />
          ) : (
            <p>No charge heads found</p>
          )}
        </Card>

        <Card>
          <div className='mb-6 flex items-center justify-between'>
            <StrongText className='text-base font-semibold text-[#252c32]'>
              Computed Properties
            </StrongText>
          </div>
          <ComputedPropertyTable
            computedProperties={paginatedComputedProperties.data}
            pagination={paginatedComputedProperties}
          />
        </Card>
      </div>
    </MainLayout>
  )
}
