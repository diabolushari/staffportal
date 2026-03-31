import {
  MeterConnectionMapping,
  MeterProfileParameter,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { MeterReadingFormState, TimezoneReadingState } from '../ReadingForm/useMeterReadingForm'
import { compareAgainstOthers, verifyReadingIsNumber } from './reading-validations'

export function getMeterMappingForPeriod(
  mappings: MeterConnectionMapping[],
  start: string,
  end: string
): MeterConnectionMapping[] {
  const startDate = dayjs(start)
  const endDate = dayjs(end)

  if (!startDate.isValid() || !endDate.isValid()) {
    return []
  }

  return mappings
    .filter((mapping) => mapping.effective_start_ts != mapping.effective_end_ts)
    .filter((mapping) => {
      const mappingStart =
        mapping.effective_start_ts == null ? null : dayjs(mapping.effective_start_ts)
      const mappingEnd = mapping.effective_end_ts == null ? null : dayjs(mapping.effective_end_ts)

      if (mappingStart == null) {
        return false
      }

      return (
        (mappingStart.isBefore(endDate) || mappingStart.isSame(endDate)) &&
        (mappingEnd == null || mappingEnd.isAfter(startDate) || mappingEnd.isSame(startDate))
      )
    })
}

export function getLastDayOfMonth(date: string): string {
  return dayjs(date).endOf('month').format('YYYY-MM-DD')
}

function validateReading(
  readingValues: MeterReadingFormState[],
  readings: TimezoneReadingState[],
  selectedMeter: MeterWithTimezoneAndProfile,
  selectedParameter: MeterProfileParameter
) {
  let errors: Record<string, string | undefined> = {}
  let warnings: Record<string, string | undefined> = {}

  const integerDigits = selectedMeter.meter.digit_count ?? 0
  const decimalDigits = selectedMeter.meter.decimal_digit_count ?? 0

  readings.forEach((reading) => {
    if (reading.values.final === '') {
      return
    }

    const finalNum = Number.parseFloat(reading.values.final)
    const diffNum = Number.parseFloat(reading.values.diff)

    const numberFormatErrors = verifyReadingIsNumber(
      finalNum,
      diffNum,
      reading,
      integerDigits,
      decimalDigits
    )
    if (numberFormatErrors != null) {
      errors = { ...errors, ...numberFormatErrors }
      return
    }

    const { errors: otherReadingErrors, warnings: otherReadingWarnings } = compareAgainstOthers(
      selectedParameter,
      readingValues,
      reading,
      selectedMeter,
      diffNum
    )
    if (otherReadingErrors != null) {
      errors = { ...errors, ...otherReadingErrors }
      return
    }
    if (otherReadingWarnings != null) {
      warnings = { ...warnings, ...otherReadingWarnings }
    }
  })

  return { errors, warnings }
}

export default function useMeterReadingValidation(
  selectedMeter: MeterWithTimezoneAndProfile | null,
  selectedParameter: MeterProfileParameter | null,
  readingValues: MeterReadingFormState[]
) {
  const [readingErrors, setReadingErrors] = useState<Record<string, string | undefined>>({})
  const [readingWarnings, setReadingWarnings] = useState<Record<string, string | undefined>>({})

  useEffect(() => {
    if (selectedMeter == null || selectedParameter == null || readingValues.length === 0) {
      setReadingErrors({})
      setReadingWarnings({})
      return
    }

    const debounceRef = setTimeout(() => {
      setReadingErrors({})
      setReadingWarnings({})
      readingValues.forEach((reading) => {
        if (reading.meter_id !== selectedMeter.meter_id) {
          return
        }

        const parameterReading = reading.parameters.find(
          (p) => p.meter_parameter_id === selectedParameter.meter_parameter_id
        )

        if (parameterReading == null) {
          return
        }

        const { errors, warnings } = validateReading(
          readingValues,
          parameterReading.readings,
          selectedMeter,
          selectedParameter
        )
        setReadingErrors(errors)
        setReadingWarnings(warnings)
      })
    }, 700)

    return () => {
      if (debounceRef != null) {
        clearTimeout(debounceRef)
      }
    }
  }, [selectedMeter, selectedParameter, readingValues])

  return { readingErrors, readingWarnings }
}
