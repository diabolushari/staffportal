import { SdCollection } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import { getDisplayDate } from '@/utils'

interface Props {
  sdCollections: SdCollection[]
}

const SdCollectionList = ({ sdCollections }: Props) => {
  return (
    <div className='space-y-4 p-4'>
      {sdCollections.map((collection) => (
        <div
          key={collection?.sd_collection_id}
          className='rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm'
        >
          <div className='flex items-start justify-between'>
            <div className='flex flex-1 cursor-pointer flex-col gap-2.5 p-[10px]'>
              <div className='grid grid-cols-3 gap-x-6 gap-y-2'>
                <div className='flex items-center gap-[3px]'>
                  <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                    Collection Date:{' '}
                    <StrongText> {getDisplayDate(collection.collection_date)}</StrongText>
                  </div>
                </div>
                <div className='flex items-center gap-[3px]'>
                  <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                    Payment Mode:{' '}
                    <StrongText> {collection.payment_mode.parameter_value}</StrongText>
                  </div>
                </div>
                <div className='flex items-center gap-[3px]'>
                  <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                    Collection Amount: <StrongText> {collection.collection_amount}</StrongText>
                  </div>
                </div>
                {collection.receipt_number && (
                  <div className='flex items-center gap-[3px]'>
                    <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                      Receipt Number:<StrongText> {collection.receipt_number}</StrongText>
                    </div>
                  </div>
                )}
                {collection.collected_at && (
                  <div className='flex items-center gap-[3px]'>
                    <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                      Collected At: <StrongText> {collection.collected_at}</StrongText>
                    </div>
                  </div>
                )}
                {collection.collected_by && (
                  <div className='flex items-center gap-[3px]'>
                    <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                      Collected By: <StrongText> {collection.collected_by}</StrongText>
                    </div>
                  </div>
                )}
                {collection.reversal_reason && (
                  <div className='flex items-center gap-[3px]'>
                    <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                      Reversal Reason: <StrongText> {collection.reversal_reason}</StrongText>
                    </div>
                  </div>
                )}
                {collection.reversal_date && (
                  <div className='flex items-center gap-[3px]'>
                    <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                      Reversal Date:{' '}
                      <StrongText> {getDisplayDate(collection.reversal_date)}</StrongText>
                    </div>
                  </div>
                )}
                {collection.reversed_by && (
                  <div className='flex items-center gap-[3px]'>
                    <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                      Reversal By: <StrongText> {collection.reversed_by}</StrongText>
                    </div>
                  </div>
                )}
                {collection.sdAttribute &&
                  collection.sdAttribute.length > 0 &&
                  collection.sdAttribute.map((attribute) => {
                    const type = attribute.attribute_definition?.attribute1_value.toLowerCase()
                    let displayValue
                    if (type === 'date') {
                      displayValue = getDisplayDate(attribute.attribute_value)
                    } else if (type === 'file' && attribute.attribute_value) {
                      displayValue = (
                        <a
                          href={`/attribute-download?path=${attribute.attribute_value}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-600 underline'
                        >
                          Download
                        </a>
                      )
                    } else {
                      displayValue = attribute.attribute_value
                    }

                    return (
                      <div
                        key={attribute.attribute_id}
                        className='flex items-center gap-[3px]'
                      >
                        <div className='font-inter text-dark-gray text-sm leading-6 font-normal tracking-[-0.084px]'>
                          {attribute.attribute_definition?.parameter_value}:{' '}
                          <StrongText>{displayValue}</StrongText>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SdCollectionList
