import { metadataNavItems } from '@/components/Navbar/navitems'
import ViewParameterDetails from '@/components/Parameter/ViewParameterDetails' // adjust path
import { ParameterDomain } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'

export default function ParameterDomainShow({ domain }: { domain: ParameterDomain }) {
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
      title: 'Parameter Domains',
      href: '/parameter-domain',
    },
    {
      title: 'Detail',
      href: `/parameter-domain/${domain.id}`,
    },
  ]
  const fields = [
    { label: 'Domain Name', key: 'domainName' },
    { label: 'Description', key: 'description' },
    { label: 'Domain Code', key: 'domainCode' },
    { label: 'Managed By Module', key: 'managedByModuleName' },
  ]

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={metadataNavItems}
      selectedItem='Domains'
    >
      <CardHeader
        title='Parameter Domain'
        subheading='Parameter Domain Details'
      />
      <Card className='p-4'>
        <ViewParameterDetails
          title='Parameter Domain'
          data={domain}
          fields={fields}
        />
      </Card>
    </MainLayout>
  )
}
