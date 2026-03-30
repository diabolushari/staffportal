import { metadataNavItems } from '@/components/Navbar/navitems'
import { Calendar } from '@/interfaces/data_interfaces'
import MainLayout from '@/layouts/main-layout'
import { Paginator } from '@/ui/ui_interfaces'
import CalendarTable from './CalendarTable'

export default function CalendarDayList({ calendar }: { calendar: Paginator<Calendar> }) {
  return (
    <MainLayout
      title='Calendar'
      navItems={metadataNavItems}
      selectedItem='Calendar'
      description='Manage calendar entries, holidays and weekends'
    >
      <CalendarTable calendar={calendar} />
    </MainLayout>
  )
}
