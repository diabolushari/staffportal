import { Party } from '@/interfaces/parties'
import { router } from '@inertiajs/react'
import { Mail, MapPin, Phone } from 'lucide-react'

interface Props {
  parties: Party[]
}

export default function PartyList({ parties }: Readonly<Props>) {
  const handlePartyClick = (party: Party) => {
    router.get(route('parties.show', party.party_id))
  }

  return (
    <div className='relative w-full rounded-lg bg-white'>
      <div className='flex flex-col px-7 pb-7'>
        {parties.map((party) => (
          <div
            key={party.party_id}
            onClick={() => handlePartyClick(party)}
            className='mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 py-[5px] transition-shadow last:mb-0 hover:shadow-md'
          >
            <div className='flex items-start justify-between'>
              <div className='flex flex-1 flex-col gap-2.5 p-[10px]'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <div className='font-inter text-base leading-normal font-semibold text-black'>
                      {party.name}
                    </div>
                    <div className='rounded-[50px] bg-blue-100 px-2.5 py-px'>
                      <div className='font-inter text-xs leading-6 font-normal tracking-[-0.072px] text-blue-800'>
                        {party.party_code}
                      </div>
                    </div>
                  </div>

                  <div className='flex w-full flex-wrap items-center gap-5'>
                    {party.mobile_number && (
                      <div className='flex items-center gap-[3px]'>
                        <Phone className='text-dark-gray h-3.5 w-3.5' />
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          {party.mobile_number}
                        </div>
                      </div>
                    )}
                    {party.email_address && (
                      <div className='flex items-center gap-[3px]'>
                        <Mail className='text-dark-gray h-3.5 w-3.5' />
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          {party.email_address}
                        </div>
                      </div>
                    )}
                    {party.address && (
                      <div className='flex items-center gap-[3px]'>
                        <MapPin className='text-dark-gray h-3.5 w-3.5' />
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          {party.address}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-end gap-2 py-2.5 pr-2.5 pl-[15px]'>
                <div
                  className={`rounded-[50px] px-2.5 py-px ${
                    party.is_current ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <div
                    className={`font-inter text-xs leading-6 font-normal tracking-[-0.072px] ${
                      party.is_current ? 'text-deep-green' : 'text-red-800'
                    }`}
                  >
                    {party.is_current ? 'Active' : 'Inactive'}
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
