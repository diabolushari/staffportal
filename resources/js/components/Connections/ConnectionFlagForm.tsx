import FormCard from '@/ui/Card/FormCard'
import { GroupedFlags } from './useConnectionFlagForm'
import CheckBox from '@/ui/form/CheckBox'

interface Props {
  updateFlagData: (id: number, value: boolean, label: string) => void
  flagData: GroupedFlags[]
}

export default function ConnectionFlagForm({ updateFlagData, flagData }: Props) {
  return (
    <>
      {flagData.map((group) => (
        <FormCard title={group.group_name}>
          {group.flags.map((indicator) => (
            <div
              key={indicator.id}
              className='space-y-2'
            >
              <CheckBox
                label={indicator.label}
                value={indicator.value}
                toggleValue={() => updateFlagData(indicator.id, !indicator.value, indicator.label)}
              />
            </div>
          ))}
        </FormCard>
      ))}
    </>
  )
}
