import { Card } from '@/components/ui/card'
import useInertiaPost from '@/hooks/useInertiaPost'
import { OfficeContact } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import { Mail, PencilIcon, Phone, Plus, User, X } from 'lucide-react'
import { useState } from 'react'
import ContactFormModal from './ContactFormModal'

interface ContactFolioCardProps {
  contacts: OfficeContact[]
  officeId: number
  officeCode: string
  onContactsUpdate?: (contacts: OfficeContact[]) => void
}

interface UpdateContactsForm {
  office_code: number
  contacts: OfficeContact[]
}

export default function ContactFolioCard({
  contacts,
  officeId,
  officeCode,
  onContactsUpdate,
}: Readonly<ContactFolioCardProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<OfficeContact | null>(null)
  const [localContacts, setLocalContacts] = useState<OfficeContact[]>(contacts)
  const [isEditMode, setIsEditMode] = useState(false)

  const { post, loading } = useInertiaPost<UpdateContactsForm>(route('offices.update-contacts'), {
    showErrorToast: true,
  })

  const handleAddContact = () => {
    setEditingContact(null)
    setIsModalOpen(true)
  }

  const handleEditContact = (contact: OfficeContact) => {
    setEditingContact(contact)
    setIsModalOpen(true)
  }

  const handleDeleteContact = (employeeId: string | null | undefined) => {
    const updatedContacts = localContacts.filter((contact) => contact.employee_id !== employeeId)
    setLocalContacts(updatedContacts)
  }

  const handleSaveContact = (contact: OfficeContact) => {
    if (editingContact?.employee_id != null) {
      setLocalContacts((prevContacts) =>
        prevContacts.map((oldContact) =>
          oldContact.employee_id === editingContact.employee_id ? contact : oldContact
        )
      )
    } else {
      setLocalContacts((prevContacts) => [...prevContacts, contact])
    }
    setIsModalOpen(false)
    setEditingContact(null)
  }

  const handleSaveAll = () => {
    post({
      office_code: parseInt(officeCode),
      contacts: localContacts,
    })
    onContactsUpdate?.(localContacts)
    setIsEditMode(false)
  }

  const handleEnterEditMode = () => {
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    setLocalContacts(contacts)
    setIsEditMode(false)
  }

  return (
    <>
      <Card className='rounded-lg p-7'>
        <div className='mb-6 flex items-center justify-between'>
          <StrongText className='text-base font-semibold text-[#252c32]'>
            Contact Details
          </StrongText>
          <div className='flex items-center gap-2'>
            {!isEditMode ? (
              <button
                onClick={handleEnterEditMode}
                className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0078d4] transition-colors hover:bg-gray-50'
                disabled={loading}
              >
                <PencilIcon className='h-4 w-4' />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancelEdit}
                  className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50'
                  disabled={loading}
                >
                  <X className='h-4 w-4' />
                  Cancel
                </button>
                <button
                  onClick={handleAddContact}
                  className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0078d4] transition-colors hover:bg-gray-50'
                  disabled={loading}
                >
                  <Plus className='h-4 w-4' />
                  Add Contact
                </button>
                <button
                  onClick={handleSaveAll}
                  className='flex items-center gap-2 rounded-lg bg-[#0078d4] px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#106ebe] disabled:opacity-50'
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>
        <hr className='mb-6 border-[#e5e9eb]' />
        {localContacts.length === 0 ? (
          <div className='py-8 text-center'>
            <User className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            <p className='text-gray-600'>No contacts added</p>
            <p className='mt-2 text-sm text-gray-500'>Click "Add Contact" to get started</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {localContacts.map((contact, index) => (
              <div
                key={contact.employee_id ?? index}
                className='rounded-lg border border-gray-200 p-4'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1 space-y-2'>
                    <div className='flex items-center gap-3'>
                      <div className='text-base font-semibold text-black'>
                        {contact.name ?? 'Unnamed Contact'}
                      </div>
                      {contact.designation && (
                        <div className='rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-normal text-blue-800'>
                          {contact.designation}
                        </div>
                      )}
                    </div>
                    <div className='flex items-center gap-5'>
                      {contact.phone && (
                        <div className='flex items-center gap-1'>
                          <Phone className='h-3.5 w-3.5 text-gray-400' />
                          <span className='text-sm font-normal text-[#252c32]'>
                            {contact.phone}
                          </span>
                        </div>
                      )}
                      {contact.email && (
                        <div className='flex items-center gap-1'>
                          <Mail className='h-3.5 w-3.5 text-gray-400' />
                          <span className='text-sm font-normal text-[#252c32]'>
                            {contact.email}
                          </span>
                        </div>
                      )}
                    </div>
                    {contact.employee_id && (
                      <div className='text-sm font-normal text-[#252c32]'>
                        Employee ID: {contact.employee_id}
                      </div>
                    )}
                  </div>
                  {isEditMode && (
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => handleEditContact(contact)}
                        className='flex items-center gap-1 rounded-lg border border-[#dde2e4] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#0078d4] transition-colors hover:bg-gray-50'
                      >
                        <PencilIcon className='h-3 w-3' />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.employee_id)}
                        className='flex items-center gap-1 rounded-lg border border-[#dde2e4] bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-gray-50'
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      {isModalOpen && (
        <ContactFormModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveContact}
          contact={editingContact}
          officeId={officeId}
          officeCode={officeCode}
          existingContacts={localContacts}
        />
      )}
    </>
  )
}
