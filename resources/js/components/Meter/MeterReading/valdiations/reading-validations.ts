import {
  MeterReadingFormState,
  TimezoneReadingState,
} from '@/components/Meter/MeterReading/ReadingForm/useMeterReadingForm'
import { MeterProfileParameter, MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import { CONSUMPTION_PARAMETER_NAME, DEMAND_PARAMETER_NAME } from '@/types/constants'

export const verifyFinalReadingDigits = (value: string, intDigits: number, decDigits: number) => {
  if (value === '') return true

  const regex =
    decDigits > 0
      ? new RegExp(`^\\d{0,${intDigits}}(\\.\\d{0,${decDigits}})?$`)
      : new RegExp(`^\\d{0,${intDigits}}$`)

  return regex.test(value)
}

export function verifyApparentEnergy(
  timeZoneId: number,
  parameterName: string,
  value: number,
  meterInfo: MeterWithTimezoneAndProfile,
  meterReadingValues: MeterReadingFormState[]
) {
  console.log('value', value)
  const otherParameterName =
    parameterName.toLowerCase() === CONSUMPTION_PARAMETER_NAME.toLowerCase()
      ? DEMAND_PARAMETER_NAME.toLowerCase()
      : CONSUMPTION_PARAMETER_NAME.toLowerCase()

  const otherParameter = meterInfo.reading_parameters.find(
    (p) => p.name?.toLowerCase() === otherParameterName
  )

  if (otherParameter == null) {
    return true
  }

  const meterReading = meterReadingValues.find(
    (meterReading) => meterReading.meter_id === meterInfo.meter_id
  )

  if (meterReading == null) {
    return true
  }

  const otherParameterReading = meterReading.parameters.find(
    (p) => p.meter_parameter_id === otherParameter.meter_parameter_id
  )

  if (otherParameterReading == null) {
    return true
  }

  const timezoneReading = otherParameterReading.readings.find(
    (reading) => reading.timezone_id === timeZoneId
  )

  if (timezoneReading == null) {
    return true
  }

  if (timezoneReading.values.diff == '') {
    return true
  }

  if (parameterName.toLowerCase() === CONSUMPTION_PARAMETER_NAME.toLowerCase()) {
    return value <= Number(timezoneReading.values.diff)
  }
  return value >= Number(timezoneReading.values.diff)
}

export function verifyReadingIsNumber(
  finalNum: number,
  diffNum: number,
  reading: TimezoneReadingState,
  integerDigits: number,
  decimalDigits: number
): Record<string, string | undefined> | null {
  const errors: Record<string, string | undefined> = {}

  if (Number.isNaN(finalNum)) {
    errors[`${reading.timezone_id}.final`] = 'Final reading must be a number.'
    return errors
  }

  if (finalNum < 0) {
    errors[`${reading.timezone_id}.final`] = 'Final reading must not be less than 0.'
    return errors
  }

  if (Number.isNaN(diffNum) || diffNum < 0) {
    errors[`${reading.timezone_id}.final`] = 'Final reading must not be less than Initial reading.'
    return errors
  }

  if (!verifyFinalReadingDigits(reading.values.final, integerDigits, decimalDigits)) {
    const decimalHint = decimalDigits > 0 ? ` and ${decimalDigits} decimals` : ''
    errors[`${reading.timezone_id}.final`] =
      `Final reading can only have up to ${integerDigits} digits${decimalHint}.`
    return errors
  }

  return null
}

const getPercentageChange = (initialDiff: number, lastDiff: number) => {
  if (initialDiff === 0) return 0
  const diffChange = lastDiff - initialDiff
  return (diffChange / initialDiff) * 100
}

export function compareAgainstOthers(
  selectedParameter: MeterProfileParameter,
  readingValues: MeterReadingFormState[],
  reading: TimezoneReadingState,
  selectedMeter: MeterWithTimezoneAndProfile,
  diffNum: number
): {
  errors: Record<string, string | undefined> | null
  warnings: Record<string, string | undefined> | null
} {
  const errors: Record<string, string | undefined> = {}
  const warnings: Record<string, string | undefined> = {}

  if (
    selectedParameter.name.toLowerCase() === CONSUMPTION_PARAMETER_NAME.toLowerCase() ||
    selectedParameter.name.toLowerCase() === DEMAND_PARAMETER_NAME.toLowerCase()
  ) {
    if (
      !verifyApparentEnergy(
        reading.timezone_id,
        selectedParameter.name,
        Number(reading.values.diff),
        selectedMeter,
        readingValues
      )
    ) {
      errors[`${reading.timezone_id}.diff`] = 'kVAh should be greater than kWh.'
      return { errors, warnings }
    }
  }

  const prevDiff = Number(reading.values.lastReadingDiff)
  if (!Number.isNaN(prevDiff) && prevDiff > 0) {
    const percentage = getPercentageChange(prevDiff, diffNum)
    if (Math.abs(percentage) >= 20) {
      const direction = percentage > 0 ? 'higher' : 'lower'
      warnings[`${reading.timezone_id}.diff`] =
        `Difference is ${Math.abs(percentage).toFixed(2)}% ${direction} than previous reading.`
    }
    return { errors, warnings }
  }

  return { errors: null, warnings: null }
}
