import { metadataNavItems } from '@/components/Navbar/navitems'
import ParameterValuesList from '@/components/Parameter/ParameterValue/ParameterValueList'
import ParameterValueSearchCard from '@/components/Parameter/ParameterValue/ParameterValueSearchCard'
import { ParameterDefinition, ParameterDomain, ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import React, { useState } from 'react'
import { route } from 'ziggy-js'

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
    title: 'Parameter Values',
    href: '/parameter-value',
  },
]

interface Props {
  values: Paginator<ParameterValues>
  domains: ParameterDomain[]
  definitions: ParameterDefinition[]
  filters: {
    domain_name: string
    parameter_name: string
    search: string
  }
}

export default function ParameterValueIndex({ values, domains, definitions, filters }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editRow, setEditRow] = useState<ParameterValues | null>(null)
  const handleDeleteClick = (item: ParameterValues) => {
    setShowDeleteModal(true)
    setEditRow(item)
  }
  const handleCreateClick = () => {
    router.get(route('parameter-value.create'))
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={metadataNavItems}
      selectedItem='Parameter Values'
      addBtnClick={handleCreateClick}
      addBtnText='Parameter Value'
      title='Parameter Values'
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl py-4'>
        <ParameterValueSearchCard
          parameterDomains={domains}
          parameterDefinitions={definitions}
          filters={filters}
        />
        {values?.data && (
          <>
            <ParameterValuesList
              parameterValues={values?.data}
              onView={(item) => router.get(route('parameter-value.show', item.id))}
              onEdit={(item) => router.get(route('parameter-value.edit', item.id))}
              onDelete={handleDeleteClick}
            />
            <Pagination
              pagination={values}
              filters={filters}
            />
          </>
        )}
        {showDeleteModal && editRow && (
          <DeleteModal
            setShowModal={setShowDeleteModal}
            title={`Delete ${editRow.parameter_value}`}
            url={route('parameter-value.destroy', editRow.id)}
          />
        )}
      </div>
    </MainLayout>
  )
}
