import { Card } from '@/components/ui/card'
import useFetchRecord from '@/hooks/useFetchRecord'
import { Connection, SdRegister } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import { getDisplayDate } from '@/utils'
import { getAssessmentYear } from './LastAssessmentCard'
import Pagination from '@/ui/Pagination/Pagination'
import useCustomForm from '@/hooks/useCustomForm'
import Datepicker from '@/ui/form/DatePicker'
import { ChargeHeadDefinition } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import SelectList from '@/ui/form/SelectList'
import { Button } from '@/components/ui/button'

interface Props {
  connection: Connection
  sdTypes: ChargeHeadDefinition[]
  occupancyTypes: ParameterValues[]
  page?: number
  pageSize?: number
  selectedSdRegister: SdRegister | null
  setSelectedSdRegister: (sdRegister: SdRegister) => void
  sheetAction: (open: boolean) => void
}

const SdRegisterListByConnection = ({
  connection,
  sdTypes,
  occupancyTypes,
  page,
  pageSize,
  selectedSdRegister,
  setSelectedSdRegister,
  sheetAction,
}: Props) => {
  const { formData, setFormValue } = useCustomForm({
    sd_type_id: '',
    occupancy_type_id: '',
    period_from: '',
    period_to: '',
    page: page,
    page_size: pageSize,
  })

  const sdRegister = useFetchRecord<Paginator<SdRegister>>(
    route('sd-register-by-connection', {
      connectionId: connection.connection_id,
      ...formData,
    })
  )

  const formDataExist =
    formData.sd_type_id || formData.occupancy_type_id || formData.period_from || formData.period_to
  return (
    <>
      <div className='mr-auto flex font-semibold'>SD Register</div>
      <form>
        <div className='grid grid-cols-3 gap-4'>
          <div className='col-span-1'>
            <SelectList
              allOptionText='All SD Types'
              showAllOption
              value={formData.sd_type_id}
              setValue={setFormValue('sd_type_id')}
              list={sdTypes}
              dataKey='charge_head_definition_id'
              displayKey='name'
            />
          </div>
          <div className='col-span-1'>
            <SelectList
              allOptionText='All Occupancy Types'
              showAllOption
              value={formData.occupancy_type_id}
              setValue={setFormValue('occupancy_type_id')}
              list={occupancyTypes}
              dataKey='id'
              displayKey='parameter_value'
            />
          </div>
          <div></div>
          <div className='col-span-1'>
            <Datepicker
              placeholder='Period From'
              value={formData.period_from}
              setValue={setFormValue('period_from')}
            />
          </div>
          <div className='col-span-1'>
            <Datepicker
              placeholder='Period To'
              value={formData.period_to}
              setValue={setFormValue('period_to')}
            />
          </div>
        </div>
        {formDataExist && (
          <Button
            onClick={() => {
              setFormValue('sd_type_id')('')
              setFormValue('occupancy_type_id')('')
              setFormValue('period_from')('')
              setFormValue('period_to')('')
            }}
            variant={'link'}
          >
            Clear Filters
          </Button>
        )}
      </form>
      <Card className='rounded-2xl border bg-white p-5 shadow-sm'>
        <div className='space-y-4'>
          <div className='bg-kseb-bg-blue grid grid-cols-6 rounded-l-lg border-b p-3 text-xs font-semibold text-gray-500'>
            <span>FIN. YEAR</span>
            <span>SD TYPE</span>
            <span>OCCUPANCY</span>
            <span>SD AMOUNT</span>
            <span>ASSESSMENT DATE</span>
            <span>STATUS</span>
          </div>

          <div className='divide-y'>
            {sdRegister[0]?.data?.map((sd) => (
              <div
                key={sd.sd_register_id}
                className={`grid cursor-pointer grid-cols-6 items-center rounded-lg px-1 py-3 text-sm hover:bg-gray-50 ${selectedSdRegister?.sd_register_id === sd.sd_register_id ? 'bg-kseb-bg-blue' : ''}`}
                onClick={() => {
                  setSelectedSdRegister(sd)
                  sheetAction(true)
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }}
              >
                <span className='font-medium text-gray-700'>{getAssessmentYear(sd)}</span>

                <span className='text-gray-600'>{sd.sd_type.name}</span>

                <span className='text-gray-600'>{sd.occupancy_type.parameter_value}</span>

                {(() => {
                  const isInterest = sd.sd_type.name?.toLowerCase().includes('interest')

                  return (
                    <span
                      className={`font-semibold ${isInterest ? 'text-red-500' : 'text-green-600'}`}
                    >
                      {isInterest ? '-' : '+'}₹{sd.sd_amount.toLocaleString()}
                    </span>
                  )
                })()}

                <span className='text-gray-500'>{getDisplayDate(sd.generated_date)}</span>

                <span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      sd.is_fully_settled
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {sd.is_fully_settled ? 'SETTLED' : 'NOT SETTLED'}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-6'>
          {sdRegister[0] && <Pagination pagination={sdRegister[0] as Paginator<SdRegister>} />}
        </div>
      </Card>
    </>
  )
}

export default SdRegisterListByConnection
