import { metadataNavItems } from '@/components/Navbar/navitems'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterDefinition } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import NormalText from '@/typography/NormalText'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Input from '@/ui/form/Input'
import { router } from '@inertiajs/react'

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
  {
    title: 'Create Parameter Definition',
    href: '/parameter-definition/create',
  },
]

export default function ParameterDefinitionAction({ data }: { data: ParameterDefinition }) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    name: data?.parameter_name ?? '',
    attribute1_name: data?.attribute1_name ?? '',
    attribute2_name: data?.attribute2_name ?? '',
    attribute3_name: data?.attribute3_name ?? '',
    attribute4_name: data?.attribute4_name ?? '',
    attribute5_name: data?.attribute5_name ?? '',
    is_effective_date_driven: data?.is_effective_date_driven ?? false,
    domain_id: data?.domain_id ?? 0,
  })

  const { post, errors } = useInertiaPost(
    data ? route('parameter-definition.update', data.id) : route('parameter-definition.store'),
    {
      onComplete: () => router.visit(route('parameter-definition.index')),
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(data ? { ...formData, _method: 'PUT' } : formData)
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={metadataNavItems}
      selectedItem='Definitions'
    >
      <div className='flex items-center justify-center'>
        <div className='w-3/4 items-center justify-center rounded-xl bg-white p-8 py-8 shadow-md'>
          <h2 className='mb-4 text-2xl font-bold'>
            {data ? 'Edit' : 'Create'} Parameter Definition
          </h2>
          <form onSubmit={handleSubmit}>
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='col-span-2 flex flex-col'>
                <DynamicSelectList
                  url='/api/parameter-domains'
                  dataKey='id'
                  displayKey='name'
                  setValue={setFormValue('domain_id')}
                  value={formData.domain_id}
                  label='Parameter Domain'
                  required
                  error={errors?.domain_id}
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Parameter Name'
                  value={formData.name}
                  setValue={setFormValue('name')}
                  error={errors?.name}
                  required
                />
              </div>
              <div className='flex flex-col'>
                <CheckBox
                  label='Is Effective Date Driven'
                  value={formData.is_effective_date_driven}
                  toggleValue={toggleBoolean('is_effective_date_driven')}
                />
              </div>
              <div className='col-span-2'>
                <NormalText>Attributes</NormalText>
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Attribute 1'
                  value={formData.attribute1_name}
                  setValue={setFormValue('attribute1_name')}
                  error={errors?.attribute1_name}
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Attribute 2'
                  value={formData.attribute2_name}
                  setValue={setFormValue('attribute2_name')}
                  error={errors?.attribute2_name}
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Attribute 3'
                  value={formData.attribute3_name}
                  setValue={setFormValue('attribute3_name')}
                  error={errors?.attribute3_name}
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Attribute 4'
                  value={formData.attribute4_name}
                  setValue={setFormValue('attribute4_name')}
                  error={errors?.attribute4_name}
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Attribute 5'
                  value={formData.attribute5_name}
                  setValue={setFormValue('attribute5_name')}
                  error={errors?.attribute5_name}
                />
              </div>
            </div>
            <div className='mt-6 flex justify-between gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => window.history.back()}
                label='Cancel'
              />
              <Button
                type='submit'
                label='Save'
              />
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}
