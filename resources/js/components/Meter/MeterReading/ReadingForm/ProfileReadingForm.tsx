import { Card } from '@/components/ui/card'
import { MeterProfileParameter, MeterWithTimezoneAndProfile } from '@/interfaces/data_interfaces'
import { showError } from '@/ui/alerts'
import Button from '@/ui/button/Button'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useMeterReadingValidation from '../valdiations/meter-reading-validation-helpers'
import MeterReadingValueForm from './MeterReadingValueForm'
import { MeterReadingFormState, TimezoneReadingState } from './useMeterReadingForm'

interface Props {
  readingValues: MeterReadingFormState[]
  metersWithTimezonesAndProfile: MeterWithTimezoneAndProfile
  profile: MeterProfileParameter
  updateReading: (meterId: number, parameterId: number, newReading: TimezoneReadingState[]) => void
  isFirstReading: boolean
  onErrorChange?: (
    meterId: number,
    parameterId: number,
    errors: Record<string, string | undefined>
  ) => void
}

const ProfileReadingForm = ({
  readingValues,
  metersWithTimezonesAndProfile,
  profile,
  updateReading,
  isFirstReading,
  onErrorChange,
}: Props) => {
  const [showWarningModal, setShowWarningModal] = useState(false)

  const { readingErrors, readingWarnings } = useMeterReadingValidation(
    metersWithTimezonesAndProfile,
    profile,
    readingValues
  )

  const { meter, selectedParameter, parameterReading } = useMemo(() => {
    const meter = metersWithTimezonesAndProfile
    const selectedParameter = profile
    const meterReadingData = readingValues.find((m) => m.meter_id === meter.meter_id)
    const parameterReading = meterReadingData?.parameters.find(
      (p) => p.meter_parameter_id === selectedParameter.meter_parameter_id
    )

    return {
      meter,
      selectedParameter,
      parameterReading,
    }
  }, [readingValues, metersWithTimezonesAndProfile, profile])

  const maxValue = useMemo(() => {
    const integerDigits = meter?.meter.digit_count ?? 0
    const decimalDigits = meter?.meter.decimal_digit_count ?? 0
    return Number.parseFloat(
      `${'9'.repeat(integerDigits)}${decimalDigits > 0 ? `.${'9'.repeat(2)}` : ''}`
    )
  }, [meter])

  useEffect(() => {
    if (meter == null) {
      return
    }

    onErrorChange?.(meter.meter_id, profile.meter_parameter_id, readingErrors)
  }, [meter, onErrorChange, profile.meter_parameter_id, readingErrors])

  const updateData = useCallback(
    (timezoneId: number, value: string) => {
      if (!meter || !selectedParameter || !parameterReading) return

      const valueAsNumber = Number.parseFloat(value)
      if (value !== '' && Number.isNaN(valueAsNumber)) {
        showError('Invalid value')
        return
      }

      const updatedReadings = parameterReading.readings.map((reading) => {
        if (reading.timezone_id !== timezoneId) return reading

        let diff = 0
        if (value !== '') {
          if (reading.isRotation) {
            diff = Math.ceil(maxValue) - Number(reading.values.initial) + valueAsNumber
          } else {
            diff = valueAsNumber - Number(reading.values.initial)
          }
        }

        const updated = {
          ...reading,
          values: {
            ...reading.values,
            final: value,
            diff: diff.toString(),
            value: Number(
              ((meter.meter_mf ?? 1) * diff).toFixed(meter.meter.decimal_digit_count ?? 2)
            ),
          },
        }

        return updated
      })

      updateReading(meter.meter_id, selectedParameter.meter_parameter_id, updatedReadings)
    },
    [meter, selectedParameter, parameterReading, maxValue, updateReading]
  )

  const updateInitialValue = useCallback(
    (timezoneId: number, value: string) => {
      if (!meter || !selectedParameter || !parameterReading) return

      const updatedReadings = parameterReading.readings.map((reading) => {
        if (reading.timezone_id !== timezoneId) return reading

        const num = Number.parseFloat(value)
        if (value !== '' && Number.isNaN(num)) {
          showError('Invalid value')
          return reading
        }

        return {
          ...reading,
          values: {
            ...reading.values,
            initial: value,
            final: value,
            diff: value,
            value: Number(
              ((meter.meter_mf ?? 1) * num).toFixed(meter.meter.decimal_digit_count ?? 2)
            ),
          },
        }
      })

      updateReading(meter.meter_id, selectedParameter.meter_parameter_id, updatedReadings)
    },
    [meter, selectedParameter, parameterReading, updateReading]
  )

  const toggleRotation = useCallback(
    (timezoneId: number) => {
      if (!meter || !selectedParameter || !parameterReading) return

      const updatedReadings = parameterReading.readings.map((reading) => {
        if (reading.timezone_id !== timezoneId) return reading

        const finalNum = Number(reading.values.final)
        let diff = Number(reading.values.diff)

        if (!Number.isNaN(finalNum)) {
          diff = reading.isRotation
            ? finalNum - Number(reading.values.initial)
            : Math.ceil(maxValue) - Number(reading.values.initial) + finalNum
        }

        return {
          ...reading,
          isRotation: !reading.isRotation,
          values: {
            ...reading.values,
            diff: diff.toString(),
            value: (meter.meter_mf ?? 1) * diff,
          },
        }
      })

      updateReading(meter.meter_id, selectedParameter.meter_parameter_id, updatedReadings)
    },
    [meter, selectedParameter, parameterReading, maxValue, updateReading]
  )

  return (
    <>
      {meter == null || selectedParameter == null || parameterReading == null ? null : (
        <div className='flex flex-col gap-4'>
          <Card className='p-4'>
            <div
              className={`mt-2 ${
                parameterReading?.readings?.length > 2 ? 'overflow-y-auto pr-2' : ''
              }`}
            >
              <MeterReadingValueForm
                parameterReadingValues={parameterReading.readings ?? []}
                onChange={updateData}
                onToggleRotation={toggleRotation}
                meter={meter.meter}
                profileParameter={selectedParameter}
                errors={readingErrors}
                maxReadingValue={maxValue}
                isFirstReading={isFirstReading}
                updateInitialReading={updateInitialValue}
                mf={meter?.meter_mf ?? 1}
                warnings={readingWarnings}
              />
            </div>
          </Card>
        </div>
      )}
      {showWarningModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='w-full max-w-md rounded-lg bg-white p-6'>
            <h3 className='text-lg font-semibold text-yellow-600'>Warning detected</h3>
            <p className='mt-2 text-sm text-gray-700'>
              Reading difference is more than ±20%. Are you sure you want to continue?
            </p>

            <div className='mt-4 flex justify-end gap-2'>
              <Button
                variant='primary'
                label='ok'
                onClick={() => setShowWarningModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileReadingForm
