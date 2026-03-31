import { router } from '@inertiajs/react'
import { PencilIcon, Plus, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import StrongText from '@/typography/StrongText'
import MeterTransformerSection from './MeterTranformerSection'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { useState } from 'react'
import { MeterTransformer } from '@/interfaces/data_interfaces'

export default function MeterTransformerTab({
  meterId,
  transformers,
  version_id,
}: {
  meterId: number
  transformers: MeterTransformer[]
  version_id?: number
}) {
  function handleAddCtpt() {
    router.visit(route('meters.ctpt.create', meterId))
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTransformer, setSelectedTransformer] = useState<any | null>(null)

  function handleDeleteClick(item: any) {
    setShowDeleteModal(true)
    setSelectedTransformer(item)
  }

  return (
    <Card className='relative w-full rounded-lg bg-white'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
        <StrongText className='text-lg font-semibold text-gray-900'>Meter CT/PT</StrongText>

        {/* Only show Add if no CT/PT exists */}
        <div>
          <button
            onClick={handleAddCtpt}
            className='inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
          >
            <Plus className='h-4 w-4' />
            Add CT/PT
          </button>

          {version_id && (
            <button
              onClick={() => router.visit(`/meter-ctpt-rel/${version_id}/edit`)}
              className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0078d4] hover:bg-gray-50'
            >
              <PencilIcon className='h-4 w-4' />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className='flex flex-col gap-8 px-6 pb-6'>
        {transformers?.length > 0 ? (
          transformers?.map((ctpt) => (
            <div className='relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
              <MeterTransformerSection ctpt={ctpt} />

              <button
                onClick={() => handleDeleteClick(ctpt)}
                className='absolute top-4 right-4 inline-flex items-center justify-center rounded-md border border-red-200 bg-white px-2 py-1 text-red-600 shadow-sm transition-colors hover:border-red-300 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
                title='Delete CT/PT'
              >
                <Trash2 className='h-4 w-4' />
              </button>
            </div>
          ))
        ) : (
          <div className='p-8 text-center text-slate-500'>
            <p className='text-sm'>No CT/PT record exists for this meter.</p>
          </div>
        )}
      </div>
      {showDeleteModal && selectedTransformer && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete CTPT ${selectedTransformer.ctpt_serial}`}
          url={route('meter-ctpt-rel.destroy', version_id)}
        />
      )}
    </Card>
  )
}
