import MeterTransformerRelList from '@/components/Meter/MeterTransformer/MeterTransformerRel/MeterTransformerRelList'
import MainLayout from '@/layouts/main-layout'
import CardHeader from '@/ui/Card/CardHeader'
import DeleteModal from '@/ui/Modal/DeleteModal'
import ListSearch from '@/ui/Search/ListSearch'
import { router } from '@inertiajs/react'
import { useState } from 'react'

interface Relation {
  version_id: number
  ctpt_id: number
  meter_id: number
  faulty_date?: string | null
  ctpt_energise_date?: string | null
  ctpt_change_date?: string | null
  status_id: number
  change_reason_id: number
  effective_start_ts: string
  effective_end_ts?: string | null
  is_active: boolean
}

interface Props {
  relations: Relation[]
}

const breadcrumbs = [{ title: 'Meter CTPT Relations', href: '/meter-ctpt-rel' }]

export default function MeterTransformerRelIndex({ relations }: Props) {
  const [items, setItems] = useState(relations || [])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedRel, setSelectedRel] = useState<Relation | null>(null)

  function handleShow(id: number) {
    router.get(`/meter-ctpt-rel/${id}`)
  }

  function handleDeleteClick(item: Relation) {
    setSelectedRel(item)
    setShowDeleteModal(true)
  }

  return (
    <MainLayout breadcrumb={breadcrumbs}>
      <div className='flex h-full flex-1 flex-col gap-6 p-6'>
        <CardHeader title='Meter CTPT Relations' />

        <ListSearch
          title='Relations Search'
          url={route('meter-ctpt-rel.index')}
          // setItems={setItems} ← implement later if you want filtering like MeterTransformerIndex
        />

        {items && items.length > 0 ? (
          <MeterTransformerRelList
            relations={items}
            onEdit={(rel) => router.get(`/meter-ctpt-rel/${rel.version_id}/edit`)}
            onDelete={handleDeleteClick}
            onShow={handleShow}
          />
        ) : (
          <div className='p-6 text-center text-slate-500'>
            <p>No meter transformer relations found.</p>
          </div>
        )}

        {showDeleteModal && selectedRel && (
          <DeleteModal
            setShowModal={setShowDeleteModal}
            title={`Delete Relation ${selectedRel?.version_id}`}
            url={`/meter-ctpt-rel/${selectedRel?.version_id}`}
          />
        )}
      </div>
    </MainLayout>
  )
}
