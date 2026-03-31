import { metadataNavItems } from '@/components/Navbar/navitems'
import ParameterDefinitionForm from '@/components/Parameter/ParameterDefinition/ParameterDefinitionForm'
import ParameterDefinitionList from '@/components/Parameter/ParameterDefinition/ParameterDefinitionList'
import ParameterDefinitionSearchCard from '@/components/Parameter/ParameterDefinition/ParameterDefinitionSearchCard'
import { ParameterDefinition, ParameterDomain, SystemModule } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import DeleteModal from '@/ui/Modal/DeleteModal'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'
import { useCallback, useState } from 'react'

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
    title: 'Parameter Definitions',
    href: '/parameter-definition',
  },
]

export default function ParameterDefinitionIndex({
  parameter_definitions,
  domains,
  system_modules,
  filters,
}: {
  parameter_definitions: Paginator<ParameterDefinition>
  domains: ParameterDomain[]
  system_modules: SystemModule[]
  filters: {
    search: string
    domain_name: string
    module_name: string
  }
}) {
  const [parameterDefinitionToEdit, setParameterDefinitionToEdit] =
    useState<ParameterDefinition | null>(null)
  const [parameterDefinitionToDelete, setParameterDefinitionToDelete] =
    useState<ParameterDefinition | null>(null)
  const [parameterFormModal, setParameterFormModal] = useState(false)
  const [parameterDeleteModal, setParameterDeleteModal] = useState(false)
  const items = parameter_definitions

  const handleDeleteClick = useCallback((item: ParameterDefinition) => {
    setParameterDefinitionToDelete(item)
    setParameterDeleteModal(true)
  }, [])

  const handleEditClick = useCallback((item: ParameterDefinition) => {
    setParameterDefinitionToEdit(item)
    setParameterFormModal(true)
  }, [])

  const handleCreateClick = useCallback(() => {
    setParameterDefinitionToEdit(null)
    setParameterFormModal(true)
  }, [])
  console.log(items)
  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={metadataNavItems}
      selectedItem='Definitions'
      title='Parameter Definitions'
      description='Set up and manage system variables under a domain.'
      addBtnClick={handleCreateClick}
      addBtnText='Parameter Definition'
    >
      <div className='p-4'>
        <ParameterDefinitionSearchCard
          search={filters.search}
          filters={filters}
          systemModules={system_modules}
          parameterDomains={domains}
        />

        <div className='pt-5'>
          {items != null && items.data.length > 0 ? (
            <>
              <ParameterDefinitionList
                parameterDefinitions={items.data}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
              />
              <Pagination
                pagination={parameter_definitions}
                filters={filters}
              />
            </>
          ) : (
            <p>No Parameter Definitions Found.</p>
          )}
        </div>
      </div>
      {parameterFormModal && (
        <ParameterDefinitionForm
          title={
            parameterDefinitionToEdit ? 'Edit Parameter Definition' : 'Add Parameter Definition'
          }
          setShowModal={setParameterFormModal}
          show={parameterFormModal}
          parameterDefinition={parameterDefinitionToEdit ?? null}
          domains={domains}
        />
      )}
      {parameterDeleteModal && (
        <DeleteModal
          title='Delete Parameter Definition'
          setShowModal={setParameterDeleteModal}
          url={route('parameter-definition.destroy', parameterDefinitionToDelete?.id)}
        />
      )}
    </MainLayout>
  )
}
