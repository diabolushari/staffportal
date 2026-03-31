import ConnectionsLayout from '@/layouts/connection/ConnectionsLayout'
import { consumerNavItems } from '../../components/Navbar/navitems'
import StrongText from '@/typography/StrongText'
import { Card } from '../../components/ui/card'
import { Cpu, Factory, Shield, Barcode, Hash, Zap, Settings, Calendar, Box } from 'lucide-react'
import { Connection, Meter, MeterTransformer } from '@/interfaces/data_interfaces'
import DeleteButton from '@/ui/button/DeleteButton'
import { useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import AddButton from '@/ui/button/AddButton'
import { router } from '@inertiajs/react'
import { BreadcrumbItem } from '@/types'

interface Transformer {
  meter: Meter
  transformers: {
    transformer: MeterTransformer
    version_id?: number
  }[]
}
interface Props {
  connection: Connection
  transformers: Transformer[]
}

export default function MeterTransformerTab({ connection, transformers }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTransformer, setSelectedTransformer] = useState<any | null>(null)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Connections',
      href: route('connections.index'),
    },
    {
      title: connection?.consumer_number.toString(),
      href: route('connections.show', connection?.connection_id),
    },
    {
      title: 'Transformers',
      href: route('connections.meters.ctpts', connection?.connection_id),
    },
  ]

  function handleDeleteClick(item: any) {
    setShowDeleteModal(true)
    setSelectedTransformer({
      ...item,
      version_id: item.version_id,
    })
  }

  const handleAddClick = (item: any) => {
    console.log(connection?.connection_id, item?.meter_id)
    router.get(
      route('connections.meters.ctpt.create', {
        connection_id: connection?.connection_id,
        id: item?.meter_id,
      })
    )
  }

  return (
    <ConnectionsLayout
      connectionsNavItems={consumerNavItems}
      value='configuration'
      subTabValue='meter-ctpts'
      heading='Connection Details'
      description={
        <>
          CTPTs connected with meters for Consumer Number {'  '}
          <span className='font-bold'>{connection?.consumer_number}</span>
        </>
      }
      breadcrumbs={breadcrumbs}
      connectionId={connection.connection_id}
      connection={connection}
    >
      <Card className='relative w-full rounded-lg bg-white'>
        <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
          <StrongText className='text-lg font-semibold text-gray-900'>
            Meter & CTPT Connections
          </StrongText>
        </div>

        <div className='flex flex-col px-6 pb-6'>
          {transformers && transformers.length > 0 ? (
            transformers.map((row, idx) => {
              const meter = row.meter
              const ctpts = row.transformers

              return (
                <div
                  key={idx}
                  className='mb-4 rounded-lg border border-gray-200 bg-white px-4 py-4 transition-shadow hover:shadow-md'
                >
                  {/* Meter Section */}
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='font-inter flex justify-between text-lg font-semibold text-black'>
                        {meter?.meter_serial}
                      </div>

                      <div className='mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600'>
                        {meter.meter_type && (
                          <div className='flex items-center gap-1'>
                            <Cpu className='h-4 w-4 text-slate-500' />
                            Type: {meter.meter_type.parameter_value}
                          </div>
                        )}

                        {meter.meter_make && (
                          <div className='flex items-center gap-1'>
                            <Factory className='h-4 w-4 text-slate-500' />
                            Make: {meter.meter_make.parameter_value}
                          </div>
                        )}

                        {meter.accuracy_class && (
                          <div className='flex items-center gap-1'>
                            <Shield className='h-4 w-4 text-slate-500' />
                            Accuracy: {meter.accuracy_class.parameter_value}
                          </div>
                        )}

                        {meter.ownership_type && (
                          <div className='flex items-center gap-1'>
                            <Barcode className='h-4 w-4 text-slate-500' />
                            Owner: {meter.ownership_type.parameter_value}
                          </div>
                        )}
                      </div>
                    </div>
                    <AddButton
                      buttonText='Add CTPT'
                      onClick={() => handleAddClick(meter)}
                    />
                  </div>

                  {/* CTPT List */}
                  <div className='mt-4 space-y-3 border-l-2 border-gray-300 pl-3'>
                    {ctpts && ctpts.length > 0 ? (
                      ctpts.map((ctpt) => (
                        <div
                          key={ctpt.transformer.meter_ctpt_id}
                          className='text-sm text-slate-800'
                        >
                          <div className='flex flex-wrap items-center gap-4'>
                            <Box className='h-4 w-4 text-slate-500' />
                            <strong>CTPT Serial:</strong> {ctpt.transformer.ctpt_serial}
                          </div>

                          <div className='mt-1 ml-7 flex flex-wrap gap-4 text-slate-600'>
                            {ctpt.transformer.type && (
                              <span className='flex items-center gap-1'>
                                <Zap className='h-3 w-3 text-slate-400' />
                                {ctpt.transformer.type.parameter_value}
                              </span>
                            )}

                            {ctpt.transformer.make && (
                              <span className='flex items-center gap-1'>
                                <Factory className='h-3 w-3 text-slate-400' />
                                {ctpt.transformer.make.parameter_value}
                              </span>
                            )}

                            {ctpt.transformer.accuracy_class && (
                              <span className='flex items-center gap-1'>
                                <Shield className='h-3 w-3 text-slate-400' />
                                Acc: {ctpt.transformer.accuracy_class.parameter_value}
                              </span>
                            )}

                            {ctpt.transformer.burden && (
                              <span className='flex items-center gap-1'>
                                <Settings className='h-3 w-3 text-slate-400' />
                                Burden: {ctpt.transformer.burden.parameter_value}
                              </span>
                            )}

                            {ctpt.transformer.ratio_primary_value && (
                              <span className='flex items-center gap-1'>
                                <Hash className='h-3 w-3 text-slate-400' />
                                Ratio: {ctpt.transformer.ratio_primary_value}/
                                {ctpt.transformer.ratio_secondary_value}
                              </span>
                            )}

                            {ctpt.transformer.manufacture_date && (
                              <span className='flex items-center gap-1'>
                                <Calendar className='h-3 w-3 text-slate-400' />
                                Mfg: {ctpt.transformer.manufacture_date}
                              </span>
                            )}
                          </div>
                          <div>
                            <DeleteButton onClick={() => handleDeleteClick(ctpt)} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='ml-2 text-sm text-slate-500'>
                        No CTPTs connected for this meter
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className='p-8 text-center text-slate-500'>
              <div className='flex flex-col items-center gap-2'>
                <Cpu className='h-12 w-12 text-slate-300' />
                <p className='text-lg font-medium'>No Transformers Found</p>
                <p className='text-sm'>CTPTs are not associated with any meter.</p>
              </div>
            </div>
          )}
        </div>
      </Card>
      {showDeleteModal && selectedTransformer && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete CTPT ${selectedTransformer?.transformer.ctpt_serial}`}
          url={route('meter-ctpt-rel.destroy', selectedTransformer?.version_id)}
        />
      )}
    </ConnectionsLayout>
  )
}
