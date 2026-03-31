import { billingNavItems } from '@/components/Navbar/navitems'
import { Button } from '@/components/ui/button'
import {
  ChargeHeadDefinition,
  Connection,
  SdBalanceSummary,
  SdRegister,
} from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import MainLayout from '@/layouts/main-layout'
import { BreadcrumbItem } from '@/types'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import LastAssessmentCard from './LastAssessmentCard'
import BalanceDetailCard from './BalanceDetailCard'
import LatestUpdateDetailCard from './LatestUpdateDetailCard'
import SdRegisterListByConnection from './SdRegisterListByConnection'
import RegisterDetailSheet from './RegisterDetailSheet'

interface Props {
  sdRegister?: SdRegister[]
  connection: Connection
  balanceSummary: SdBalanceSummary
  occupancyTypes: ParameterValues[]
  sdTypes: ChargeHeadDefinition[]
  sheetTitle?: string
  sheetAction?: (open: boolean) => void
  sheetOpen?: boolean
  sheetContent?: React.ReactNode
  page?: number
  pageSize?: number
  highlightedAction?: string
}

const breadcrumb: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Security Deposit',
    href: '/consumer-sd',
  },
  {
    title: 'SD Register',
    href: '/sd-register',
  },
  {
    title: 'SD Register Details',
    href: '#',
  },
]

const SdRegisterDetailView = ({
  sdRegister,
  connection,
  balanceSummary,
  occupancyTypes,
  sdTypes,
  sheetTitle,
  sheetAction,
  sheetOpen,
  sheetContent,
  page,
  pageSize,
  highlightedAction,
}: Props) => {
  const [showActions, setShowActions] = useState<boolean>(sheetOpen ?? false)

  const [localSheetOpen, setLocalSheetOpen] = useState(false)

  const handleSheetAction = (open: boolean) => {
    if (sheetAction) {
      sheetAction(open)
    } else {
      setLocalSheetOpen(open)
    }
  }
  useEffect(() => {
    if (!localSheetOpen) {
      setSelectedSdRegister(null)
    }
  }, [localSheetOpen])

  const ActionItems = [
    {
      label: 'Ad-hoc Assessment',
      value: 'ad-hoc',
      onClick: () =>
        router.get(route('sd-assessments.create', { connectionId: connection.connection_id })),
    },
    {
      label: 'Register Collection',
      value: 'collection',
      onClick: () =>
        router.get(
          route('sd-collections.create', {
            sdDemandId: sdRegister?.[0].sd_demand_id,
            connectionId: connection.connection_id,
          })
        ),
    },
    {
      label: 'Manage Refunds',
      value: 'refund',
      onClick: () =>
        router.get(
          route('sd-refunds-create', {
            connectionId: connection.connection_id,
            sdDemandId: sdRegister?.[0].sd_demand_id,
          })
        ),
    },
  ]

  useEffect(() => {
    if (!sheetOpen) {
      setShowActions(false)
      setSelectedSdRegister(null)
    }
  }, [sheetOpen])

  const [selectedSdRegister, setSelectedSdRegister] = useState<SdRegister | null>(null)

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      navItems={billingNavItems}
      title={`Security Deposits`}
      selectedItem='SD Register'
      selectedTopNav='Billing'
      description={
        <span>
          Security Deposit for Consumer number <b>{connection.consumer_number}</b>
        </span>
      }
      sheetTitle={selectedSdRegister ? `SD Register Details` : sheetTitle}
      sheetAction={sheetAction ?? handleSheetAction}
      sheetOpen={sheetOpen ?? localSheetOpen}
      sheetContent={
        selectedSdRegister ? <RegisterDetailSheet sdRegister={selectedSdRegister} /> : sheetContent
      }
    >
      <div className='relative ml-auto w-48'>
        <Button
          className='w-full'
          variant={'default'}
          onClick={() => setShowActions(!showActions)}
        >
          ACTIONS
        </Button>

        {showActions && (
          <div className='absolute right-0 z-50 mt-2 w-full rounded-md border bg-white shadow-lg'>
            <ul className='py-1 text-sm'>
              {ActionItems.map((tab) => (
                <li
                  key={tab.value}
                  onClick={tab.onClick}
                  className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                    tab.value === highlightedAction ? 'bg-kseb-bg-blue text-kseb-primary' : ''
                  }`}
                >
                  {tab.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2'>
          <span className='text-sm text-gray-900'>
            <b>{connection.consumer_profiles?.[0]?.consumer_name}</b>
          </span>
        </div>
        <div className='flex gap-2'>
          <label className='text-sm font-medium text-gray-700'>Consumer Number : </label>
          <span className='text-sm text-gray-900'>{connection.consumer_number}</span>
        </div>
        <div className='flex gap-2'>
          <label className='text-sm font-medium text-gray-700'>Legacy Code : </label>
          <span className='text-sm text-gray-900'>{connection.consumer_legacy_code}</span>
        </div>
      </div>
      <LastAssessmentCard sdRegister={sdRegister} />
      <BalanceDetailCard
        sdRegister={sdRegister}
        balanceSummary={balanceSummary}
      />
      <LatestUpdateDetailCard sdRegister={sdRegister} />
      <SdRegisterListByConnection
        connection={connection}
        occupancyTypes={occupancyTypes}
        sdTypes={sdTypes}
        page={page}
        pageSize={pageSize}
        selectedSdRegister={selectedSdRegister}
        setSelectedSdRegister={setSelectedSdRegister}
        sheetAction={handleSheetAction}
      />
    </MainLayout>
  )
}

export default SdRegisterDetailView
