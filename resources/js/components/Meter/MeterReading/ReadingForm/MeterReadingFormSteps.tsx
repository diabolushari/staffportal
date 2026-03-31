import {
  MeterReading,
  MeterReadingValueGroup,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { MeterReadingForm } from '@/pages/MeterReading/MeterReadingCreatePage'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import MeterReadingObservationStep from '../MeterReadingObservationStep'
import useMeterReadingErrorState from './meter-reading-error-state'
import MeterReadingsStep from './MeterReadingsStep'
import useMeterHealthForm from './useMeterHealthForm'
import useMeterReadingForm from './useMeterReadingForm'

interface Props {
  activeStep: number
  setActiveStep: Dispatch<SetStateAction<number>>
  editMode: boolean
  formData: MeterReadingForm
  setFormValue: (
    key: keyof MeterReadingForm
  ) => (value: MeterReadingForm[keyof MeterReadingForm]) => void
  toggleBoolean: (key: keyof MeterReadingForm) => () => void
  meterHealthTypes: ParameterValues[]
  ctHealthTypes: ParameterValues[]
  anomalyTypes: ParameterValues[]
  latestMeterReadingGroupByMeter: MeterReadingValueGroup[]
  post: (form: MeterReadingForm) => void
  errors: Record<string, string | undefined>
  loading: boolean
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
  latestMeterReading: MeterReading | null
}

export default function MeterReadingFormSteps({
  activeStep,
  setActiveStep,
  editMode,
  formData,
  setFormValue,
  meterHealthTypes,
  ctHealthTypes,
  anomalyTypes,
  latestMeterReadingGroupByMeter,
  post,
  errors,
  loading,
  metersWithTimezonesAndProfiles,
  latestMeterReading,
}: Readonly<Props>) {
  const [activeMeter, setActiveMeter] = useState<MeterWithTimezoneAndProfile | null>(null)

  const isFirstReading = useMemo(() => {
    if (activeMeter == null) {
      return true
    }

    const latestMeterReading = latestMeterReadingGroupByMeter.find(
      (reading) => reading.meter?.meter_id === activeMeter.meter_id
    )

    if (latestMeterReading == null) {
      return true
    }

    return latestMeterReading.reading == null
  }, [activeMeter, latestMeterReadingGroupByMeter])

  const { readingValues, updateReading } = useMeterReadingForm(
    metersWithTimezonesAndProfiles,
    latestMeterReadingGroupByMeter,
    null
  )

  const { healthData, updateMeterHealth, updateCTPTHealth, updateRybValues } = useMeterHealthForm(
    metersWithTimezonesAndProfiles,
    meterHealthTypes,
    ctHealthTypes,
    latestMeterReadingGroupByMeter
  )

  const accordionOpen = () => {
    // Object.values(previewRefs.current).forEach((ref) => {
    //   ref?.expandAll()
    // })
  }

  const [isOnParamaterForm, setIsOnParameterForm] = useState(false)

  const { profileValidationState, updateProfileErrors, allProfileHasData, profileErrorExist } =
    useMeterReadingErrorState(metersWithTimezonesAndProfiles, readingValues)

  const handleSubmit = () => {
    accordionOpen()

    const submitFormData = { ...formData }

    if (editMode) {
      delete submitFormData.is_billable
    }

    post({
      ...submitFormData,
      readings_by_meter: readingValues,
      meter_health: healthData,
    })
  }

  return (
    <>
      {activeStep === 1 && (
        <MeterReadingObservationStep
          setActiveStep={setActiveStep}
          formData={formData}
          setFormValue={setFormValue}
          anomalyTypes={anomalyTypes}
          errors={errors}
          meterHealthData={healthData}
          updateRybValues={updateRybValues}
        />
      )}
      {activeStep === 2 && (
        <MeterReadingsStep
          setActiveStep={setActiveStep}
          handleSubmit={handleSubmit}
          healthData={healthData}
          metersWithTimezonesAndProfiles={metersWithTimezonesAndProfiles}
          formData={formData}
          readingValues={readingValues}
          updateReading={updateReading}
          setFormValue={setFormValue}
          latestMeterReading={latestMeterReading}
          meterHealthTypes={meterHealthTypes}
          ctHealthTypes={ctHealthTypes}
          updateMeterHealth={updateMeterHealth}
          updateCTPTHealth={updateCTPTHealth}
          setIsOnParameterForm={setIsOnParameterForm}
          isFirstReading={isFirstReading}
          isOnparameterForm={isOnParamaterForm}
          activeMeter={activeMeter}
          setActiveMeter={setActiveMeter}
          profileValidationState={profileValidationState}
          updateProfileErrors={updateProfileErrors}
          allProfileHasData={allProfileHasData}
          profileErrorExist={profileErrorExist}
          loading={loading}
        />
      )}
    </>
  )
}
