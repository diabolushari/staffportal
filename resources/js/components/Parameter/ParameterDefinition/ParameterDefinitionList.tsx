import ActionButton from '@/components/action-button'
import { ParameterDefinition } from '@/interfaces/parameter_types'
import StrongText from '@/typography/StrongText'
import { Layers, Package } from 'lucide-react'

interface Props {
  parameterDefinitions: ParameterDefinition[]
  onView?: (item: ParameterDefinition) => void
  onEdit: (item: ParameterDefinition) => void
  onDelete: (item: ParameterDefinition) => void
}

export default function ParameterDefinitionList({
  parameterDefinitions,
  onView,
  onEdit,
  onDelete,
}: Readonly<Props>) {
  return (
    <div className='relative w-full rounded-lg bg-white pt-5'>
      <div className='flex flex-col px-7 pb-7'>
        {parameterDefinitions.map((def) => (
          <div
            key={def.id}
            className='mb-4 rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
          >
            <div className='flex items-start justify-between'>
              {/* Left section - main info */}
              <div
                className='flex flex-1 cursor-pointer flex-col gap-2.5 p-[10px]'
                onClick={() => onView?.(def)}
              >
                <div className='flex flex-col gap-1'>
                  {/* Parameter name + domain pill */}
                  <div className='flex items-center gap-2'>
                    <div className='font-inter text-base leading-normal font-semibold text-black'>
                      {def.parameter_name}
                    </div>
                    {def.domain && (
                      <div className='rounded-[50px] bg-blue-100 px-2.5 py-px'>
                        <div className='font-inter text-xs leading-6 font-normal tracking-[-0.072px] text-blue-800'>
                          {def.domain.domain_name}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Domain + Module row */}
                  <div className='flex w-full items-center gap-5'>
                    {def.domain?.domain_name && (
                      <div className='flex items-center gap-[3px]'>
                        <Layers className='text-dark-gray h-3.5 w-3.5' />
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          Domain: <StrongText>{def.domain.domain_name}</StrongText>
                        </div>
                      </div>
                    )}
                    {def.system_module?.name && (
                      <div className='flex items-center gap-[3px]'>
                        <Package className='text-dark-gray h-3.5 w-3.5' />
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          Module: <StrongText>{def.system_module.name}</StrongText>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Attributes */}
                  {(def.attribute1_name ||
                    def.attribute2_name ||
                    def.attribute3_name ||
                    def.attribute4_name ||
                    def.attribute5_name) && (
                    <div className='mt-2'>
                      <StrongText>Attributes</StrongText>
                      <div className='text-dark-gray flex flex-wrap gap-2 text-sm'>
                        {def.attribute1_name && <span>{def.attribute1_name}</span>}
                        {def.attribute2_name && <span>{def.attribute2_name}</span>}
                        {def.attribute3_name && <span>{def.attribute3_name}</span>}
                        {def.attribute4_name && <span>{def.attribute4_name}</span>}
                        {def.attribute5_name && <span>{def.attribute5_name}</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right section - actions */}
              <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                <div className='mt-2 flex items-center gap-3'>
                  {/* {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(def)
                      }}
                      className='flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800'
                    >
                      <Pencil className='h-4 w-4' />
                      Edit
                    </button>
                  )} */}
                  <ActionButton
                    onDelete={() => onDelete(def)}
                    onEdit={() => onEdit(def)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
