import { metadataNavItems } from '@/components/Navbar/navitems'
import AddRelationModal from '@/components/Offices/AddRelationModal'
import ContactFolioCard from '@/components/Offices/ContactFolioCard'
import { Card } from '@/components/ui/card'
import { Office, OfficeHierarchyRel } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import StrongText from '@/typography/StrongText'
import AddButton from '@/ui/button/AddButton'
import DeleteButton from '@/ui/button/DeleteButton'
import EditButton from '@/ui/button/EditButton'
import TinyContainer from '@/ui/Card/TinyContainer'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { router } from '@inertiajs/react'
import { Building, MapPin, PencilIcon } from 'lucide-react'
import { useState } from 'react'

interface Props {
  office: Office
  parentOffices: any[]
  officeHierarchiesWithoutSelected: any[]
}

const placeholderData = {
  district: 'Kozhikode',
  taluk: 'Kozhikode',
  latitude: '152.155',
  longitude: '169.325',
  address: 'SM Street Calicut',
  parentName: 'Kochi Substation',
  parentCode: 'KSEB002',
  parentType: 'Substation',
  parentLocation: 'Ernakulam, Kochi',
  parentAddress: 'Marine Drive, Kochi',
  parentStatus: 'Active',
  createdBy: 'RMO',
  updatedBy: 'Section Officer',
  updatedAt: '18 July 2025',
}

export default function OfficeShow({
  office,
  parentOffices,
  officeHierarchiesWithoutSelected,
}: Readonly<Props>) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [officeHierarchyRelId, setOfficeHierarchyRelId] = useState(0)
  const [createRelationModalOpen, setCreateRelationModalOpen] = useState(false)
  const [hierarchyData, setHierarchyData] = useState<OfficeHierarchyRel | undefined>(undefined)
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Settings',
      href: '/settings-page',
    },
    {
      title: 'Offices',
      href: '/offices',
    },
    {
      title: 'Detail',
      href: `/offices/${office.office_id}`,
    },
  ]

  const formatDate = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString('en-GB') : '-'

  // Placeholder data for missing fields based on Figma design
  const placeholderData = {
    district: 'Kozhikode',
    taluk: 'Kozhikode',
    latitude: '152.155',
    longitude: '169.325',
    address: 'SM Street Calicut',
    parentName: 'Kochi Substation',
    parentCode: 'KSEB002',
    parentType: 'Substation',
    parentLocation: 'Ernakulam, Kochi',
    parentAddress: 'Marine Drive, Kochi',
    parentStatus: 'Active',
    createdBy: 'RMO',
    updatedBy: 'Section Officer',
    updatedAt: '18 July 2025',
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      selectedItem='Office Details'
      navItems={metadataNavItems}
      title={`${office.office_code} - ${office.office_name} `}
    >
      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6'>
        {/* Header Section */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end'>
          <button
            onClick={() => router.visit(route('offices.edit', office.office_id))}
            className='flex items-center gap-2 rounded-lg bg-[#0078d4] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#106ebe]'
          >
            {isEditing ? 'Cancel Edit' : 'Edit Details'}
          </button>
        </div>

        <div className='space-y-4'>
          {/* Basic Information */}
          <Card className='rounded-lg p-7'>
            <div className='mb-6 flex items-center justify-between'>
              <StrongText className='text-base font-semibold text-[#252c32]'>
                Basic Information
              </StrongText>
              <button
                onClick={() => router.visit(route('offices.edit', office.office_id))}
                className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0078d4] transition-colors hover:bg-gray-50'
              >
                <PencilIcon className='h-4 w-4' />
                Edit
              </button>
            </div>
            <hr className='mb-6 border-[#e5e9eb]' />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-[#252c32]'>Office Code</label>
                <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                  {office.office_code}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-[#252c32]'>Name</label>
                <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                  {office.office_name}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-[#252c32]'>Office Type</label>
                <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                  {office.office_type?.parameter_value || 'Subdivision'}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-[#252c32]'>Office Status</label>
                <div className='px-2.5 py-2.5 text-sm font-medium text-black'>
                  {office.is_current ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </Card>

          {/* Location Details */}
          <Card className='rounded-lg p-7'>
            <div className='mb-6 flex items-center justify-between'>
              <StrongText className='text-base font-semibold text-[#252c32]'>
                Location Details
              </StrongText>
              <button
                onClick={() => router.visit(route('offices.edit', office.office_id))}
                className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0078d4] transition-colors hover:bg-gray-50'
              >
                <PencilIcon className='h-4 w-4' />
                Edit
              </button>
            </div>
            <hr className='mb-6 border-[#e5e9eb]' />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-[#252c32]'>District</label>
                <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                  {placeholderData.district}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-[#252c32]'>Taluk</label>
                <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                  {placeholderData.taluk}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-[#252c32]'>Latitude</label>
                <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                  {placeholderData.latitude}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-[#252c32]'>Longitude</label>
                <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                  {placeholderData.longitude}
                </div>
              </div>
              <div className='space-y-1 md:col-span-2'>
                <label className='text-sm font-normal text-[#252c32]'>Address</label>
                <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-normal text-[#252c32]'>
                  {placeholderData.address}
                </div>
              </div>
            </div>
          </Card>

          {/* Parent Details */}
          <Card className='rounded-lg p-7'>
            <div className='mb-6 flex items-center justify-between'>
              <StrongText className='text-base font-semibold text-[#252c32]'>
                Parent Details
              </StrongText>
              <AddButton
                onClick={() => setCreateRelationModalOpen(true)}
                buttonText='Add Parent Office'
              />
            </div>

            <hr className='mb-6 border-[#e5e9eb]' />

            {parentOffices.map((parentRel, index) => (
              <div
                key={index}
                className='relative mb-4 rounded-lg border border-gray-200 p-2.5'
              >
                {/* Parent info */}
                <div className='flex items-start justify-between p-2.5'>
                  <div className='flex-1 space-y-2.5'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-3'>
                        <div className='text-base font-semibold text-black'>
                          {parentRel.parent_office?.office_name || 'N/A'}
                        </div>
                        <div className='rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-normal text-blue-800'>
                          {parentRel.parent_office?.office_code || 'N/A'}
                        </div>
                      </div>
                      <div className='flex items-center gap-5'>
                        <div className='flex items-center gap-1'>
                          <Building className='h-3.5 w-3.5 text-gray-400' />
                          <span className='text-sm font-normal text-[#252c32]'>
                            {parentRel.parent_office?.office_type?.parameter_value || 'N/A'}
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <MapPin className='h-3.5 w-3.5 text-gray-400' />
                          <span className='text-sm font-normal text-[#252c32]'>
                            {parentRel.parent_office?.location_id || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className='text-sm font-normal text-[#252c32]'>
                        {parentRel.parent_office?.office_description || 'N/A'}
                      </div>
                      <div className='text-sm font-normal text-[#252c32]'>
                        Hierarchy: {parentRel.office_hierarchy?.hierarchy_name || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col items-end gap-2 p-2.5'>
                    <DeleteButton
                      onClick={() => {
                        setOfficeHierarchyRelId(parentRel.hierarchy_rel_hist_id)
                        setIsDeleting(true)
                      }}
                    />
                    <EditButton
                      onClick={() => {
                        setHierarchyData(parentRel)
                        setCreateRelationModalOpen(true)
                      }}
                    />
                    <div className='rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-normal text-[#1c6534]'>
                      {parentRel.parent_office?.is_current ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>

                {/* Delete button at bottom right */}
              </div>
            ))}
          </Card>

          {/* Other Info */}
          <Card className='rounded-lg p-7'>
            <div className='mb-6 flex items-center justify-between'>
              <StrongText className='text-base font-semibold text-[#252c32]'>Other info</StrongText>
              <button
                onClick={() => router.visit(route('offices.edit', office.office_id))}
                className='flex items-center gap-2 rounded-lg border border-[#dde2e4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0078d4] transition-colors hover:bg-gray-50'
              >
                <PencilIcon className='h-4 w-4' />
                Edit
              </button>
            </div>
            <hr className='mb-6 border-[#e5e9eb]' />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-[#252c32]'>Effective Start Date</label>
                <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                  {formatDate(office.effective_start) || '12 May 1990'}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-[#252c32]'>Effective End date</label>
                <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                  {formatDate(office.effective_end) || 'Active'}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-[#252c32]'>Created by</label>
                <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                  {placeholderData.createdBy}
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-normal text-[#252c32]'>Updated by</label>
                <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black'>
                  {placeholderData.updatedBy}
                </div>
              </div>
              <div className='space-y-1 md:col-span-2'>
                <label className='text-sm font-normal text-[#252c32]'>Updated at</label>
                <div className='rounded bg-gray-50 px-2.5 py-2.5 text-sm font-normal text-[#252c32]'>
                  {placeholderData.updatedAt}
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Folio */}
          <ContactFolioCard
            contacts={office.contact_folio?.contacts || []}
            officeId={office.office_id}
            officeCode={office?.office_code?.toString()}
            onContactsUpdate={() => {}}
          />
        </div>
      </div>
      {createRelationModalOpen && (
        <AddRelationModal
          onClose={() => setCreateRelationModalOpen(false)}
          officeHierarchies={officeHierarchiesWithoutSelected}
          office_code={office.office_code}
          hierarchyData={hierarchyData}
        />
      )}
      {isDeleting && officeHierarchyRelId && (
        <DeleteModal
          setShowModal={setIsDeleting}
          title='Delete Office'
          url={`/office-hierarchy-rel/${officeHierarchyRelId}`}
        />
      )}
    </MainLayout>
  )
}
