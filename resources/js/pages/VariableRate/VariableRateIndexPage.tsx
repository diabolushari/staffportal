import MainLayout from '@/layouts/main-layout'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { BreadcrumbItem } from '@/types'
import { useCallback, useState } from 'react'
import VariableRateFormModal from '@/components/VariableRate/VariableRateFormModal'
import ParameterValueModal from '@/components/Parameter/ParameterValue/ParameterValueModal'
import { ParameterDefinition, ParameterValues } from '@/interfaces/parameter_types'
import { Paginator } from '@/ui/ui_interfaces'
import { VariableRate } from '@/interfaces/data_interfaces'
import VariableRateList from '@/components/VariableRate/VariableRateList'
import Pagination from '@/ui/Pagination/Pagination'
import VariableRateSearch from '@/components/VariableRate/VariableSearchForm'

interface PageProps {
  variableRateParameter: ParameterDefinition
  variableRates: Paginator<VariableRate>
  filters: {
    search: string | null
    order_by: string | null
    order_direction: string | null
    oldVariableName: ParameterValues | null
  }
}

export default function VariableRateIndexPage({
  variableRateParameter,
  variableRates,
  filters,
}: PageProps) {
  const breadcrumb: BreadcrumbItem[] = [
    {
      title: 'Settings',
      href: '/settings-page',
    },
    {
      title: 'Variable Rate',
      href: '/variable-rates',
    },
  ]

  const [showModal, setShowModal] = useState(false)
  const [showParameterValueModal, setShowParameterValueModal] = useState<boolean>(false)
  const [selectedRate, setSelectedRate] = useState<VariableRate | null>(null)
  const handleSwitchForm = useCallback(() => {
    setShowParameterValueModal(!showParameterValueModal)
  }, [showParameterValueModal])
  const handleAddBtnClick = () => {
    setSelectedRate(null)
    setShowModal(true)
  }

  const handleEdit = (rate: VariableRate) => {
    setSelectedRate(rate)
    setShowModal(true)
  }

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={meteringBillingNavItems}
      leftBarTitle='Variable Rate'
      selectedItem='Variable Rate'
      addBtnText='Rate'
      title='Variable Rates'
      addBtnClick={handleAddBtnClick}
    >
      <VariableRateSearch filters={filters} />
      <VariableRateList
        variableRates={variableRates.data}
        handleEdit={handleEdit}
      />
      <Pagination pagination={variableRates} />

      {showModal && !showParameterValueModal && (
        <VariableRateFormModal
          setShowModal={setShowModal}
          switchForm={handleSwitchForm}
          rate={selectedRate}
        />
      )}
      {showParameterValueModal && (
        <ParameterValueModal
          onClose={handleSwitchForm}
          definition={variableRateParameter}
          codeLabel='Code'
          valueLabel='Variable Name'
          descriptionLabel='Description'
          title='Variable Name'
          warningMessage='No parameter definition found for "Variable Name". Create this definition in the Billing domain before proceeding.'
        />
      )}
    </MainLayout>
  )
}
