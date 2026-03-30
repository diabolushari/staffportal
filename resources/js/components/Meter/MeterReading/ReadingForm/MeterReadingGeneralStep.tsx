import { getMetersWithTimezonesAndProfiles } from '@/components/Meter/MeterReading/ReadingForm/meter-reading-helpers'
import { getLastDayOfMonth } from '@/components/Meter/MeterReading/valdiations/meter-reading-validation-helpers'
import Field from '@/components/ui/field'
import {
  ConsumerData,
  MeterConnectionMapping,
  MeterReadingValueGroup,
  MeterWithTimezoneAndProfile,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { MeterReadingForm } from '@/pages/MeterReading/MeterReadingCreatePage'
import ErrorText from '@/typography/ErrorText'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import Datepicker from '@/ui/form/DatePicker'
import SelectList from '@/ui/form/SelectList'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { ConnectionDetailTooltip } from '../ConnectionDetailTooltip'

interface Props {
  connectionWithConsumer: ConsumerData
  editMode: boolean
  formData: MeterReadingForm
  setFormValue: <K extends keyof MeterReadingForm>(key: K) => (value: MeterReadingForm[K]) => void
  toggleBoolean: (key: keyof MeterReadingForm) => () => void
  errors?: Record<string, string | undefined>
  latestMeterReadings?: MeterReadingValueGroup[]
  interimReasons: ParameterValues[]
  meterConnectionMappings: MeterConnectionMapping[]
  onMetersWithTimezonesAndProfilesChange: (meters: MeterWithTimezoneAndProfile[]) => void
  setActiveStep: (step: number) => void
}

interface MeterRow {
  meter_id: number
  meter_serial: string
  next_reading_date: string | null
  is_first_reading_flag: boolean
  checked: boolean
}

export default function MeterReadingGeneralStep({
  connectionWithConsumer,
  editMode,
  formData,
  setFormValue,
  toggleBoolean,
  errors,
  latestMeterReadings,
  interimReasons,
  meterConnectionMappings,
  onMetersWithTimezonesAndProfilesChange,
  setActiveStep,
}: Readonly<Props>) {
  const maxDate = dayjs().format('DD-MM-YYYY')
  const maxDateForReadingStartDate = dayjs(maxDate).subtract(1, 'day').format('DD-MM-YYYY')
  const [meterCheckList, setMeterCheckList] = useState<MeterRow[]>([])
  const [validationInProgress, setValidationInProgress] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})

  useEffect(() => {
    let dateOfFirstMeter: string | null = null

    const availableRows =
      latestMeterReadings
        ?.filter((latestMeterReading) => latestMeterReading?.meter != null)
        .map((latestMeterReading, index) => {
          const isFirstReading = latestMeterReading?.reading == null
          let nextReadingDate: string | null = null

          if (isFirstReading) {
            nextReadingDate =
              latestMeterReading?.current_meter_connection_mapping?.energise_date ?? null
          } else {
            const readingStartDate =
              latestMeterReading.reading?.reading_end_date == null
                ? null
                : dayjs(latestMeterReading.reading?.reading_end_date)
            nextReadingDate = latestMeterReading.is_first_reading
              ? (readingStartDate?.format('YYYY-MM-DD') ?? null)
              : (readingStartDate?.add(1, 'day').format('YYYY-MM-DD') ?? null)
          }

          if (index === 0) {
            dateOfFirstMeter = nextReadingDate
          }

          return {
            meter_id: latestMeterReading.meter.meter_id,
            meter_serial: latestMeterReading.meter.meter_serial,
            next_reading_date: nextReadingDate,
            is_first_reading_flag: isFirstReading,
            checked: dateOfFirstMeter === nextReadingDate,
          }
        }) ?? []

    setMeterCheckList(availableRows)
  }, [latestMeterReadings, meterConnectionMappings])

  const isFirstReading = useMemo(() => {
    return meterCheckList
      .filter((row) => row.checked)
      .some((row) => {
        return row?.is_first_reading_flag
      })
  }, [meterCheckList])

  useEffect(() => {
    const readingStartDate =
      meterCheckList.find((meterRow) => meterRow.checked)?.next_reading_date ?? null

    if (readingStartDate == null) {
      setFormValue('reading_start_date')('')
      setFormValue('reading_end_date')('')
      return
    }

    if (isFirstReading) {
      setFormValue('reading_start_date')(readingStartDate)
      setFormValue('reading_end_date')(readingStartDate)
    }
    if (!isFirstReading) {
      setFormValue('reading_start_date')(readingStartDate)
      setFormValue('reading_end_date')(getLastDayOfMonth(readingStartDate))
    }
  }, [isFirstReading, meterCheckList, setFormValue])

  const handleMeterSelection = (meterId: number): void => {
    setMeterCheckList((oldValues) => {
      const checkedMeter = oldValues.find((row) => row.meter_id === meterId)
      const currentNextReadingDate = checkedMeter?.next_reading_date

      return oldValues.map((row) => {
        if (row.meter_id === meterId && row.checked) {
          return { ...row, checked: false }
        }

        if (row.meter_id === meterId && row.next_reading_date == currentNextReadingDate) {
          return { ...row, checked: true }
        }

        return row
      })
    })
  }

  const handleValidate = async (): Promise<void> => {
    setValidationInProgress(true)
    const { hasError, errors, meterWithTimezonesAndProfiles } =
      await getMetersWithTimezonesAndProfiles({
        connectionId: formData.connection_id,
        meterIds: meterCheckList.filter((row) => row.checked).map((row) => row.meter_id),
        startDate: formData.reading_start_date ?? null,
        endDate: formData.reading_end_date ?? null,
        latestMeterReadings,
        meterConnectionMappings,
      })
    setValidationInProgress(false)

    if (hasError) {
      setValidationErrors(errors)
      return
    }

    onMetersWithTimezonesAndProfilesChange(meterWithTimezonesAndProfiles)
    setActiveStep(1)
  }

  return (
    <>
      <div className='mb-6 flex items-center justify-between'>
        <StrongText className='text-base font-semibold text-[#252c32]'>
          Organization: {connectionWithConsumer?.consumer?.organization_name}
        </StrongText>
      </div>
      <hr className='mb-6 border-[#e5e9eb]' />
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <Field
          label='Tariff'
          value={connectionWithConsumer?.connection?.tariff?.parameter_value}
        />
        <Field
          label='Purpose'
          value={connectionWithConsumer?.connection?.primary_purpose?.parameter_value}
        />
        <ConnectionDetailTooltip connectionWithConsumer={connectionWithConsumer} />

        <div className='col-span-3'>
          <div className='grid gap-4 md:grid-cols-2'>
            <CheckBox
              label='Interim Reading'
              toggleValue={toggleBoolean('is_interim_reading')}
              value={formData.is_interim_reading}
              error={errors?.is_interim_reading}
            />
            {!editMode && (
              <CheckBox
                label='Use For Billing'
                toggleValue={toggleBoolean('is_billable')}
                value={formData.is_billable ?? true}
                error={errors?.is_billable}
              />
            )}
            {formData.is_interim_reading && (
              <SelectList
                label='Interim Reason'
                list={interimReasons}
                dataKey='id'
                displayKey='parameter_value'
                setValue={setFormValue('interim_reason_id')}
                value={formData?.interim_reason_id}
                error={errors?.interim_reason_id}
              />
            )}

            <div className='col-span-2'>
              <div className='mb-2 text-sm font-medium text-[#252c32]'>Meters</div>
              <ErrorText>
                {validationErrors['meter_ids'] ?? validationErrors['connection_id']}
              </ErrorText>
              <div className='mb-2 text-xs text-[#5f6d79]'>
                Only meters with the same next reading date can be selected together.
              </div>
              <div className='grid gap-3'>
                {meterCheckList?.map((checkListItem) => {
                  return (
                    <label
                      key={checkListItem.meter_id}
                      className={`flex items-start gap-3 rounded-lg border border-[#e5e9eb] p-3 ${'cursor-pointer'}`}
                    >
                      <input
                        type='checkbox'
                        checked={checkListItem.checked}
                        onChange={() => handleMeterSelection(checkListItem.meter_id)}
                        className='mt-1 h-4 w-4'
                      />
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium text-[#252c32]'>
                          Meter Serial: {checkListItem.meter_serial}
                        </span>
                        <span className='text-xs text-[#5f6d79]'>
                          Next Reading On :{' '}
                          {checkListItem.next_reading_date != null
                            ? dayjs(checkListItem.next_reading_date).format('DD-MM-YYYY')
                            : '-'}
                        </span>
                        {checkListItem.is_first_reading_flag && (
                          <span className='text-xs text-[#5f6d79]'>First Reading</span>
                        )}
                        <ErrorText>
                          {validationErrors[`meters.${checkListItem.meter_id}`]}
                        </ErrorText>
                      </div>
                    </label>
                  )
                })}

                {(!meterCheckList || meterCheckList.length === 0) && (
                  <div className='rounded-lg border border-dashed border-[#d8dde0] p-3 text-sm text-[#5f6d79]'>
                    No meters available
                  </div>
                )}
              </div>
            </div>

            <div className='col-span-2 grid md:grid-cols-2'>
              <Datepicker
                label='Meter Reading Date'
                value={formData?.metering_date}
                setValue={setFormValue('metering_date')}
                error={errors?.metering_date}
                max={maxDate}
              />
            </div>

            <Datepicker
              label='Billing Period Start'
              value={formData.reading_start_date}
              setValue={(value) => {
                setFormValue('reading_start_date')(value)
                if (isFirstReading) {
                  setFormValue('reading_end_date')(value)
                }
              }}
              error={errors?.reading_start_date ?? validationErrors['start_date']}
              disabled={true}
              max={maxDateForReadingStartDate}
            />
            <Datepicker
              label='Billing Period End'
              value={formData.reading_end_date}
              setValue={setFormValue('reading_end_date')}
              error={errors?.reading_end_date ?? validationErrors['end_date']}
              disabled={!formData.is_interim_reading}
              max={maxDate}
            />
            <div className='col-span-2 flex justify-end'>
              <Button
                type='button'
                label='Validate & Continue'
                onClick={handleValidate}
                processing={validationInProgress}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
