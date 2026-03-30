import {
  Meter,
  MeterProfileParameter,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { MeterReadingForm } from '@/pages/MeterReading/MeterReadingCreatePage'
import { CONSUMPTION_PARAMETER_NAME, DEMAND_PARAMETER_NAME } from '@/types/constants'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import { useCallback, useMemo, useRef, useState } from 'react'
import PowerFactorBar from './MeterPowerFactor'
import MeterReadingHealthForm from './MeterReadingHealthForm'
import ProfileReadingForm from './ProfileReadingForm'
import ReadingParameterPreviewCard from './ReadingParameterPreviewCard'
import { MeterProfileValidationState } from './meter-reading-error-state'
import { MeterHealthFormData } from './useMeterHealthForm'
import { MeterReadingFormState, TimezoneReadingState } from './useMeterReadingForm'

interface PowerFactorData {
  timezone_name: string
  timezone_id: number
  pf: string
}

const calculatePowerFactor = (
  readingValues: MeterReadingFormState[],
  meterId: number,
  timezones: { timezone_id: number; timezone_name: string }[],
  meterProfiles: MeterProfileParameter[]
): PowerFactorData[] => {
  const meterData = readingValues.find((m) => m.meter_id === meterId)
  if (!meterData) {
    return []
  }

  const kwhProfile = meterProfiles.find(
    (p) =>
      p.name.toLowerCase() === CONSUMPTION_PARAMETER_NAME.toLowerCase() && p.is_export === false
  )
  const kvahProfile = meterProfiles.find(
    (p) => p.name.toLowerCase() === DEMAND_PARAMETER_NAME.toLowerCase() && p.is_export === false
  )

  if (kwhProfile == null || kvahProfile == null) {
    return []
  }

  const kwhParam = meterData.parameters.find(
    (p) => p.meter_parameter_id === kwhProfile.meter_parameter_id
  )
  const kvahParam = meterData.parameters.find(
    (p) => p.meter_parameter_id === kvahProfile.meter_parameter_id
  )

  return timezones?.map((tz) => {
    const kwhReading = kwhParam?.readings.find((r) => r.timezone_id === tz.timezone_id)
    const kvahReading = kvahParam?.readings.find((r) => r.timezone_id === tz.timezone_id)

    const kwhDiff = Number.parseFloat(kwhReading?.values?.value?.toString() ?? '')
    const kvahDiff = Number.parseFloat(kvahReading?.values?.value?.toString() ?? '')

    const pf =
      Number.isNaN(kwhDiff) || Number.isNaN(kvahDiff) || kvahDiff === 0
        ? 'N/A'
        : (kwhDiff / kvahDiff).toFixed(3)

    return {
      timezone_name: tz.timezone_name,
      timezone_id: tz.timezone_id,
      pf,
    }
  })
}
const averagePowerfactor = (
  readingValues: MeterReadingFormState[],
  meterId: number,
  meterProfiles: MeterProfileParameter[]
): number | null => {
  const kwhProfile = meterProfiles.find(
    (p) =>
      p.name.toLowerCase() === CONSUMPTION_PARAMETER_NAME.toLowerCase() && p.is_export === false
  )

  const kvahProfile = meterProfiles.find(
    (p) => p.name.toLowerCase() === DEMAND_PARAMETER_NAME.toLowerCase() && p.is_export === false
  )

  if (!kwhProfile || !kvahProfile) {
    return null
  }

  let totalKwh = 0
  let totalKvah = 0

  readingValues
    .filter((r) => r.meter_id === meterId)
    .forEach((reading) => {
      reading?.parameters?.forEach((param) => {
        // kWh
        if (param.meter_parameter_id == kwhProfile.meter_parameter_id) {
          param?.readings?.forEach((tz) => {
            totalKwh += Number(tz.values?.diff ?? 0)
          })
        }

        // kVAh
        if (param.meter_parameter_id == kvahProfile.meter_parameter_id) {
          param?.readings?.forEach((tz) => {
            totalKvah += Number(tz.values?.diff ?? 0)
          })
        }
      })
    })

  if (totalKvah === 0) {
    return null
  }

  return Number((totalKwh / totalKvah).toFixed(4))
}

interface Props {
  meterWithTimezoneAndProfile: MeterWithTimezoneAndProfile
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
  updateReading: (meterId: number, parameterId: number, newReading: TimezoneReadingState[]) => void
  isFirstReading: boolean
  hasMultipleMeters: boolean
  formData: MeterReadingForm
  readingValues: MeterReadingFormState[]
  healthData: MeterHealthFormData[]
  updateMeterHealth: (statusId: number, meter: Meter) => void
  updateCTPTHealth: (meterId: number, ctptId: number, statusId: string) => void
  meterHealthTypes: ParameterValues[]
  ctHealthTypes: ParameterValues[]
  setIsOnParameterForm: (value: boolean) => void
  profileValidationState: MeterProfileValidationState[]
  onProfileErrorChange: (
    meterId: number,
    parameterId: number,
    errors: Record<string, string | undefined>
  ) => void
}

export interface MeterReadingPreviewRef {
  expandAll: () => void
}
const MeterReadingPreview = ({
  meterWithTimezoneAndProfile,
  healthData,
  readingValues,
  updateMeterHealth,
  updateCTPTHealth,
  updateReading,
  isFirstReading,
  meterHealthTypes,
  ctHealthTypes,
  profileValidationState,
  onProfileErrorChange,
}: Props) => {
  const hasImportKwh = meterWithTimezoneAndProfile.reading_parameters.some(
    (p) =>
      p.name.toLowerCase() === CONSUMPTION_PARAMETER_NAME.toLowerCase() && p.is_export === false
  )
  const hasImportKvah = meterWithTimezoneAndProfile.reading_parameters.some(
    (p) => p.name.toLowerCase() === DEMAND_PARAMETER_NAME.toLowerCase() && p.is_export === false
  )
  const shouldShowPowerFactor = hasImportKwh && hasImportKvah

  const powerFactorData = shouldShowPowerFactor
    ? calculatePowerFactor(
        readingValues,
        meterWithTimezoneAndProfile.meter_id,
        meterWithTimezoneAndProfile.timezones,
        meterWithTimezoneAndProfile.reading_parameters
      )
    : []

  const averagePF = averagePowerfactor(
    readingValues,
    meterWithTimezoneAndProfile.meter_id,
    meterWithTimezoneAndProfile.reading_parameters
  )

  const [openProfiles, setOpenProfiles] = useState<Set<number>>(new Set())
  const allProfileIds = useMemo(
    () => meterWithTimezoneAndProfile.reading_parameters.map((p) => p.meter_parameter_id),
    [meterWithTimezoneAndProfile]
  )

  const isAllExpanded = openProfiles.size === allProfileIds.length

  const previewRef = useRef<HTMLDivElement | null>(null)

  const profileErrors = useMemo(() => {
    const meterValidationState = profileValidationState.find(
      (validationState) => validationState.meter_id === meterWithTimezoneAndProfile.meter_id
    )

    return meterWithTimezoneAndProfile.reading_parameters.reduce<Record<number, boolean>>(
      (errorState, profile) => {
        const parameterValidationState = meterValidationState?.parameters.find(
          (parameter) => parameter.parameter_id === profile.meter_parameter_id
        )

        errorState[profile.meter_parameter_id] = Object.values(
          parameterValidationState?.errors ?? {}
        ).some((error) => error != null && error !== '')

        return errorState
      },
      {}
    )
  }, [profileValidationState, meterWithTimezoneAndProfile])

  const toggleAllProfiles = useCallback(
    (event: React.FormEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()

      if (isAllExpanded) {
        setOpenProfiles(new Set())
      } else {
        setOpenProfiles(new Set(allProfileIds))
      }
      requestAnimationFrame(() => {
        previewRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    },
    [isAllExpanded, allProfileIds]
  )

  const toggleProfile = useCallback((parameterId: number) => {
    setOpenProfiles((prev) => {
      const next = new Set(prev)
      if (next.has(parameterId)) {
        next.delete(parameterId)
      } else {
        next.add(parameterId)
      }
      return next
    })
  }, [])

  return (
    <div
      key={meterWithTimezoneAndProfile.meter_id}
      className='flex flex-col gap-4'
    >
      <StrongText className='mb-2 block'>
        Meter {meterWithTimezoneAndProfile?.meter?.meter_serial}
      </StrongText>
      <span className='text-sm text-gray-500'>
        Multiplication Factor: {meterWithTimezoneAndProfile?.meter_mf}
      </span>
      <MeterReadingHealthForm
        meterWithTimezoneAndProfile={meterWithTimezoneAndProfile}
        healthData={healthData}
        updateMeterHealth={updateMeterHealth}
        updateCTPTHealth={updateCTPTHealth}
        meterHealthTypes={meterHealthTypes}
        ctHealthTypes={ctHealthTypes}
      />
      <div
        className='p-2'
        ref={previewRef}
      >
        <div className='flex justify-end p-5'>
          <Button
            label={isAllExpanded ? 'Collapse All' : 'Expand All'}
            variant='tertiary'
            onClick={toggleAllProfiles}
          />
        </div>
        <div className='grid gap-4 md:grid-cols-1'>
          {meterWithTimezoneAndProfile.reading_parameters.map((profile) => {
            const isOpen = openProfiles.has(profile.meter_parameter_id)
            return (
              <ReadingParameterPreviewCard
                key={profile.meter_parameter_id}
                isOpen={isOpen}
                onToggle={() => toggleProfile(profile.meter_parameter_id)}
                meterWithTimezoneAndProfile={meterWithTimezoneAndProfile}
                readingValues={readingValues}
                profile={profile}
                hasError={profileErrors[profile.meter_parameter_id] ?? false}
              >
                <ProfileReadingForm
                  metersWithTimezonesAndProfile={meterWithTimezoneAndProfile}
                  updateReading={updateReading}
                  readingValues={readingValues}
                  profile={profile}
                  isFirstReading={isFirstReading}
                  onErrorChange={onProfileErrorChange}
                />
              </ReadingParameterPreviewCard>
            )
          })}
        </div>
      </div>

      {shouldShowPowerFactor && averagePF !== null && (
        <div className='mt-6'>
          <StrongText className='mb-3'>Power Factor</StrongText>
          <PowerFactorBar
            powerFactorsByMeter={{ factors: powerFactorData }}
            meterId={meterWithTimezoneAndProfile.meter_id}
            averagePF={averagePF}
          />
        </div>
      )}
    </div>
  )
}

export default MeterReadingPreview
