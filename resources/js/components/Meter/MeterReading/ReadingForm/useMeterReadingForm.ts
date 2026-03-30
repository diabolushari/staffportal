import {
  MeterProfileParameter,
  MeterReading,
  MeterReadingValueGroup,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { useCallback, useEffect, useState } from 'react'

export interface MeterReadingFormState {
  meter_id: number
  parameters: ParameterReadingState[]
}

export interface ParameterReadingState {
  meter_parameter_id: number
  display_name: string
  is_cumulative: boolean
  is_export: boolean
  readings: TimezoneReadingState[]
  name: string
}

export interface ParameterReadingState {
  meter_parameter_id: number
  display_name: string
  is_cumulative: boolean
  is_export: boolean
  readings: TimezoneReadingState[]
  name: string
}

export interface TimezoneReadingState {
  timezone_id: number
  timezone_name: string
  isRotation: boolean
  values: {
    diff: string
    final: string
    initial: string
    value: number
    lastReadingDiff: number
  }
}

function prevReadiningValue(
  lastMeterReading: MeterReadingValueGroup | null,
  profileId: number,
  timezoneId: number
) {
  return lastMeterReading?.values?.find((value) => {
    return value.parameter_id === profileId && value.timezone_id === timezoneId
  })
}

function initializeReadignParameter(
  meter: MeterWithTimezoneAndProfile,
  lastReading: MeterReadingValueGroup | null,
  profile: MeterProfileParameter
): ParameterReadingState {
  return {
    meter_parameter_id: profile.meter_parameter_id,
    display_name: profile.display_name,
    is_cumulative: profile.is_cumulative,
    is_export: profile.is_export,
    name: profile.name,
    readings: meter?.timezones?.map((tz) => {
      const prevReading = prevReadiningValue(
        lastReading,
        profile.meter_parameter_id,
        tz.timezone_id
      )

      return {
        timezone_id: tz.timezone_id,
        timezone_name: tz.timezone_name,
        isRotation: false,
        values: {
          initial: profile.is_cumulative ? (prevReading?.final_reading.toString() ?? '0') : '0',
          final: prevReading == null ? '0' : '',
          diff: prevReading == null ? '0' : '',
          lastReadingDiff: prevReading?.difference ?? 0,
          value: 0,
        },
      }
    }),
  }
}

export default function useMeterReadingForm(
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[],
  lastMeterReadings: MeterReadingValueGroup[],
  oldReading: MeterReading | null
) {
  const [readingValues, setReadingValues] = useState<MeterReadingFormState[]>([])

  useEffect(() => {
    if (readingValues?.length > 0) {
      return
    }

    if (metersWithTimezonesAndProfiles == null || metersWithTimezonesAndProfiles.length === 0) {
      return
    }
    const initializedMeters = metersWithTimezonesAndProfiles.map((meter) => {
      const lastReading = lastMeterReadings.find(
        (reading) => reading.meter.meter_id === meter.meter_id
      )
      if (lastReading == null) {
        return {
          meter_id: meter.meter_id,
          parameters: [],
        }
      }
      return {
        meter_id: meter.meter_id,
        parameters: meter.reading_parameters.map((profile) => {
          return initializeReadignParameter(meter, lastReading, profile)
        }),
      }
    })

    setReadingValues(initializedMeters)
  }, [oldReading, metersWithTimezonesAndProfiles, readingValues, lastMeterReadings])

  const updateReading = useCallback(
    (meterId: number, parameterId: number, newReading: TimezoneReadingState[]) => {
      setReadingValues((prev) =>
        prev.map((meterReading) => {
          if (meterReading.meter_id !== meterId) return meterReading

          return {
            ...meterReading,
            parameters: meterReading.parameters.map((parameter) => {
              if (parameter.meter_parameter_id !== parameterId) return parameter

              return {
                ...parameter,
                readings: newReading,
              }
            }),
          }
        })
      )
    },
    []
  )

  return {
    readingValues,
    updateReading,
  }
}
