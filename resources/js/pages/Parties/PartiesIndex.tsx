import { consumerNavItems } from '@/components/Navbar/navitems'
import { Party } from '@/interfaces/parties'
import MainLayout from '@/layouts/main-layout'
import PartyList from '@/ui/List/PartiesList'
import ListSearch from '@/ui/Search/ListSearch'
import { route } from 'ziggy-js'

//TODO seperate badge component

interface Props {
  parties: {
    success: boolean
    data: Party[]
    error: unknown
  }
}
const breadcrumbs = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Parties',
    href: '/parties',
  },
]

//TODO  fix errors
export default function PartiesIndex({ parties }: Props) {
  const items = parties?.data ?? null

  //TODO sepertate component

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={consumerNavItems}
      addBtnText='Party'
      addBtnUrl={route('parties.create')}
      title='Parties'
      selectedItem='Parties'
      selectedTopNav='Consumers'
    >
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4'>
        {/* Controls */}
        <ListSearch
          title=''
          placeholder='Find Parties'
          url={route('parties.index')}
          //setItems={setItems}
          search={''}
        />

        <div>
          {items != null && items.length > 0 && <PartyList parties={items} />}
          {items == null || items.length === 0 ? <p>No Parties Found.</p> : null}
        </div>

        {/* Controls */}
        {/* <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">

        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          <div className='flex-1'>
            <input
              type='text'
              placeholder='Search by ID, Code, Name, Email, Phone...'
              className='w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-0 outline-none focus:border-slate-400'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className='flex gap-2'>
            <select
              className='rounded-md border border-slate-300 bg-white px-3 py-2 text-sm'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value='all'>All statuses</option>
              <option value='Active'>Active</option>
              <option value='Blacklisted'>Blacklisted</option>
              <option value='Unknown'>Unknown</option>
            </select>
            <select
              className='rounded-md border border-slate-300 bg-white px-3 py-2 text-sm'
              value={currentFilter}
              onChange={(e) => setCurrentFilter(e.target.value)}
            >
              <option value='all'>All records</option>
              <option value='current'>Current only</option>
              <option value='archived'>Archived only</option>
            </select>
          </div>
        </div>

        {/* <Card>
          <CustomTable
            columns={[
              'S.No',
              headerButton('Party Code', 'party_code'),
              'Legacy Code',
              headerButton('Name', 'name'),
              headerButton('Status', 'status_text'),
              headerButton('Effective Start', 'effective_start'),
              'Email',
              'Phone',
              'Actions',
            ]}
            caption='List of parties'
            emptyState={
              !parties?.success
                ? 'Failed to load parties. Please try refreshing.'
                : 'No parties found.'
            }
          >
            {rows.map((item, index) => {
              const statusText = item.status_text
              const tone = getStatusTone(statusText)

              return (
                <TableRow
                  key={item.version_id}
                  className='hover:bg-slate-50'
                >
                  <TableCell className='text-slate-500'>{index + 1}</TableCell>
                  <TableCell className='tabular-nums'>{item.party_code}</TableCell>
                  <TableCell>{item.party_legacy_code ?? '-'}</TableCell>
                  <TableCell className='max-w-[220px] truncate'>{item.name ?? '-'}</TableCell>
                  <TableCell>
                    <StatusBadge
                      text={statusText}
                      tone={tone}
                    />
                  </TableCell>

                  <TableCell title={item.effective_start ?? ''}>
                    {item.effective_start ? new Date(item.effective_start).toLocaleString() : '-'}
                  </TableCell>
                  <TableCell
                    className='max-w-[220px] truncate'
                    title={item.email_address ?? ''}
                  >
                    {item.email_address ?? '-'}
                  </TableCell>
                  <TableCell
                    className='max-w-[160px] truncate'
                    title={item.phone}
                  >
                    {item.phone || '-'}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <EditButton onClick={() => handleEditClick(item)} />
                      <DeleteButton onClick={() => handleDeleteClick(item)} />
                      <a
                        href={route('parties.show', item.version_id)}
                        className='rounded-md px-2 py-1 text-sm text-blue-600 hover:bg-blue-50'
                      >
                        View
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </CustomTable>
        </Card> */}
      </div>
    </MainLayout>
  )
}
