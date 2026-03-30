import { Meter, MeterProfileParameter } from '@/interfaces/data_interfaces'
import ErrorText from '@/typography/ErrorText'
import WarningText from '@/typography/WarningText'
import Input from '@/ui/form/Input'
import { TimezoneReadingState } from './ReadingForm/useMeterReadingForm'

interface Props {
  parameterReadingValues: TimezoneReadingState[]
  onChange: (tzId: number, value: string) => void
  meter: Meter
  profileParameter: MeterProfileParameter
  onToggleRotation: (tzId: number) => void
  errors: Record<string, string | undefined>
  maxReadingValue: number
  isFirstReading: boolean
  updateInitialReading: (tzId: number, value: string) => void
  mf: number
  warnings: Record<string, string | undefined>
}

export default function MeterReadingValueForm({
  parameterReadingValues,
  onChange,
  meter,
  profileParameter,
  onToggleRotation,
  maxReadingValue,
  isFirstReading,
  errors,
  updateInitialReading,
  mf,
  warnings,
}: Readonly<Props>) {
  return (
    <div className='rounded border bg-white p-4'>
      <div
        className='grid overflow-hidden rounded-md'
        style={{
          gridTemplateColumns: `200px repeat(${parameterReadingValues?.length || 0}, minmax(0, 1fr))`,
        }}
      >
        {/* Header */}
        <div className='border-b p-2 text-sm font-medium'></div>
        {parameterReadingValues?.map((tz) => (
          <div
            key={tz.timezone_id}
            className='border-b p-2 text-center text-sm font-medium'
          >
            {tz.timezone_name}
          </div>
        ))}

        {/* Initial */}
        {profileParameter.is_cumulative && (
          <>
            <div className='border-b p-2 text-sm font-medium'>Initial</div>
            {parameterReadingValues?.map((tz) => (
              <div
                key={tz.timezone_id}
                className='border-b p-2'
              >
                <Input
                  type='number'
                  value={tz.values.initial}
                  setValue={(value) => updateInitialReading(tz.timezone_id, value)}
                  max={maxReadingValue}
                  disabled={!isFirstReading}
                  min={0}
                  step='any'
                />
                {errors?.[`${tz.timezone_id}.initial`] && (
                  <ErrorText>{errors[`${tz.timezone_id}.initial`]}</ErrorText>
                )}
                {warnings?.[`${tz.timezone_id}.initial`] && (
                  <WarningText>{warnings[`${tz.timezone_id}.initial`]}</WarningText>
                )}
              </div>
            ))}
          </>
        )}

        {/* Rotation (compact) */}
        {profileParameter.is_cumulative && (
          <>
            <div className='text-muted-foreground border-b p-2 text-xs font-medium'>Rotation</div>
            {parameterReadingValues.map((tz) => (
              <div
                key={tz.timezone_id}
                className='flex items-center justify-start border-b p-2'
              >
                <input
                  type='checkbox'
                  className='h-3 w-3'
                  checked={tz.isRotation}
                  onChange={() => onToggleRotation(tz.timezone_id)}
                  disabled={isFirstReading}
                />
              </div>
            ))}
          </>
        )}

        {/* Final / Reading */}
        <div className='border-b p-2 text-sm font-medium'>
          {profileParameter.is_cumulative ? 'Final' : 'Reading'}
        </div>
        {parameterReadingValues?.map((tz) => (
          <div
            key={tz.timezone_id}
            className='border-b p-2'
          >
            <Input
              type='number'
              value={tz.values.final}
              setValue={(val) => onChange(tz.timezone_id, val)}
              max={maxReadingValue}
              disabled={isFirstReading && profileParameter.is_cumulative}
              min={0}
              step='any'
            />
            {errors?.[`${tz.timezone_id}.final`] && (
              <ErrorText>{errors[`${tz.timezone_id}.final`]}</ErrorText>
            )}
            {warnings?.[`${tz.timezone_id}.final`] && (
              <WarningText>{warnings[`${tz.timezone_id}.final`]}</WarningText>
            )}
          </div>
        ))}

        {/* Diff */}
        {profileParameter.is_cumulative && (
          <>
            <div className='border-b p-2 text-sm font-medium'>Diff</div>
            {parameterReadingValues?.map((tz) => (
              <div
                key={tz.timezone_id}
                className='border-b p-2'
              >
                <Input
                  type='number'
                  value={tz.values.diff}
                  disabled
                  min={0}
                  setValue={() => {}}
                  error={errors?.[`${tz.timezone_id}.diff`]}
                  step='any'
                />
                {warnings?.[`${tz.timezone_id}.diff`] && (
                  <WarningText>{warnings[`${tz.timezone_id}.diff`]}</WarningText>
                )}
              </div>
            ))}
          </>
        )}

        {/* Import / Export */}
        <div className='p-2 text-sm font-medium'>
          {profileParameter.is_export ? 'Export' : 'Import'} (MF: {mf})
        </div>
        {parameterReadingValues?.map((tz) => (
          <div
            key={tz.timezone_id}
            className='p-2'
          >
            <Input
              type='number'
              value={tz.values.value}
              disabled
              min={0}
              setValue={() => {}}
              error={errors?.[`${tz.timezone_id}.value`]}
              step='any'
            />
          </div>
        ))}
      </div>
    </div>
  )
}
