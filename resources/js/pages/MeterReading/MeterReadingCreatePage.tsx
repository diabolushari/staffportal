import MeterReadingFormSteps from '@/components/Meter/MeterReading/ReadingForm/MeterReadingFormSteps'
import MeterReadingGeneralStep from '@/components/Meter/MeterReading/ReadingForm/MeterReadingGeneralStep'
import { consumerNavItems } from '@/components/Navbar/navitems'
import Stepper from '@/components/Stepper'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import {
  ConsumerData,
  MeterConnectionMapping,
  MeterReading,
  MeterReadingValueGroup,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { getDisplayDate } from '@/utils'
import { getToday } from '@/utils/DateService'
import { useMemo, useState } from 'react'

export interface MeterReadingForm {
  id: number
  connection_id: number
  metering_date: string
  reading_start_date: string
  reading_end_date: string
  anomaly_id: string
  remarks: string
  interim_reason_id: string
  is_interim_reading: boolean
  is_billable?: boolean
  _method: 'PUT' | 'POST' | undefined
}

interface Step {
  id: number
  title: string
  status?: 'default' | 'error' | 'completed'
  cardTitle?: string
  cardSubtitle?: string
}

interface Props {
  connectionWithConsumer: ConsumerData
  meterHealthTypes: ParameterValues[]
  ctHealthTypes: ParameterValues[]
  anomalyTypes: ParameterValues[]
  latestMeterReading: MeterReading
  editMode: boolean
  interimReasons: ParameterValues[]
  latestMeterReadingGroupByMeter: MeterReadingValueGroup[]
  meterConnectionMappings: MeterConnectionMapping[]
}

export default function MeterReadingCreatePage({
  connectionWithConsumer,
  meterHealthTypes,
  ctHealthTypes,
  anomalyTypes,
  latestMeterReading,
  editMode,
  interimReasons,
  latestMeterReadingGroupByMeter,
  meterConnectionMappings,
}: Readonly<Props>) {
  console.log(latestMeterReadingGroupByMeter)

  const breadcrumb: BreadcrumbItem[] = useMemo(() => {
    return [
      {
        title: 'Home',
        href: '/',
      },
      {
        title: 'Connections',
        href: '/connections',
      },
      {
        title: connectionWithConsumer?.connection?.consumer_number.toString() ?? '',
        href: `/connections/${connectionWithConsumer?.connection?.connection_id}`,
      },
      {
        title: 'Meter Reading',
        href: `/connection/${connectionWithConsumer?.connection?.connection_id}/meter-reading`,
      },
      {
        title: 'Create',
        href: `/connection/${connectionWithConsumer?.connection?.connection_id}/meter-reading/create`,
      },
    ]
  }, [connectionWithConsumer])

  const { post, errors, loading } = useInertiaPost(route('meter-reading.store'), {
    showErrorToast: true,
  })

  const defalultAnomaly = anomalyTypes.find(
    (h) => h.parameter_value.toLowerCase() === 'no visible anomalies'
  )
  const { formData, setFormValue, toggleBoolean } = useCustomForm<MeterReadingForm>({
    id: editMode ? latestMeterReading?.id : 0,
    connection_id: connectionWithConsumer?.connection?.connection_id ?? 0,
    metering_date: getToday(),
    reading_start_date: '',
    reading_end_date: '',
    anomaly_id: editMode
      ? latestMeterReading?.anomaly_id.toString()
      : (defalultAnomaly?.id.toString() ?? ''),
    remarks: editMode ? latestMeterReading?.remarks : '',
    interim_reason_id: '',
    is_interim_reading: false,
    is_billable: true,
    _method: editMode ? 'PUT' : undefined,
  })

  const [activeStep, setActiveStep] = useState(0)

  const [metersWithTimezonesAndProfiles, setMetersWithTimezonesAndProfiles] = useState<
    MeterWithTimezoneAndProfile[]
  >([])

  const steps: Step[] = useMemo(() => {
    const hasStepError = (fields: string[]) =>
      fields.some((f) => errors?.[f as keyof typeof errors])

    return [
      {
        id: 1,
        title: 'General',
        status: hasStepError([
          'metering_date',
          'reading_start_date',
          'reading_end_date',
          'reading_type',
        ])
          ? 'error'
          : 'default',
        cardTitle: 'General',
      },
      {
        id: 2,
        title: 'Observations',
        status: hasStepError([
          'meter_health_id',
          'ctpt_health_id',
          'anomaly_id',
          'ct_health_id',
          'pt_health_id',
          'faulty_date',
        ])
          ? 'error'
          : 'default',
        cardTitle: `Observations for ${connectionWithConsumer?.consumer?.organization_name}`,
        cardSubtitle: `${formData.reading_start_date} to ${formData.reading_end_date}`,
      },
      {
        id: 3,
        title: 'Readings',
        status: 'default',
        cardTitle: `Readings for ${connectionWithConsumer?.consumer?.organization_name ?? connectionWithConsumer?.connection?.consumer_number}`,
        cardSubtitle: `${getDisplayDate(formData.reading_start_date)} to ${getDisplayDate(formData.reading_end_date)}`,
      },
    ]
  }, [connectionWithConsumer, formData, errors])

  const meterMissingErrors = useMemo(() => {
    return {
      title: 'Missing Meters',
      description: 'Connection does not have any meters or ct/pt transformers attached to it.',
      bulletPoints: [
        'Please add meters to the connection first.',
        'If you are adding meters to an existing connection, please make sure the meters are attached to the correct CT/PT transformers.',
      ],
      actionUrl: route('connections.show', connectionWithConsumer?.connection?.connection_id),
    }
  }, [connectionWithConsumer])

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={consumerNavItems}
      selectedItem='Meter & Readings'
      selectedTopNav='Consumers'
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        <div>
          <Stepper
            activeStep={activeStep}
            onStepChange={() => {}}
            steps={steps}
          >
            {activeStep === 0 && (
              <MeterReadingGeneralStep
                connectionWithConsumer={connectionWithConsumer}
                editMode={editMode}
                formData={formData}
                setFormValue={setFormValue}
                toggleBoolean={toggleBoolean}
                errors={errors}
                latestMeterReadings={latestMeterReadingGroupByMeter}
                interimReasons={interimReasons}
                meterConnectionMappings={meterConnectionMappings}
                onMetersWithTimezonesAndProfilesChange={setMetersWithTimezonesAndProfiles}
                setActiveStep={setActiveStep}
              />
            )}
            {(activeStep === 1 || activeStep === 2) && (
              <MeterReadingFormSteps
                post={post}
                loading={loading}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                editMode={editMode}
                metersWithTimezonesAndProfiles={metersWithTimezonesAndProfiles}
                formData={formData}
                setFormValue={setFormValue}
                toggleBoolean={toggleBoolean}
                errors={errors}
                latestMeterReading={latestMeterReading}
                latestMeterReadingGroupByMeter={latestMeterReadingGroupByMeter}
                meterHealthTypes={meterHealthTypes}
                ctHealthTypes={ctHealthTypes}
                anomalyTypes={anomalyTypes}
              />
            )}
          </Stepper>
        </div>
      </div>
    </MainLayout>
  )
}
