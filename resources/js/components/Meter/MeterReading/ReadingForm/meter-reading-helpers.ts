import { getMeterMappingForPeriod } from '@/components/Meter/MeterReading/valdiations/meter-reading-validation-helpers'
import {
  Connection,
  MeterConnectionMapping,
  MeteringTimezoneSlot,
  MeterProfileParameter,
  MeterReadingValueGroup,
  MeterTransformerAssignment,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { handleHttpErrors, showError } from '@/ui/alerts'
import axios from 'axios'

interface MeterPeriodDetailsResponse {
  success: boolean
  data?: {
    connections: Connection[]
    meters?: MeterPeriodDetail[]
  }
}

interface MeterPeriodDetail {
  meter_id: number
  profiles: {
    profile: ParameterValues | null
    profile_parameters: MeterProfileParameter[]
  }[]
  timezones: {
    metering_timezones: MeteringTimezoneSlot[]
    timezone_type: ParameterValues | null
  }[]
  transformer_relations: MeterTransformerAssignment[]
}

interface GetMetersWithTimezonesAndProfilesParams {
  connectionId: number
  meterIds: number[]
  startDate: string | null
  endDate: string | null
  latestMeterReadings?: MeterReadingValueGroup[]
  meterConnectionMappings: MeterConnectionMapping[]
}

interface MeterReadingValidationResult {
  hasError: boolean
  errors: Record<string, string | undefined>
  meterWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[]
}

function convertMeterPeriodDetailsToMeterWithTimezonesAndProfiles(
  meterPeriodDetails: MeterPeriodDetail[],
  latestMeterReadings: MeterReadingValueGroup[],
  meterConnectionMappings: MeterConnectionMapping[],
  startDate: string | null,
  endDate: string | null
): MeterWithTimezoneAndProfile[] {
  return meterPeriodDetails
    .map((meter) => {
      const latestMeterReading = latestMeterReadings?.find(
        (reading) => reading?.meter?.meter_id === meter.meter_id
      )

      if (latestMeterReading?.meter == null) {
        return null
      }

      const mappings = getMeterMappingForPeriod(
        meterConnectionMappings.filter((mapping) => mapping.meter_id === meter.meter_id),
        startDate ?? '',
        endDate ?? ''
      )

      const transformerRelations = meter.transformer_relations.reduce(
        (acc: MeterTransformerAssignment[], relation) => {
          const alreadyExists = acc.find((r) => r.ctpt_id === relation.ctpt_id)
          if (alreadyExists) {
            return acc
          }
          return [...acc, relation]
        },
        [] as MeterTransformerAssignment[]
      )

      return {
        meter_id: meter.meter_id,
        meter: {
          ...latestMeterReading.meter,
          transformers: transformerRelations,
        },
        meter_serial: latestMeterReading.meter.meter_serial,
        reading_parameters: meter.profiles[0].profile_parameters,
        timezones: meter.timezones[0].metering_timezones.map((timezone) => ({
          timezone_id: timezone.timezone_name_id,
          timezone_name: timezone.timezone_name?.parameter_value ?? '',
        })),
        meter_mf: mappings[0].meter_mf,
        meter_profile: meter.profiles[0].profile,
      } as MeterWithTimezoneAndProfile
    })
    .filter((meter): meter is MeterWithTimezoneAndProfile => meter != null)
}

export async function getMetersWithTimezonesAndProfiles({
  connectionId,
  meterIds,
  startDate,
  endDate,
  latestMeterReadings,
  meterConnectionMappings,
}: Readonly<GetMetersWithTimezonesAndProfilesParams>): Promise<MeterReadingValidationResult> {
  try {
    const payload = {
      connection_id: connectionId,
      meter_ids: meterIds,
      start_date: startDate,
      end_date: endDate,
    }

    const response = await axios.post<MeterPeriodDetailsResponse>(
      '/api/connections/period-details',
      payload
    )

    console.log('api response', response.data)

    if (!response.data?.success) {
      showError('Validation Failed')
      return emptyValidationResult()
    }

    const meters = response.data.data?.meters ?? []

    let hasError = false
    const errors: Record<string, string | undefined> = {}

    for (const meter of meters) {
      if (meter.profiles.length !== 1) {
        errors[`meters.${meter.meter_id}`] =
          'Meter Should have only one profile during selected period. Please check the meter details.'
        hasError = true
      }

      if (meter.timezones.length !== 1) {
        errors[`meters.${meter.meter_id}`] =
          'Meter Should have only one timezone during selected period. Please check the meter details.'
        hasError = true
      }

      const mappings = getMeterMappingForPeriod(
        meterConnectionMappings.filter((mapping) => mapping.meter_id === meter.meter_id),
        startDate ?? '',
        endDate ?? ''
      )

      //check if all mapping have same meter_mf
      const meterMf = mappings.map((mapping) => mapping.meter_mf)
      if (meterMf.length > 0 && meterMf.some((mf) => mf !== meterMf[0])) {
        errors[`meters.${meter.meter_id}`] =
          'Meters MF changed during this period. Please check the meter details.'
        hasError = true
      }
    }

    if (hasError) {
      return {
        hasError: true,
        errors,
        meterWithTimezonesAndProfiles: [],
      }
    }

    const meterWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[] =
      convertMeterPeriodDetailsToMeterWithTimezonesAndProfiles(
        meters,
        latestMeterReadings ?? [],
        meterConnectionMappings,
        startDate,
        endDate
      )

    return {
      hasError: false,
      errors: {},
      meterWithTimezonesAndProfiles,
    }
  } catch (error) {
    const errors = handleHttpErrors(error)

    return {
      hasError: true,
      errors,
      meterWithTimezonesAndProfiles: [],
    }
  }
}
