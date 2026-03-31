import { SystemModule } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { type BreadcrumbItem } from '@/types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import Modal from '@/ui/Modal/Modal'
import { AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'
import { route } from 'ziggy-js'
import SystemModuleForm from './components/SystemModuleForm'
import { metadataNavItems } from '@/components/Navbar/navitems'
import AddButton from '@/ui/button/AddButton'
import ActionButton from '@/components/action-button'

interface Props {
  systemModules: SystemModule[]
}

export default function SystemModuleIndex({ systemModules }: Readonly<Props>) {
  const [moduleToEdit, setModuleToEdit] = useState<SystemModule | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [moduleToDelete, setModuleToDelete] = useState<SystemModule | null>(null)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Settings',
      href: '/settings-page',
    },
    {
      title: 'System Modules',
      href: '/system-module',
    },
  ]

  const handleCreateClick = useCallback(() => {
    setModuleToEdit(null)
    setShowModal(true)
  }, [])

  const handleEditClick = useCallback((module: SystemModule) => {
    setModuleToEdit(module)
    setShowModal(true)
  }, [])

  const handleDeleteClick = useCallback((module: SystemModule) => {
    setModuleToDelete(module)
    setShowDeleteModal(true)
  }, [])

  const handleModalClose = () => {
    setShowModal(false)
    setModuleToEdit(null)
  }

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setModuleToDelete(null)
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={metadataNavItems}
      selectedItem='System Modules'
      title='System Modules'
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl py-4'>
        <div className='mb-4 flex items-center justify-between'>
          <div></div>

          <AddButton
            onClick={handleCreateClick}
            buttonText='Add Module'
          />
        </div>

        <div className='flex flex-col'>
          {systemModules.map((module) => (
            <div
              key={module.id}
              className='mb-4 rounded-lg border border-gray-200 bg-white px-4 py-3 transition-shadow hover:shadow-md'
            >
              <div className='flex items-start justify-between'>
                {/* Left Section */}
                <div className='flex flex-1 flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <div className='font-inter text-base font-semibold text-black'>
                      {module.name}
                    </div>
                  </div>
                </div>

                {/* Right Section: Actions */}
                <div className='flex items-center gap-3'>
                  <ActionButton
                    onDelete={() => handleDeleteClick(module)}
                    onEdit={() => handleEditClick(module)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <Modal
              setShowModal={setShowModal}
              title={moduleToEdit ? 'Edit System Module' : 'Create System Module'}
            >
              <SystemModuleForm
                selectedSystemModule={moduleToEdit}
                onSuccess={handleModalClose}
                onCancel={handleModalClose}
              />
            </Modal>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && moduleToDelete && (
            <DeleteModal
              setShowModal={setShowDeleteModal}
              title='Confirm Deletion'
              url={route('system-module.destroy', moduleToDelete.id)}
              onSuccess={handleDeleteSuccess}
            >
              <div className='text-gray-700'>
                Are you sure you want to delete <strong>{moduleToDelete.name}</strong>?
              </div>
            </DeleteModal>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  )
}
