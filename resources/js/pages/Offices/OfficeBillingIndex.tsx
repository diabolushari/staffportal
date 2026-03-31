import { metadataNavItems } from '@/components/Navbar/navitems'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useCustomForm from '@/hooks/useCustomForm'
import { Connection, OfficeWithHierarchy } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import OfficeLayout from '@/layouts/OfficeLayout'
import { BreadcrumbItem } from '@/types'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'

interface Props {
  office: OfficeWithHierarchy
  connections: Paginator<Connection>
  primary_purposes: ParameterValues[]
  consumer_types: ParameterValues[]
  filters: {
    primary_purpose: string
    consumer_type: string
    consumer_number: string
  }
}

export default function OfficeBillingIndex({
  office,
  connections,
  primary_purposes,
  consumer_types,
  filters,
}: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Offices',
      href: '/offices',
    },
    {
      title: 'Office Billing',
      href: `/offices/${office.office.office_code}/billings`,
    },
  ]
  const { formData, setFormValue } = useCustomForm({
    primary_purpose: filters.primary_purpose ?? '',
    consumer_type: filters.consumer_type ?? '',
    consumer_number: filters.consumer_number ?? '',
  })
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.get(route('offices.billings', office.office.office_code), formData)
  }

  return (
    <OfficeLayout
      breadcrumbs={breadcrumbs}
      officeNavItems={metadataNavItems}
      office={office.office}
      value='billing'
      heading='Office Billing'
      subHeading='Manage consumers billing'
    >
      <Card className='p-4'>
        <form onSubmit={handleSearch}>
          <div className='grid grid-cols-2 gap-4'>
            <SelectList
              label='Primary Purpose'
              list={primary_purposes}
              value={formData.primary_purpose}
              setValue={setFormValue('primary_purpose')}
              dataKey='id'
              displayKey='parameter_value'
              showAllOption={true}
              allOptionText='All'
            />
            <SelectList
              label='Consumer Type'
              list={consumer_types}
              value={formData.consumer_type}
              setValue={setFormValue('consumer_type')}
              dataKey='id'
              displayKey='parameter_value'
              showAllOption={true}
              allOptionText='All'
            />
            <Input
              label='Consumer Number'
              value={formData.consumer_number}
              setValue={setFormValue('consumer_number')}
              showClearButton={true}
            />
          </div>
          <div className='mt-4 flex'>
            <Button
              label='Search'
              type='submit'
            />
          </div>
        </form>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Consumer Number</TableHead>
              <TableHead>Organization Name</TableHead>
              <TableHead>Contract Demand</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {connections.data.map((connection) => (
              <TableRow key={connection.version_id}>
                <TableCell>{connection.consumer_number}</TableCell>
                <TableCell>{connection.contract_demand_kva_val}</TableCell>
              </TableRow>
            ))}
            <Pagination
              pagination={connections}
              filters={{
                primary_purpose: formData.primary_purpose,
                consumer_type: formData.consumer_type,
                consumer_number: formData.consumer_number,
              }}
            />
          </TableBody>
        </Table>
      </Card>
    </OfficeLayout>
  )
}
