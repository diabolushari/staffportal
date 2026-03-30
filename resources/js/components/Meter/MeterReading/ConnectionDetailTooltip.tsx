import Field from '@/components/ui/field'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ConsumerData } from '@/interfaces/data_interfaces'
import { InfoIcon } from 'lucide-react'

export function ConnectionDetailTooltip({
  connectionWithConsumer,
}: {
  connectionWithConsumer: ConsumerData
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <InfoIcon className='h-4 w-4' />
      </TooltipTrigger>
      <TooltipContent className='w-full bg-white'>
        <div className='grid gap-8 md:grid-cols-3'>
          <Field
            label='Year'
            value={new Date().getFullYear()}
          />
          <Field
            label='Month'
            value={new Date().toLocaleString('en-US', { month: 'long' })}
          />
          <Field
            label='Consumer number'
            value={connectionWithConsumer?.connection?.consumer_number}
          />
          <Field
            label='Industry'
            value={connectionWithConsumer?.connection?.primary_purpose?.parameter_value}
          />
          <Field
            label='Legacy Code'
            value={connectionWithConsumer?.connection?.consumer_legacy_code}
          />
          <Field
            label='Supply voltage'
            value={connectionWithConsumer?.connection?.voltage?.parameter_value}
          />
          <Field
            label='Contract Demand'
            value={connectionWithConsumer?.connection?.contract_demand_kva_val}
          />
          <Field
            label='Connected Load'
            value={connectionWithConsumer?.connection?.connected_load_kw_val}
          />
          <Field
            label='Tariff'
            value={connectionWithConsumer?.connection?.tariff?.parameter_value}
          />
          <Field
            label='Purpose'
            value={connectionWithConsumer?.connection?.primary_purpose?.parameter_value}
          />
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
