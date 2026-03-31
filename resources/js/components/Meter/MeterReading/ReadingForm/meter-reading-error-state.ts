import { MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { MeterReadingFormState } from './useMeterReadingForm'

export interface MeterProfileValidationState {
  meter_id: number
  parameters: ProfileValidationState[]
}

export interface ProfileValidationState {
  parameter_id: number
  errors: Record<string, string | undefined>
}

function buildProfileValidationState(
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[],
  currentState: MeterProfileValidationState[] = []
): MeterProfileValidationState[] {
  return metersWithTimezonesAndProfiles.map((meterWithProfiles) => {
    const currentMeterState = currentState.find(
      (state) => state.meter_id === meterWithProfiles.meter_id
    )

    return {
      meter_id: meterWithProfiles.meter_id,
      parameters: meterWithProfiles.reading_parameters.map((profile) => {
        const currentParameterState = currentMeterState?.parameters.find(
          (parameter) => parameter.parameter_id === profile.meter_parameter_id
        )

        return {
          parameter_id: profile.meter_parameter_id,
          errors: currentParameterState?.errors ?? {},
        }
      }),
    }
  })
}

export default function useMeterReadingErrorState(
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[],
  readingValues: MeterReadingFormState[]
) {
  const [profileValidationState, setProfileValidationState] = useState<
    MeterProfileValidationState[]
  >([])

  useEffect(() => {
    setProfileValidationState((currentState) =>
      buildProfileValidationState(metersWithTimezonesAndProfiles, currentState)
    )
  }, [metersWithTimezonesAndProfiles])

  const updateProfileErrors = useCallback(
    (meterId: number, parameterId: number, errors: Record<string, string | undefined>) => {
      setProfileValidationState((currentState) => {
        return currentState.map((meterState) => {
          if (meterState.meter_id !== meterId) {
            return meterState
          }

          return {
            ...meterState,
            parameters: meterState.parameters.map((parameterState) => {
              if (parameterState.parameter_id !== parameterId) {
                return parameterState
              }

              return {
                ...parameterState,
                errors,
              }
            }),
          }
        })
      })
    },
    []
  )

  const allProfileHasData = useMemo(() => {
    if (metersWithTimezonesAndProfiles.length === 0) {
      return false
    }

    return metersWithTimezonesAndProfiles.every((meterWithProfiles) => {
      const meterReading = readingValues.find(
        (reading) => reading.meter_id === meterWithProfiles.meter_id
      )

      if (meterReading == null) {
        return false
      }

      return meterWithProfiles.reading_parameters.every((profile) => {
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
    })
  }, [metersWithTimezonesAndProfiles, readingValues])

  const profileErrorExist = useMemo(() => {
    return profileValidationState.some((meterState) => {
      return meterState.parameters.some((parameterState) => {
        return Object.values(parameterState.errors).some((error) => error != null && error !== '')
      })
    })
  }, [profileValidationState])

  return {
    profileValidationState,
    updateProfileErrors,
    allProfileHasData,
    profileErrorExist,
  }
}
