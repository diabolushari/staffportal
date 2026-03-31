import { Badge } from '@/components/ui/badge'
import { MeterProfileParameter, MeterReadingValue } from '@/interfaces/data_interfaces'
import { useMemo } from 'react'

interface Props {
  readings: MeterReadingValue[]
}

export default function MeterReadingTable({ readings }: Readonly<Props>) {
  const profiles = useMemo(() => {
    const result: MeterProfileParameter[] = []
    readings.forEach((reading) => {
      if (
        result.find(
          (r) => r.meter_parameter_id === reading.meter_profile_parameter?.meter_parameter_id
        ) == null &&
        reading.meter_profile_parameter != null
      ) {
        result.push(reading.meter_profile_parameter)
      }
    })

    return result
  }, [readings])

  return (
    <>
      {profiles.map((profile) => (
        <div
          key={profile.meter_parameter_id.toString()}
          className='mb-4'
        >
          <div className='flex items-center gap-2'>
            <h3 className='mb-2 text-lg font-semibold'>{profile.display_name}</h3>
            <Badge variant='secondary'>{profile.is_export ? 'Export' : 'Import'}</Badge>
          </div>
          <table className='w-full table-auto border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border px-4 py-2 text-left'>Timezone</th>
                {profile.is_cumulative && <th className='border px-4 py-2 text-left'>Initial</th>}
                {profile.is_cumulative && <th className='border px-4 py-2 text-left'>Final</th>}
                <th className='border px-4 py-2 text-left'>
                  {profile.is_cumulative ? 'Diff' : 'Reading'}
                </th>
                <th className='border px-4 py-2 text-left'>
                  {profile.is_cumulative ? 'Diff X MF' : 'Reading X MF'}
                </th>
              </tr>
            </thead>
            <tbody>
              {readings
                .filter(
                  (reading) =>
                    reading.meter_profile_parameter?.meter_parameter_id ===
                    profile.meter_parameter_id
                )
                .map((reading: MeterReadingValue) => (
                  <tr key={reading.id.toString()}>
                    <td className='border px-4 py-2'>{reading.time_zone?.parameter_value}</td>
                    {profile.is_cumulative && (
                      <td className='border px-4 py-2'>{reading.initial_reading}</td>
                    )}
                    <td className='border px-4 py-2'>{reading.final_reading}</td>
                    {profile.is_cumulative && (
                      <td className='border px-4 py-2'>{reading.difference}</td>
                    )}
                    <td className='border px-4 py-2'>{reading.value}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  )
}
