import { Meter, MeterReading, MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { MeterReadingForm } from '@/pages/MeterReading/MeterReadingCreatePage'
import Button from '@/ui/button/Button'
import React, { useEffect, useMemo } from 'react'
import MeterReadingPreview from './MeterReadingPreview'
import { MeterProfileValidationState } from './meter-reading-error-state'
import { MeterHealthFormData } from './useMeterHealthForm'
import { MeterReadingFormState, TimezoneReadingState } from './useMeterReadingForm'

interface Props {
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
  formData: MeterReadingForm
  healthData: MeterHealthFormData[]
  setFormValue: (
    key: keyof MeterReadingForm
  ) => (value: MeterReadingForm[keyof MeterReadingForm]) => void
  setIsOnParameterForm: (value: boolean) => void
  latestMeterReading: MeterReading | null
  meterHealthTypes: ParameterValues[]
  ctHealthTypes: ParameterValues[]
  readingValues: MeterReadingFormState[]
  updateReading: (meterId: number, parameterId: number, newReading: TimezoneReadingState[]) => void
  updateMeterHealth: (meterHealthId: number, meter: Meter) => void
  updateCTPTHealth: (meterId: number, ctptId: number, healthId: string) => void
  isFirstReading: boolean
  isOnparameterForm: boolean
  activeMeter: MeterWithTimezoneAndProfile | null
  setActiveMeter: (meter: MeterWithTimezoneAndProfile | null) => void
  profileValidationState: MeterProfileValidationState[]
  updateProfileErrors: (
    meterId: number,
    parameterId: number,
    errors: Record<string, string | undefined>
  ) => void
  setActiveStep: (step: number) => void
  handleSubmit: () => void
  allProfileHasData: boolean
  profileErrorExist: boolean
  loading: boolean
}

export default function MeterReadingsStep({
  metersWithTimezonesAndProfiles,
  formData,
  updateMeterHealth,
  updateCTPTHealth,
  meterHealthTypes,
  ctHealthTypes,
  readingValues,
  updateReading,
  healthData,
  setIsOnParameterForm,
  isFirstReading,
  activeMeter,
  setActiveMeter,
  profileValidationState,
  updateProfileErrors,
  setActiveStep,
  handleSubmit,
  allProfileHasData,
  profileErrorExist,
  loading,
}: Readonly<Props>) {
  const filteredMetersWithTimezonesAndProfiles = useMemo(() => {
    return metersWithTimezonesAndProfiles
  }, [metersWithTimezonesAndProfiles])

  const activeMeterHasData = useMemo(() => {
    if (activeMeter == null) {
      return false
    }

    const meterReading = readingValues.find((reading) => reading.meter_id === activeMeter.meter_id)

    if (meterReading == null) {
      return false
    }

    return activeMeter.reading_parameters.every((profile) => {
      const parameterReading = meterReading.parameters.find(
        (parameter) => parameter.meter_parameter_id === profile.meter_parameter_id
      )

      if (parameterReading == null) {
        return false
      }

      return parameterReading.readings.every((reading) => {
        return reading.values.final != null && reading.values.final !== ''
      })
    })
  }, [activeMeter, readingValues])

  const activeMeterHasErrors = useMemo(() => {
    if (activeMeter == null) {
      return false
    }

    const meterValidationState = profileValidationState.find(
      (validationState) => validationState.meter_id === activeMeter.meter_id
    )

    return (
      meterValidationState?.parameters.some((parameterState) => {
        return Object.values(parameterState.errors).some((error) => error != null && error !== '')
      }) ?? false
    )
  }, [activeMeter, profileValidationState])

  useEffect(() => {
    if (filteredMetersWithTimezonesAndProfiles.length === 1) {
      setActiveMeter(filteredMetersWithTimezonesAndProfiles[0])
    }
  }, [filteredMetersWithTimezonesAndProfiles, setActiveMeter])

  return (
    <div className='flex flex-col gap-6'>
      {activeMeter == null && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {filteredMetersWithTimezonesAndProfiles?.map((meter) => (
            <button
              key={meter.meter_id}
              className='hover:bg-muted cursor-pointer rounded-xl border p-4 transition'
              onClick={() => setActiveMeter(meter)}
            >
              <div className='font-semibold'>
                Meter #{meter?.meter?.meter_serial ?? meter?.meter_id}
              </div>
              <div className='text-muted-foreground text-sm'> Meter MF: {meter?.meter_mf}</div>
            </button>
          ))}
        </div>
      )}

      {filteredMetersWithTimezonesAndProfiles.length > 1 && activeMeter === null && (
        <div>
          <Button
            variant='secondary'
            label='Back to meters'
            onClick={() => {
              setActiveMeter(null)
              setIsOnParameterForm(false)
            }}
          />
        </div>
      )}
      {activeMeter != null && (
        <React.Fragment>
          <MeterReadingPreview
            healthData={healthData}
            meterHealthTypes={meterHealthTypes}
            ctHealthTypes={ctHealthTypes}
            updateMeterHealth={updateMeterHealth}
            updateCTPTHealth={updateCTPTHealth}
            meterWithTimezoneAndProfile={activeMeter}
            formData={formData}
            readingValues={readingValues}
            metersWithTimezonesAndProfiles={filteredMetersWithTimezonesAndProfiles}
            updateReading={updateReading}
            isFirstReading={isFirstReading}
            hasMultipleMeters={filteredMetersWithTimezonesAndProfiles.length > 1}
            setIsOnParameterForm={setIsOnParameterForm}
            profileValidationState={profileValidationState}
            onProfileErrorChange={updateProfileErrors}
          />
          {filteredMetersWithTimezonesAndProfiles.length > 1 && (
            <div className='flex justify-end'>
              <Button
                variant='primary'
                label='Continue'
                disabled={activeMeterHasErrors || !activeMeterHasData}
                onClick={() => {
                  setActiveMeter(null)
                  setIsOnParameterForm(false)
                }}
              />
            </div>
          )}
        </React.Fragment>
      )}
      {((activeMeter == null && filteredMetersWithTimezonesAndProfiles.length > 1) ||
        filteredMetersWithTimezonesAndProfiles.length === 1) && (
        <div className='flex justify-between'>
          <Button
            variant='secondary'
            label='Change Meter Health Status'
            onClick={() => setActiveStep(1)}
          />
          {allProfileHasData && !profileErrorExist && (
            <Button
              processing={loading}
              variant='primary'
              label='Submit'
              onClick={handleSubmit}
            />
          )}
        </div>
      )}
    </div>
  )
}
