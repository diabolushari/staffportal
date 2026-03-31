import ConnectionFlagModal from '@/components/Connections/ConnectionFlagModal'
import ConnectionGenerationFormModal from '@/components/Connections/ConnectionGenerationFormModal'
import ConnectionGreenEnergyFormModal from '@/components/Connections/ConnectionGreenEnergyFormModal'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import Field from '@/components/ui/field'
import type { Connection } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import StrongText from '@/typography/StrongText'
import AddButton from '@/ui/button/AddButton'
import EditButton from '@/ui/button/EditButton'
import { router } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import { groupFlagsBySection } from '../Consumer/ConsumerShow'
import ConnectionGreenEnergyCard from '@/components/Connections/ConnectionGreenEnergyCard'

interface Props {
  connection: Connection
  consumerExist: boolean
  indicators: ParameterValues[]
  generationTypes: ParameterValues[]
  primaryPurposes: ParameterValues[]
  greenEnergyTypes: ParameterValues[]
  agreementAuthorities: ParameterValues[]
}

export default function ConnectionsShow({
  connection,
  consumerExist,
  indicators,
  generationTypes,
  primaryPurposes,
  greenEnergyTypes,
  agreementAuthorities,
}: Readonly<Props>) {
  console.log(connection)
  const formatDate = (dateStr?: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString('en-GB') : '-'
  const [editIndicator, setEditIndicator] = useState(false)
  const [editGeneration, setEditGeneration] = useState(false)
  const [addGreenEnergy, setAddGreenEnergy] = useState<boolean>(false)

  const breadcrumbs = useMemo(
    () => [
      {
        title: 'Home',
        href: '/',
      },
      { title: 'Connections', href: '/connections' },
      {
        title: connection?.consumer_number?.toString(),
        href: '#',
      },
      {
        title: 'Connection Details',
        href: '#',
      },
    ],
    [connection]
  )

  const handleIndicator = () => {
    setEditIndicator(!editIndicator)
  }
  const connectionGroupedFlags = groupFlagsBySection(connection?.connection_flags, 'Connection')

  const handleGeneration = () => {
    setEditGeneration(!editGeneration)
  }
  const handleAddGreenEnergy = () => {
    setAddGreenEnergy(!addGreenEnergy)
  }

  const otherPurposesLabel = useMemo(() => {
    if (!connection?.other_purposes?.length) {
      return '-'
    }

    const purposeMap = new Map(
      primaryPurposes.map((purpose) => [purpose.id, purpose.parameter_value])
    )

    const labels = connection.other_purposes
      .map((purposeId) => purposeMap.get(Number(purposeId)))
      .filter((label) => label != undefined)

    if (!labels.length) {
      return '-'
    }

    return labels.join(', ')
  }, [connection?.other_purposes, primaryPurposes])

  const deemedHt =
    connectionGroupedFlags?.some(
      (group) =>
        group.group_name === 'Additional Information' &&
        group.flags?.some((f) => f.flag?.parameter_value === 'Deemed HT')
    ) ?? false

  return (
    <ConnectionsLayout
      connection={connection}
      connectionId={connection?.connection_id ?? 0}
      value={'connection'}
      subTabValue='connection'
      heading='Connection Details'
      description={
        <>
          Connection details for consumer number {'   '}
          <span className='font-bold'>{connection?.consumer_number}</span>
        </>
      }
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
      consumerExist={consumerExist}
      meterExist={connection?.meter_mappings?.length > 0}
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto'>
        <div className='space-y-6'>
          <div className='flex justify-end pr-5'>
            <button
              onClick={() => router.get(route('connections.edit', connection?.connection_id))}
              className='link-button-text cursor-pointer underline'
            >
              EDIT
            </button>
          </div>

          {/* Basic Info */}
          <Card className='rounded-lg p-5'>
            <div className='mb-6 flex items-center justify-between'>
              <StrongText className='text-base font-semibold text-[#252c32]'>
                Basic Information
              </StrongText>
            </div>
            <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Field
                label='Consumer Number'
                value={connection?.consumer_number}
              />
              {connection?.consumer_profiles?.[0]?.organization_name && (
                <Field
                  label='Industry Name'
                  value={connection?.consumer_profiles?.[0]?.organization_name}
                />
              )}
              {connection?.application_no && (
                <Field
                  label='Application Number'
                  value={connection?.application_no}
                />
              )}
              {connection?.consumer_legacy_code && (
                <Field
                  label='Consumer Legacy Code'
                  value={connection?.consumer_legacy_code}
                />
              )}
              <Field
                label='Connection Type'
                value={connection?.connection_type?.parameter_value}
              />
              <Field
                label='Status'
                value={connection?.connection_status?.parameter_value}
              />
              <Field
                label='Voltage'
                value={connection?.voltage?.parameter_value}
              />
              <Field
                label='Phase Type'
                value={connection?.phase_type?.parameter_value}
              />
              <Field
                label='Service Connection Date'
                value={formatDate(connection?.connected_date)}
              />
              <Field
                label='Number of Main Meters'
                value={connection?.no_of_main_meters}
              />
              <div className='col-span-2 mt-4'>
                {connection?.remarks && (
                  <Field
                    label='Remarks'
                    value={connection?.remarks}
                  />
                )}
              </div>
            </div>
          </Card>
          <Card className='rounded-lg p-5'>
            <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
              Load Details
            </StrongText>
            <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Field
                label='Contract Demand (kVA)'
                value={connection?.contract_demand_kva_val}
              />
              <Field
                label='Power Load (KW)'
                value={connection?.power_load_kw_val}
              />
              <Field
                label='Light Load (KW)'
                value={connection?.light_load_kw_val}
              />
              <Field
                label='Connected Load'
                value={connection?.connected_load_kw_val}
              />
            </div>
          </Card>

          {/* Office Info */}
          <Card className='rounded-lg p-5'>
            <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
              Office Information
            </StrongText>
            <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Field
                label='Admin Office Code'
                value={
                  connection?.admin_office?.office_type?.parameter_value +
                  ' - ' +
                  connection?.admin_office?.office_name
                }
              />
              <Field
                label='Service Office Code'
                value={
                  connection?.service_office?.office_type?.parameter_value +
                  ' - ' +
                  connection?.service_office?.office_name
                }
              />
            </div>
          </Card>

          {/* Category / Purpose Info */}
          <Card className='rounded-lg p-5'>
            <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
              Connection Category & Purpose
            </StrongText>
            <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Field
                label='Connection Category'
                value={connection?.connection_category?.parameter_value}
              />
              <Field
                label='Connection Subcategory'
                value={connection?.connection_subcategory?.parameter_value}
              />
              <Field
                label='Primary Purpose'
                value={connection?.primary_purpose?.parameter_value}
              />
              <Field
                label='Other Purposes'
                value={otherPurposesLabel}
              />
            </div>
          </Card>

          {/* Billing / Tariff Info */}
          <Card className='rounded-lg p-5'>
            <StrongText className='mb-6 block text-base font-semibold text-[#252c32]'>
              Billing & Tariff
            </StrongText>
            <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <Field
                label='Billing Process'
                value={connection?.billing_process?.parameter_value}
              />
              <Field
                label='Tariff'
                value={connection?.tariff?.parameter_value}
              />
              <Field
                label='Metering Type'
                value={connection?.metering_type?.parameter_value}
              />
              {connection?.billing_side && (
                <Field
                  label='Billing Side'
                  value={connection?.billing_side?.parameter_value}
                />
              )}
              {connection?.alternate_tariff && deemedHt && (
                <Field
                  label='Billing Tariff'
                  value={connection?.alternate_tariff?.parameter_value}
                />
              )}
            </div>
          </Card>

          {connection?.connection_generation_types &&
            connection?.connection_generation_types?.length > 0 && (
              <Card className='rounded-lg p-5'>
                <div className='mb-6 flex items-center justify-between'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>
                    Generation Types
                  </StrongText>
                  <EditButton onClick={() => handleGeneration()} />
                </div>
                <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  {connection?.connection_generation_types?.map((generationType) => (
                    <>
                      <Field
                        key={generationType?.id}
                        label={generationType?.generation_type?.parameter_value ?? '-'}
                        value='Yes'
                      />
                      {generationType?.generation_sub_type && (
                        <Field
                          key={generationType?.id}
                          label='Generation Sub Type'
                          value={generationType?.generation_sub_type?.parameter_value ?? '-'}
                        />
                      )}
                    </>
                  ))}
                </div>
              </Card>
            )}

          {connectionGroupedFlags &&
            connectionGroupedFlags.length > 0 &&
            connectionGroupedFlags.map((group, index) => (
              <Card className='rounded-lg p-5'>
                <div className='mb-6 flex items-center justify-between'>
                  <StrongText className='text-base font-semibold text-[#252c32]'>
                    {group.group_name}
                  </StrongText>
                  <EditButton onClick={() => handleIndicator()} />
                </div>
                <hr className='bg-kseb-line mb-6 h-[2px] border-0' />

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  {group?.flags?.map((flag) => (
                    <>
                      <Field
                        key={flag?.id}
                        label={flag?.flag?.parameter_value ?? '-'}
                        value='Yes'
                      />
                    </>
                  ))}
                </div>
              </Card>
            ))}
          {connection?.green_energy && connection?.green_energy?.length > 0 && (
            <ConnectionGreenEnergyCard
              connection={connection}
              greenEnergyTypes={greenEnergyTypes}
              agreementAuthorities={agreementAuthorities}
            />
          )}
          <div className='flex gap-4'>
            {connectionGroupedFlags?.length === 0 && indicators.length > 0 && (
              <AddButton
                onClick={() => handleIndicator()}
                buttonText='Add Indicator'
              />
            )}
            {connection?.connection_generation_types?.length === 0 &&
              generationTypes.length > 0 && (
                <AddButton
                  onClick={() => handleGeneration()}
                  buttonText='Add Generation'
                />
              )}
            <AddButton
              onClick={() => handleAddGreenEnergy()}
              buttonText='Add Green Energy'
            />
          </div>
          {editIndicator && (
            <ConnectionFlagModal
              connectionId={connection?.connection_id}
              setShowModal={setEditIndicator}
              currentFlags={connection.connection_flags}
              indicators={indicators}
            />
          )}
          {editGeneration && (
            <ConnectionGenerationFormModal
              connectionId={connection?.connection_id}
              setShowModal={setEditGeneration}
              generationTypes={generationTypes}
              initialGenerationData={connection?.connection_generation_types}
            />
          )}
          {addGreenEnergy && (
            <ConnectionGreenEnergyFormModal
              connection={connection}
              setShowModal={setAddGreenEnergy}
              greenEnergyTypes={greenEnergyTypes}
              agreementAuthorities={agreementAuthorities}
            />
          )}

          {/* Dates */}
        </div>
      </div>
    </ConnectionsLayout>
  )
}
