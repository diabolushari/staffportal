import { Card } from '@/components/ui/card'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterValues } from '@/interfaces/parameter_types'
import StrongText from '@/typography/StrongText'
import Button from '@/ui/button/Button'
import Datepicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import RadioGroup from '@/ui/form/RadioGroup'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'

interface Props {
  connection_id: number
  meterHealthTypes: ParameterValues[]
  ctptHealthTypes: ParameterValues[]
  anomalyTypes: ParameterValues[]
}

export default function MeterReadingForm({
  connection_id,
  meterHealthTypes,
  ctptHealthTypes,
  anomalyTypes,
}: Props) {
  const { formData, setFormValue } = useCustomForm({
    connection_id: connection_id,
    normal_pf: '',
    peak_pf: '',
    offpeak_pf: '',
    average_power_factor: '',
    reading_type: '',
    anomaly_id: '',
    metering_date: '',
    reading_start_date: '',
    reading_end_date: '',
    meter_health_id: '',
    ctpt_health_id: '',
    voltage_r: '',
    voltage_b: '',
    voltage_y: '',
    current_r: '',
    current_b: '',
    current_y: '',
    remarks: '',
  })
  
  const { post, errors } = useInertiaPost<typeof formData>(route('meter-reading.store'))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }
  return (
    <Card className='rounded-lg p-7'>
      <div className='mb-6 flex items-center justify-between'>
        <StrongText className='text-base font-semibold text-[#252c32]'>
          Meter Reading Details
        </StrongText>
      </div>
      <hr className='mb-6 border-[#e5e9eb]' />
      <form
        className='flex flex-col gap-6'
        onSubmit={handleSubmit}
      >
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <Input
            label='Normal PF'
            value={formData.normal_pf}
            setValue={setFormValue('normal_pf')}
            type='number'
            error={errors.normal_pf}
          />
          <Input
            label='Peak PF'
            value={formData.peak_pf}
            setValue={setFormValue('peak_pf')}
            type='number'
            error={errors.peak_pf}
          />
          <Input
            label='Offpeak PF'
            value={formData.offpeak_pf}
            setValue={setFormValue('offpeak_pf')}
            type='number'
            error={errors.offpeak_pf}
          />
          <Input
            label='Average Power Factor'
            value={formData.average_power_factor}
            setValue={setFormValue('average_power_factor')}
            type='number'
            error={errors.average_power_factor}
          />
          <RadioGroup
            label='Reading Type'
            list={[
              { id: 'single_reading', label: 'Single Reading' },
              { id: 'multiple_reading', label: 'Multiple Reading' },
            ]}
            dataKey='id'
            displayKey='label'
            setValue={setFormValue('reading_type')}
            value={formData.reading_type}
            error={errors.reading_type}
          />

          <SelectList
            label='Anomaly'
            list={anomalyTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('anomaly_id')}
            value={formData.anomaly_id}
            error={errors.anomaly_id}
          />
          <Datepicker
            label='Metering Date'
            value={formData.metering_date}
            setValue={setFormValue('metering_date')}
            error={errors.metering_date}
          />
          <Datepicker
            label='Reading Start Date'
            value={formData.reading_start_date}
            setValue={setFormValue('reading_start_date')}
            error={errors.reading_start_date}
          />
          <Datepicker
            label='Reading End Date'
            value={formData.reading_end_date}
            setValue={setFormValue('reading_end_date')}
            error={errors.reading_end_date}
          />
          <SelectList
            label='Meter Health'
            list={meterHealthTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('meter_health_id')}
            value={formData.meter_health_id}
            error={errors.meter_health_id}
          />
          <SelectList
            label='CTPT Health'
            list={ctptHealthTypes}
            dataKey='id'
            displayKey='parameter_value'
            setValue={setFormValue('ctpt_health_id')}
            value={formData.ctpt_health_id}
            error={errors.ctpt_health_id}
          />
          <TextArea
            label='Remarks'
            value={formData.remarks}
            setValue={setFormValue('remarks')}
            error={errors.remarks}
            required
          />
          <Input
            label='Voltage R'
            value={formData.voltage_r}
            setValue={setFormValue('voltage_r')}
            type='number'
            error={errors.voltage_r}
          />
          <Input
            label='Voltage B'
            value={formData.voltage_b}
            setValue={setFormValue('voltage_b')}
            type='number'
            error={errors.voltage_b}
          />
          <Input
            label='Voltage Y'
            value={formData.voltage_y}
            setValue={setFormValue('voltage_y')}
            type='number'
            error={errors.voltage_y}
          />
          <Input
            label='Current R'
            value={formData.current_r}
            setValue={setFormValue('current_r')}
            type='number'
            error={errors.current_r}
          />
          <Input
            label='Current B'
            value={formData.current_b}
            setValue={setFormValue('current_b')}
            type='number'
            error={errors.current_b}
          />
          <Input
            label='Current Y'
            value={formData.current_y}
            setValue={setFormValue('current_y')}
            type='number'
            error={errors.current_y}
          />
        </div>
        <div className='flex justify-end'>
          <Button
            label='Submit'
            type='submit'
          />
        </div>
      </form>
    </Card>
  )
}
