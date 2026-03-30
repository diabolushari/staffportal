import ActionButton from '@/components/action-button'
import { ParameterDomain } from '@/interfaces/parameter_types'
import { router } from '@inertiajs/react'
import { Layers, FileText } from 'lucide-react'

interface Props {
  domains: ParameterDomain[]
  onEdit: (domain: ParameterDomain) => void
  onDelete: (domain: ParameterDomain) => void
  onView?: (domain: ParameterDomain) => void
}

export default function ParameterDomainList({ domains, onEdit, onDelete }: Readonly<Props>) {
  const handleDomainClick = (domain: ParameterDomain) => {
    if (!onEdit && !onDelete) {
      router.get(route('parameter-domains.show', domain.id)) // fallback navigation
    }
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {domains.map((domain) => (
          <div
            key={domain.id}
            className='mb-4 rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
          >
            <div className='flex items-start justify-between'>
              {/* Main Info */}
              <div
                className='flex flex-1 cursor-pointer flex-col gap-2.5 p-[10px]'
                onClick={() => handleDomainClick(domain)}
              >
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <div className='font-inter text-base leading-normal font-semibold text-black'>
                      {domain.domain_name}
                    </div>
                    {domain.domain_code && (
                      <div className='rounded-[50px] bg-blue-100 px-2.5 py-px'>
                        <div className='font-inter text-xs leading-6 font-normal tracking-[-0.072px] text-blue-800'>
                          {domain.domain_code}
                        </div>
                      </div>
                    )}
                  </div>

                  {domain.description && (
                    <div className='flex items-center gap-[3px]'>
                      <FileText className='text-dark-gray h-3.5 w-3.5' />
                      <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                        {domain.description}
                      </div>
                    </div>
                  )}

                  {domain.managed_by_module_name && (
                    <div className='flex items-center gap-[3px]'>
                      <Layers className='text-dark-gray h-3.5 w-3.5' />
                      <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                        Managed by: {domain.managed_by_module_name}
                      </div>
                    </div>
                  )}

                  {domain.system_module?.name && (
                    <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                      Module: <b>{domain.system_module.name}</b>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                <div className='mb-2 rounded-[50px] bg-slate-100 px-2.5 py-px'></div>
                <div className='flex items-center gap-3'>
                  <ActionButton
                    onEdit={() => onEdit(domain)}
                    onDelete={() => onDelete(domain)}
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
