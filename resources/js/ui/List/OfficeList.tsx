import { Office } from '@/interfaces/data_interfaces'
import { router } from '@inertiajs/react'
import { Building, MapPin } from 'lucide-react'

interface Props {
  offices: Office[]
}

export default function OfficeList({ offices }: Readonly<Props>) {
  const handleOfficeClick = (office: Office) => {
    router.get(route('offices.show', office.office_id))
  }
  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {offices?.map((office, index) => (
          <div
            key={office.office_id}
            onClick={() => {
              handleOfficeClick(office)
            }}
            className='mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
          >
            <div className='flex items-start justify-between'>
              <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <div className='font-inter text-base leading-normal font-semibold text-black'>
                      {office.office_name}
                    </div>
                    <div className='rounded-[50px] bg-blue-100 px-2.5 py-px'>
                      <div className='font-inter text-xs leading-6 font-normal tracking-[-0.072px] text-blue-800'>
                        {office.office_code}
                      </div>
                    </div>
                  </div>
                  <div className='flex w-full items-center gap-5'>
                    <div className='flex items-center gap-[3px]'>
                      <Building className='text-dark-gray h-3.5 w-3.5' />
                      <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                        {office.office_type.parameter_value}
                      </div>
                    </div>
                    {office.location?.name && (
                      <div className='flex items-center gap-[3px]'>
                        <MapPin className='text-dark-gray h-3.5 w-3.5' />
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          {office.location.name}
                        </div>
                      </div>
                    )}
                  </div>
                  {office.office_address?.address && (
                    <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                      {office.office_address.address}
                    </div>
                  )}
                </div>
              </div>
              <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                <div
                  className={`rounded-[50px] px-2.5 py-px ${
                    office.is_current ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <div
                    className={`font-inter text-xs leading-6 font-normal tracking-[-0.072px] ${
                      office.is_current ? 'text-deep-green' : 'text-red-800'
                    }`}
                  >
                    {office.is_current ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
