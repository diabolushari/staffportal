import MainLayout from '@/layouts/main-layout'

export default function UItest() {
  return (
    <MainLayout
      breadcrumb={[
        {
          title: 'UI Test',
          href: '/page-ui',
        },
      ]}
    >
      <div></div>
    </MainLayout>
  )
}
