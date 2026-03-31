import MainLayout from '@/layouts/main-layout'
import { type BreadcrumbItem } from '@/types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'
import { route } from 'ziggy-js'
import {
  metadataNavItems,
  meteringBillingNavItems,
  meterNavItems,
} from '@/components/Navbar/navitems'
import AddButton from '@/ui/button/AddButton'
import { PurposeInfo } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import PurposeInfoList from '@/components/PurposeInfo/PurposeInfoList'
import Pagination from '@/ui/Pagination/Pagination'
import PurposeInfoSearchForm from '@/components/PurposeInfo/PurposeInfoSearchForm'
import { ParameterValues } from '@/interfaces/parameter_types'

interface Props {
  purposeInfo: Paginator<PurposeInfo>
  oldPurpose?: ParameterValues
  oldTariff?: ParameterValues
  oldFromDate?: string
  oldToDate?: string
}

export default function PurposeInfoIndexPage({
  purposeInfo,
  oldPurpose,
  oldTariff,
  oldFromDate,
  oldToDate,
}: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [purposeInfoToDelete, setPurposeInfoToDelete] = useState<PurposeInfo | null>(null)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Settings',
      href: '/settings-page',
    },
    {
      title: 'Tariff Mappings',
      href: '/tariff-mappings',
    },
  ]

  const handleDeleteClick = useCallback((purposeInfo: PurposeInfo) => {
    setPurposeInfoToDelete(purposeInfo)
    setShowDeleteModal(true)
  }, [])

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    setPurposeInfoToDelete(null)
  }

  const handleAddClick = () => {
    router.get(route('tariff-mappings.create'))
  }

  const handleEditClick = (purposeInfo: PurposeInfo) => {
    router.get(route('tariff-mappings.edit', purposeInfo.id))
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='Tariff Mappings'
      title='Tariff Mappings'
      addBtnClick={handleAddClick}
      addBtnText='Tariff Mapping'
    >
      <PurposeInfoSearchForm
        oldPurpose={oldPurpose}
        oldTariff={oldTariff}
        oldFromDate={oldFromDate}
        oldToDate={oldToDate}
      />
      {purposeInfo?.data && (
        <PurposeInfoList
          purposeInfos={purposeInfo.data}
          handleEdit={handleEditClick}
        />
      )}

      {purposeInfo?.data && (
        <Pagination
          pagination={purposeInfo}
          filters={{
            tariff_id: oldTariff?.id ? oldTariff.id.toString() : '',
            purpose_id: oldPurpose?.id ? oldPurpose.id.toString() : '',
            from_date: oldFromDate ?? '',
            to_date: oldToDate ?? '',
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && purposeInfoToDelete && (
          <DeleteModal
            setShowModal={setShowDeleteModal}
            title='Confirm Deletion'
            url={route('tariff-mappings.destroy', purposeInfoToDelete.id)}
            onSuccess={handleDeleteSuccess}
          >
            <div className='text-gray-700'>Are you sure you want to delete ?</div>
          </DeleteModal>
        )}
      </AnimatePresence>
    </MainLayout>
  )
}
