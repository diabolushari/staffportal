import { Connection, ConnectionPartyMapping } from '@/interfaces/data_interfaces'
import EditButton from '@/ui/button/EditButton'
import { Calendar, Hash, User, ClipboardList } from 'lucide-react'
import { useState } from 'react'
import ConnectionPartiesFormModal from './ConnectionPartiesFormModal'
import DeleteButton from '@/ui/button/DeleteButton'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { getDisplayDate } from '@/utils'
import { ParameterValues } from '@/interfaces/parameter_types'

interface Props {
  connectionParties: ConnectionPartyMapping[]
  connection: Connection
  partyRelationTypes: ParameterValues[]
}

export default function ConnectionPartiesList({
  connectionParties,
  partyRelationTypes,
  connection,
}: Readonly<Props>) {
  const [editModal, setEditModal] = useState(false)
  const [editItem, setEditItem] = useState<ConnectionPartyMapping | null>(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteItem, setDeleteItem] = useState<ConnectionPartyMapping | null>(null)

  const handleEditClick = (item: ConnectionPartyMapping) => {
    setEditItem(item)
    setEditModal(true)
  }
  const handleDeleteClick = (item: ConnectionPartyMapping) => {
    setDeleteItem(item)
    setDeleteModal(true)
  }
  return (
    <div className='relative w-full rounded-lg bg-white'>
      {connectionParties.length < 1 && (
        <div className='font-inter text-dark-gray px-7 pt-[21px] pb-3 text-[15px] leading-[23px] font-semibold'>
          No Parties Found
        </div>
      )}

      <div className='flex flex-col px-7 pb-7'>
        {connectionParties &&
          connectionParties.map((item) => (
            <div
              key={item.version_id}
              className='mb-4 rounded-lg border border-gray-200 bg-white px-3 py-[10px] transition-shadow last:mb-0 hover:shadow-md'
            >
              <div className='flex items-start justify-between'>
                <div className='flex w-full flex-col gap-2 p-1'>
                  {/* Party Name + ID */}
                  <div className='flex items-center gap-2'>
                    <div className='font-inter text-base font-semibold text-black'>
                      {item.party?.name}
                    </div>

                    <div className='rounded-[50px] bg-blue-100 px-2 py-px'>
                      <span className='text-[11px] text-blue-800'>ID: {item.party_id}</span>
                    </div>
                  </div>

                  {/* Party Type */}
                  <div className='flex items-center gap-[6px]'>
                    <Hash className='text-dark-gray h-3.5 w-3.5' />
                    <p className='font-inter text-dark-gray text-sm'>
                      Party Type: {item.party.party_type?.parameter_value ?? '--'}
                    </p>
                  </div>

                  {/* Party Code */}
                  <div className='flex items-center gap-[6px]'>
                    <User className='text-dark-gray h-3.5 w-3.5' />
                    <p className='font-inter text-dark-gray text-sm'>
                      Party Code: {item.party?.party_code}
                    </p>
                  </div>

                  {/* Active Duration */}
                  <div className='flex items-center gap-[6px]'>
                    <Calendar className='text-dark-gray h-3.5 w-3.5' />
                    <p className='font-inter text-dark-gray text-sm'>
                      {/* Active From: {item.effective_start?.date?.split(' ')[0]} */}
                      Active From: {getDisplayDate(item.effective_start?.date)}
                      {'  →  '}
                      {getDisplayDate(item.effective_end?.date) ?? 'Present'}
                    </p>
                  </div>

                  {/* Version */}
                  <div className='flex items-center gap-[6px]'>
                    <ClipboardList className='text-dark-gray h-3.5 w-3.5' />
                    <p className='font-inter text-dark-gray text-sm'>Version: {item.version_id}</p>
                  </div>
                </div>

                {/* Status */}
                <div className='flex items-start p-2'>
                  <div
                    className={`rounded-[50px] px-2.5 py-px ${
                      item.is_active ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    <div
                      className={`text-xs ${item.is_active ? 'text-deep-green' : 'text-red-800'}`}
                    >
                      {item.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <EditButton onClick={() => handleEditClick(item)} />
                  <DeleteButton onClick={() => handleDeleteClick(item)} />
                </div>
              </div>
            </div>
          ))}
      </div>
      {deleteModal && deleteItem && (
        <DeleteModal
          setShowModal={setDeleteModal}
          title='Delete Connection Party'
          url={route('connection-parties.destroy', deleteItem?.version_id)}
        />
      )}
      {editModal && editItem && (
        <ConnectionPartiesFormModal
          connection={connection}
          connectionParty={editItem}
          setShowModal={setEditModal}
          partyRelationTypes={partyRelationTypes}
        />
      )}
    </div>
  )
}
