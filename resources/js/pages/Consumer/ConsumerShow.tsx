import ConnectionFlagForm from '@/components/Connections/ConnectionFlagForm'
import ConnectionFlagModal from '@/components/Connections/ConnectionFlagModal'
import useConnectionFlagForm, { GroupedFlags } from '@/components/Connections/useConnectionFlagForm'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import {
  Connection,
  ConnectionFlag,
  ConsumerData,
  MeterAssignment,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import AddButton from '@/ui/button/AddButton'
import EditButton from '@/ui/button/EditButton'
import { router } from '@inertiajs/react'
import { Info, PencilIcon } from 'lucide-react'
import { useState } from 'react'

interface ConsumerShowProps {
  consumer: ConsumerData
  connection: Connection
  meters: MeterAssignment[]
  indicators: ParameterValues[]
}

const safe = (v: unknown, fallback = '-') =>
  v === null || v === undefined || v === '' ? fallback : String(v)

const fmtLocal = (iso?: string | null) => {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString()
}

const InfoBlock = ({ label, value }: { label: string; value?: string | number }) => (
  <div className='space-y-1'>
    <label className='text-sm font-normal text-[#252c32]'>{label}</label>
    <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
      {value || '-'}
    </div>
  </div>
)
interface GroupFlags {
  group_name: string
  flags: ConnectionFlag[]
}
export const groupFlagsBySection = (
  data: ConnectionFlag[] = [],
  section: 'Consumer' | 'Connection'
): GroupFlags[] => {
  const grouped: GroupedFlagMap = {}

  data
    // 1️⃣ filter by attribute1_value
    .filter((flag) => flag.flag?.attribute1_value === section)

    // 2️⃣ group by attribute2_value
    .forEach((flag) => {
      const groupName = flag.flag?.attribute2_value ?? 'Others'

      if (!grouped[groupName]) {
        grouped[groupName] = []
      }

      grouped[groupName].push(flag)
    })

  return Object.entries(grouped).map(([group_name, flags]) => ({
    group_name,
    flags,
  }))
}
type GroupedFlagMap = Record<string, ConnectionFlag[]>
export default function ConsumerShow({
  consumer,
  connection,
  indicators,
}: Readonly<ConsumerShowProps>) {
  const onEdit = () => router.visit(`/consumers/${Number(consumer?.consumer?.connection_id)}/edit`)
  const [editIndicator, setEditIndicator] = useState(false)
  const handleEditIndicator = () => {
    setEditIndicator(!editIndicator)
  }
  const { flagData, updateFlagData } = useConnectionFlagForm(indicators, consumer?.consumer?.flags)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Connections',
      href: '/connections',
    },
    {
      title: connection?.consumer_number.toString() ?? '',
      href: '#',
    },
    {
      title: 'Consumer',
      href: '#',
    },
  ]

  const consumerGroupedFlags = groupFlagsBySection(consumer?.consumer?.flags, 'Consumer')

  return (
    <ConnectionsLayout
      connection={connection}
      connectionId={connection?.connection_id}
      value='connection'
      subTabValue='consumer'
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
      heading={`Connection #${connection?.consumer_number}`}
      onEdit={() => router.visit(route('connection.consumer', connection?.connection_id))}
      description='Consumer'
      consumerExist={true}
      meterExist={connection?.meter_mappings?.length > 0}
    >
      <div className='flex justify-end pr-5'>
        <button
          onClick={onEdit}
          className='link-button-text cursor-pointer underline'
        >
          EDIT
        </button>
      </div>
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto'>
        {/* --- Basic Information --- */}
        <Card className='rounded-lg p-7'>
          <div className='mb-6 flex items-center justify-between'>
            <StrongText className='text-base font-semibold text-[#252c32]'>
              Basic Information
            </StrongText>
          </div>
          <hr className='mb-6 border-[#e5e9eb]' />
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <InfoBlock
              label='Consumer Type'
              value={consumer.consumer.consumer_type?.parameter_value}
            />
            {consumer.consumer.department_name && (
              <InfoBlock
                label='Department Name'
                value={consumer.consumer.department_name?.parameter_value}
              />
            )}
            <InfoBlock
              label='Ownership Type'
              value={consumer.consumer.consumer_ownership_type?.parameter_value}
            />
            {consumer.consumer.consumer_name && (
              <InfoBlock
                label='Consumer Name'
                value={safe(consumer.consumer.consumer_name)}
              />
            )}
            {consumer.consumer.organization_name && (
              <InfoBlock
                label='Organization Name'
                value={safe(consumer.consumer.organization_name)}
              />
            )}
            {consumer.consumer.contact_person && (
              <InfoBlock
                label='Contact Person'
                value={safe(consumer.consumer.contact_person)}
              />
            )}
            <InfoBlock
              label='Consumer CIN'
              value={safe(consumer.consumer.consumer_cin)}
            />
            <InfoBlock
              label='PAN'
              value={safe(consumer.consumer.consumer_pan)}
            />
            <InfoBlock
              label='TAN'
              value={safe(consumer.consumer.consumer_tan)}
            />
            <InfoBlock
              label='GSTIN'
              value={safe(consumer.consumer.consumer_gstin)}
            />
            <InfoBlock
              label='Virtual Account Number'
              value={safe(consumer.consumer.virtual_account_number)}
            />
          </div>
        </Card>

        {consumerGroupedFlags &&
          consumerGroupedFlags.length > 0 &&
          consumerGroupedFlags.map((group, index) => (
            <Card className='rounded-lg p-7'>
              <div className='flex items-center justify-between'>
                <StrongText className='text-base font-semibold text-[#252c32]'>
                  {group.group_name}
                </StrongText>
                <EditButton onClick={handleEditIndicator} />
              </div>
              <hr className='my-4 border-[#e5e9eb]' />
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {group.flags?.map((flag, index) => (
                  <InfoBlock
                    key={index}
                    label={flag.flag?.parameter_value ?? '-'}
                    value='Yes'
                  />
                ))}
              </div>
            </Card>
          ))}
        {editIndicator && (
          <ConnectionFlagModal
            setShowModal={setEditIndicator}
            currentFlags={consumer?.consumer?.flags}
            indicators={indicators}
            connectionId={connection?.connection_id}
          />
        )}
        {consumerGroupedFlags.length === 0 && indicators.length > 0 && (
          <div className='flex items-center justify-start'>
            <AddButton
              onClick={handleEditIndicator}
              buttonText='Add Indicator'
            />
          </div>
        )}

        <Card className='rounded-lg p-7'>
          <StrongText className='text-base font-semibold text-[#252c32]'>Contact</StrongText>
          <hr className='my-4 border-[#e5e9eb]' />

          {/* Primary Contact */}
          <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
            <InfoBlock
              label='Primary Email'
              value={safe(consumer.contact?.primary_email)}
            />
            <InfoBlock
              label='Primary Phone'
              value={safe(consumer.contact?.primary_phone)}
            />
          </div>

          {/* Pending Contacts */}
          {consumer.contact?.contact_folio?.length ? (
            <div>
              <StrongText className='text-sm font-semibold text-[#252c32]'>
                Pending Contacts
              </StrongText>
              <hr className='my-3 border-[#e5e9eb]' />
              <div className='flex flex-col gap-4'>
                {consumer.contact.contact_folio.map((folio, index) => (
                  <Card
                    key={index}
                    className='rounded-lg border border-gray-200 bg-gray-50 p-4'
                  >
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <InfoBlock
                        label='Email'
                        value={safe(folio.email)}
                      />
                      <InfoBlock
                        label='Phone'
                        value={safe(folio.phone)}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className='text-sm text-gray-500'>No pending contacts found</div>
          )}
        </Card>

        {/* --- Addresses --- */}
        {['primary_address', 'billing_address', 'premises_address'].map((key) => {
          const addr = consumer.contact?.[key]
          return (
            <Card
              key={key}
              className='rounded-lg p-7'
            >
              <StrongText className='text-base font-semibold text-[#252c32] capitalize'>
                {key.replace('_', ' ')}
              </StrongText>
              <hr className='my-4 border-[#e5e9eb]' />
              {addr ? (
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <InfoBlock
                    label='Address Line 1'
                    value={safe(addr.address_line1)}
                  />
                  <InfoBlock
                    label='Address Line 2'
                    value={safe(addr.address_line2)}
                  />
                  <InfoBlock
                    label='City/Town/Village'
                    value={safe(addr.city_town_village)}
                  />
                  <InfoBlock
                    label='State'
                    value={safe(addr.state.name)}
                  />
                  <InfoBlock
                    label='District'
                    value={safe(addr.district.name)}
                  />
                  <InfoBlock
                    label='Pincode'
                    value={safe(addr.pincode)}
                  />
                </div>
              ) : (
                <div className='text-slate-600'>No {key} found</div>
              )}
            </Card>
          )
        })}
      </div>
    </ConnectionsLayout>
  )
}
