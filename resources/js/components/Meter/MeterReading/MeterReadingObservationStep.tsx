import { ParameterValues } from '@/interfaces/parameter_types'
import { MeterReadingForm } from '@/pages/MeterReading/MeterReadingCreatePage'
import NormalText from '@/typography/NormalText'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'
import { MeterHealthFormData } from './ReadingForm/useMeterHealthForm'

interface Props {
  setActiveStep: (step: number) => void
  formData: MeterReadingForm
  setFormValue: <K extends keyof MeterReadingForm>(key: K) => (value: MeterReadingForm[K]) => void
  anomalyTypes: ParameterValues[]
  errors?: Record<string, string | undefined>
  meterHealthData: MeterHealthFormData[]
  updateRybValues: (
    meterId: number,
    value: number | string,
    type: 'voltage_r' | 'voltage_y' | 'voltage_b' | 'current_r' | 'current_y' | 'current_b'
  ) => void
}

export default function MeterReadingObservationStep({
  setActiveStep,
  formData,
  setFormValue,
  anomalyTypes,
  errors,
  meterHealthData,
  updateRybValues,
}: Readonly<Props>) {
  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='grid gap-4 md:grid-cols-2'>
        <SelectList
          label='Anomaly'
          list={anomalyTypes}
          dataKey='id'
          displayKey='parameter_value'
          setValue={setFormValue('anomaly_id')}
          value={formData.anomaly_id}
          error={errors?.anomaly_id}
        />
      </div>

      {meterHealthData.map((meter) => (
        <div
          className='border p-4'
          key={meter.meter_id.toString()}
        >
          <NormalText>Meter #{meter.meter_serial}</NormalText>
          <div className='grid gap-4 md:grid-cols-3'>
            <Input
              key={meter.meter_id}
              label='Voltage R (kV)'
              value={meter.voltage_r}
              setValue={(value) => updateRybValues(meter.meter_id, value, 'voltage_r')}
              type='number'
              error={errors?.voltage_r}
            />
            <Input
              label='Voltage Y (kV)'
              value={meter.voltage_y}
              setValue={(value) => updateRybValues(meter.meter_id, value, 'voltage_y')}
              type='number'
              error={errors?.voltage_y}
            />
            <Input
              label='Voltage B (kV)'
              value={meter.voltage_b}
              setValue={(value) => updateRybValues(meter.meter_id, value, 'voltage_b')}
              type='number'
              error={errors?.voltage_b}
            />

            <Input
              label='Current R (A)'
              value={meter.current_r}
              setValue={(value) => updateRybValues(meter.meter_id, value, 'current_r')}
              type='number'
              error={errors?.current_r}
            />
            <Input
              label='Current Y (A)'
              value={meter.current_y}
              setValue={(value) => updateRybValues(meter.meter_id, value, 'current_y')}
              type='number'
              error={errors?.current_y}
            />
            <Input
              label='Current B (A)'
              value={meter.current_b}
              setValue={(value) => updateRybValues(meter.meter_id, value, 'current_b')}
              type='number'
              error={errors?.current_b}
            />
          </div>
        </div>
      ))}

      <TextArea
        label='Remarks'
        value={formData.remarks}
        setValue={setFormValue('remarks')}
        error={errors?.remarks}
      />
      <div className='flex justify-between gap-5'>
        <Button
          variant='secondary'
          label='Change Meters/Dates'
          onClick={() => setActiveStep(0)}
        />
        <Button
          label='Enter Meter Readings'
          onClick={() => setActiveStep(2)}
        />
      </div>
    </div>
  )
}
