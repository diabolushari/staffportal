import AddStationConsumerModal from '@/components/GeneratingStation/AddStationConsumerModal'
import ConsumerStationList from '@/components/GeneratingStation/ConsumerStationList'
import StationBalanceCard from '@/components/GeneratingStation/StationBalanceCard'
import { consumerNavItems } from '@/components/Navbar/navitems'
import { Connection, GeneratingStation, StationConsumerRel } from '@/interfaces/data_interfaces'
import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { BreadcrumbItem } from '@/types'
import AddButton from '@/ui/button/AddButton'
import { router } from '@inertiajs/react'
import { useState } from 'react'
import dayjs from 'dayjs'

interface Props {
  connection: Connection
  stations: GeneratingStation[]
  relations: StationConsumerRel[]
  openSheet?: boolean
}

export default function StationConsumerRelCreate({
  connection,
  stations,
  relations,
  openSheet = false,
}: Readonly<Props>) {
  const [showModal, setShowModal] = useState(false)
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: connection?.consumer_number,
      href: `/connections/${connection?.connection_id}`,
    },
    {
      title: 'Stations',
      href: `/connection/${connection?.connection_id}/station-consumer-rels`,
    },
    {
      title: 'Add Station Consumer',
      href: '#',
    },
  ]

  const [sheetOpen, setSheetOpen] = useState(openSheet ?? false)
  const [selectedRelation, setSelectedRelation] = useState<StationConsumerRel | null>(null)

  return (
    <ConnectionsLayout
      connection={connection}
      connectionId={connection?.connection_id}
      value={'connection'}
      subTabValue='stations'
      heading='Stations'
      description={
        <>
          Add station consumer <span className='font-bold'>{connection?.consumer_number}</span>
        </>
      }
      breadcrumbs={breadcrumbs}
      connectionsNavItems={consumerNavItems}
      sheetTitle='Station Balances'
      sheetOpen={sheetOpen}
      sheetAction={setSheetOpen}
      sheetContent={
        selectedRelation &&
        (() => {
          const summaries = selectedRelation.station?.unit_bank_summaries ?? []

          if (summaries.length === 0) return null

          const latestMonth = Math.max(...summaries.map((s) => s.bill_year_month))

          const latestSummaries = summaries.filter((s) => s.bill_year_month === latestMonth)

          const totalBalance = latestSummaries.reduce(
            (sum, item) => sum + (item.closing_balance || 0),
            0
          )

          const balanceDate = dayjs(String(latestMonth), 'YYYYMM').format('MMM YYYY')

          const timezoneOrder = ['Normal', 'Peak', 'Off Peak']

          const sorted = latestSummaries.sort((a, b) => {
            const aIndex = timezoneOrder.indexOf(a.timezone?.parameter_value ?? '')
            const bIndex = timezoneOrder.indexOf(b.timezone?.parameter_value ?? '')
            return aIndex - bIndex
          })

          const lastThree = sorted.slice(-3)
          console.log(selectedRelation.station?.unit_bank_summaries)
          return (
            <div className='flex h-full flex-col gap-4 p-4'>
              <div className='text-xs text-gray-400'>CURRENT STATION</div>

              <div className='flex w-full font-medium'>
                {selectedRelation.station?.station_name ?? '-'}
              </div>

              <div className='mt-2 flex justify-between text-sm'>
                <div className='text-gray-500'>Balance as of date </div>
                <div className='font-medium'>{balanceDate}</div>
              </div>

              <div className='mt-2 flex justify-between text-sm'>
                <div className='text-gray-500'>Total Balance</div>
                <div className='font-semibold text-blue-600'>{totalBalance} Units</div>
              </div>

              {lastThree.map((item, index) => (
                <StationBalanceCard
                  key={index}
                  timeWindow={''}
                  timezone={item.timezone?.parameter_value ?? '-'}
                  availableUnits={item.closing_balance ?? 0}
                />
              ))}
              <div className='mt-4 border-t pt-4'>
                <div
                  className='cursor-pointer rounded-lg border p-3 transition hover:bg-gray-50'
                  onClick={() =>
                    router.visit(`/generating-stations/${selectedRelation.station?.station_id}`)
                  }
                >
                  <div className='text-sm font-medium text-blue-600 hover:underline'>
                    Station Details
                  </div>
                </div>
              </div>
            </div>
          )
        })()
      }
    >
      <div className='flex justify-end p-5'>
        <AddButton
          buttonText='Add Station'
          onClick={() => setShowModal(true)}
        />
      </div>

      {showModal && (
        <AddStationConsumerModal
          connection={connection}
          stations={stations}
          setShowModal={setShowModal}
        />
      )}
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-6'>
        {/* <ConsumerStationList relations={relations} /> */}
        <ConsumerStationList
          relations={relations}
          onViewBalance={(rel) => {
            setSelectedRelation(rel)
            setSheetOpen(true)
          }}
        />
      </div>
    </ConnectionsLayout>
  )
}
