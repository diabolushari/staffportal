import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MainLayout from '@/layouts/main-layout'
import type { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import { TabGroup } from '@/ui/Tabs/TabGroup'
import { TabsContent } from '@radix-ui/react-tabs'

interface Relation {
  version_id: number
  ctpt_id: number
  ctpt_type?: string
  ratio?: number
  meter_id: number
  meter_serial: string
  status_label: string
  change_reason_label: string
  faulty_date?: string | null
  ctpt_energise_date?: string | null
  ctpt_change_date?: string | null
  status_id: number
  change_reason_id: number
  effective_start_ts: string
  effective_end_ts?: string | null
  // is_active: boolean;
}

interface Props {
  relation: Relation
}

export default function MeterTransformerRelShow({ relation }: Readonly<Props>) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Meter CTPT Relations', href: '/meter-ctpt-rel' },
    { title: 'Detail', href: `/meter-ctpt-rel/${relation.version_id}` },
  ]

  const tabs = [
    {
      value: 'details',
      label: 'Meter Details',
      href: route('meters.show', relation.meter_id),
    },
    {
      value: 'meter-ctpt',
      label: 'Meter CTPT',
      href: route('meter-ctpt.show', relation.ctpt_id),
    },
    {
      value: 'meter-ctpt-rel',
      label: 'Meter CTPT Relations',
      href: route('meter-ctpt-rel.show', relation.version_id),
    },
  ]

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const ctptDetails = `${relation.ctpt_id} - ${relation.ctpt_type}`

  return (
    <MainLayout breadcrumb={breadcrumbs}>
      <TabGroup
        tabs={tabs}
        defaultValue='meter-ctpt-rel'
      >
        <TabsContent value='meter-ctpt-rel'>
          <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
            {/* Header Section */}
            <div className='flex flex-col gap-2'>
              <StrongText className='text-2xl font-semibold text-[#252c32]'>
                Relation #{relation.version_id}
              </StrongText>
            </div>

            {/* Main Content Card */}
            <Card className='rounded-lg p-7'>
              <CardHeader className='mb-6 p-0'>
                <CardTitle className='text-base font-semibold text-[#252c32]'>
                  Meter CTPT Relation Details
                </CardTitle>
              </CardHeader>
              <hr className='mb-6 border-[#e5e9eb]' />
              <CardContent className='p-0'>
                <div className='space-y-8'>
                  {/* Section: General Information */}
                  <div>
                    <StrongText className='mb-4 block text-sm font-medium text-gray-500'>
                      General Information
                    </StrongText>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                      {/* <InfoItem label="CTPT ID" value={relation.ctpt_id} /> */}
                      <InfoItem
                        label='CTPT Type'
                        value={ctptDetails}
                      />
                      <InfoItem
                        label='Meter Serial'
                        value={relation.meter_serial}
                      />
                      <InfoItem
                        label='Status Label'
                        value={relation.status_label}
                      />
                      <InfoItem
                        label='Change Reason Label'
                        value={relation.change_reason_label}
                      />
                    </div>
                  </div>

                  {/* Section: Timeline */}
                  <div>
                    <StrongText className='mb-4 block text-sm font-medium text-gray-500'>
                      Timeline
                    </StrongText>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                      {/* <InfoItem label="Effective Start" value={formatDate(relation.effective_start_ts)} />
                      <InfoItem label="Effective End" value={relation.effective_end_ts ? formatDate(relation.effective_end_ts) : "Ongoing"} /> */}
                      <InfoItem
                        label='Faulty Date'
                        value={formatDate(relation.faulty_date)}
                      />
                      <InfoItem
                        label='CTPT Energise Date'
                        value={formatDate(relation.ctpt_energise_date)}
                      />
                      <InfoItem
                        label='CTPT Change Date'
                        value={formatDate(relation.ctpt_change_date)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </TabGroup>
    </MainLayout>
  )
}

// Reusable helper component
const InfoItem = ({
  label,
  value,
}: {
  label: string
  value: string | number | undefined | null
}) => (
  <div className='space-y-1'>
    <label className='text-sm font-normal text-[#252c32]'>{label}</label>
    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
      {value ?? '-'}
    </div>
  </div>
)
