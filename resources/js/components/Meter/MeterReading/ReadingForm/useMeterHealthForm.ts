import {
  Meter,
  MeterReadingValueGroup,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { useCallback, useEffect, useState } from 'react'

export interface MeterHealthFormData {
  meter_id: number
  meter_serial: string | null
  meter_health_id?: number | null
  ctpts?: { ctpt_id: number | null; health: string; ctpt_serial: string }[]
  voltage_r: string
  voltage_y: string
  voltage_b: string
  current_r: string
  current_y: string
  current_b: string
}

const storeInitialMetersHealthData = (
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[],
  meterHealths: ParameterValues[],
  ctHealths: ParameterValues[],
  latestMeterReadings: MeterReadingValueGroup[] | null
): MeterHealthFormData[] => {
  const defaultMeterHealth = meterHealths.find((h) => h.parameter_value === 'Working')
  const defaultCTHealth = ctHealths.find((h) => h.parameter_value === 'Working')

  return metersWithTimezonesAndProfiles.map((meter) => {
    const latestMeterReadingHealth = latestMeterReadings
      ?.find((prevReadings) => prevReadings.meter.meter_id == meter.meter_id)
      ?.reading?.healths?.find((healthRecord) => healthRecord?.meter_id == meter.meter_id)

    return {
      meter_id: meter.meter_id,
      meter_health_id: defaultMeterHealth?.id ?? null,
      meter_serial: meter.meter.meter_serial,
      ctpts: meter.meter.transformers.map((ctpt) => {
        return {
          ctpt_id: ctpt.ctpt?.meter_ctpt_id ?? null,
          health: defaultCTHealth?.id?.toString() ?? '',
          ctpt_serial: ctpt.ctpt?.ctpt_serial ?? '',
        }
      }),
      voltage_r: latestMeterReadingHealth?.voltage_r.toFixed(2) ?? '0',
      voltage_y: latestMeterReadingHealth?.voltage_y.toFixed(2) ?? '0',
      voltage_b: latestMeterReadingHealth?.voltage_b.toFixed(2) ?? '0',
      current_r: latestMeterReadingHealth?.current_r.toFixed(2) ?? '0',
      current_y: latestMeterReadingHealth?.current_y.toFixed(2) ?? '0',
      current_b: latestMeterReadingHealth?.current_b.toFixed(2) ?? '0',
    }
  })
}

export default function useMeterHealthForm(
  metersWithTimezonesAndProfiles: MeterWithTimezoneAndProfile[],
  meterHealths: ParameterValues[],
  ctHealths: ParameterValues[],
  latestMeterReading: MeterReadingValueGroup[] | null
) {
  const [healthData, setHealthData] = useState<MeterHealthFormData[]>([])

  useEffect(() => {
    setHealthData(
      storeInitialMetersHealthData(
        metersWithTimezonesAndProfiles,
        meterHealths,
        ctHealths,
        latestMeterReading
      )
    )
  }, [metersWithTimezonesAndProfiles, meterHealths, ctHealths, latestMeterReading])

  const updateMeterHealth = useCallback((statusId: number, meter: Meter) => {
    setHealthData((oldValue) =>
      oldValue.map((item) =>
        item.meter_id === meter.meter_id ? { ...item, meter_health_id: statusId } : item
      )
    )
  }, [])

  const updateCTPTHealth = useCallback((meterId: number, ctptId: number, statusId: string) => {
    setHealthData((oldValue) => {
      return oldValue.map((item) => {
        if (item.meter_id !== meterId) {
          return item
        }
        const ctpts = item.ctpts?.map((c) =>
          c.ctpt_id === ctptId ? { ...c, health: statusId } : c
        )
        return {
          ...item,
          ctpts,
        }
      })
    })
  }, [])

  const updateRybValues = useCallback(
    (
      meterId: number,
      value: number | string,
      type: 'voltage_r' | 'voltage_y' | 'voltage_b' | 'current_r' | 'current_y' | 'current_b'
    ) => {
      setHealthData((oldValue) =>
        oldValue.map((item) => (item.meter_id === meterId ? { ...item, [type]: value } : item))
      )
    },
    []
  )

  return { healthData, updateMeterHealth, updateCTPTHealth, updateRybValues }
}
