import { Meter, MeterTransformer } from '@/interfaces/data_interfaces'
import { ParameterValues } from '@/interfaces/parameter_types'
import { handleHttpErrors, showError } from '@/ui/alerts'
import Input from '@/ui/form/Input'
import FullSpinner from '@/ui/FullSpinner'
import Modal from '@/ui/Modal/Modal'
import RestPagination from '@/ui/Pagination/RestPagination'
import { Paginator } from '@/ui/ui_interfaces'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  onClose: () => void
  onSelect: (meter: Meter) => void
  currentSelection?: Meter | null
}

export default function SelectUnassignedMeterModal({
  onClose,
  onSelect,
  currentSelection,
}: Readonly<Props>) {
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(currentSelection ?? null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<Paginator<Meter> | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchMeters = useCallback(async () => {
    setLoading(true)
    setPagination(null)
    setSelectedMeter(null)
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        page_size: 10,
      }

      if (debouncedSearch) {
        params.search = debouncedSearch
      }

      const {
        data,
      }: { data: { success: boolean; data: Paginator<Meter> | null; message: string } } =
        await axios.get<{ success: boolean; data: Paginator<Meter>; message: string }>(
          '/api/unassigned-meters',
          { params }
        )

      if (data.success) {
        setPagination(data.data)
      } else {
        showError(data.message)
        setPagination(null)
      }
    } catch (error) {
      handleHttpErrors(error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, debouncedSearch])

  useEffect(() => {
    fetchMeters()
  }, [fetchMeters])

  const selectMeter = (meter: Meter) => {
    onSelect(meter)
    onClose()
  }

  const handleClose = () => {
    setSearchQuery('')
    setCurrentPage(1)
    onClose()
  }

  return (
    <Modal
      setShowModal={handleClose}
      title='Select Meter'
      large
    >
      <div className='space-y-4'>
        <div className='flex gap-4'>
          <div className='flex-1'>
            <Input
              placeholder='Search by Meter serial...'
              value={searchQuery}
              setValue={setSearchQuery}
            />
          </div>
        </div>
        <div className='flex gap-4 border-b pb-4'></div>
        <div className='relative min-h-[400px]'>
          {loading && <FullSpinner />}
          {!loading && pagination?.data.length === 0 && (
            <div className='flex items-center justify-center py-12 text-gray-500 dark:text-gray-400'>
              {debouncedSearch
                ? `No transformers match "${debouncedSearch}"`
                : 'No unassigned transformers found'}
            </div>
          )}
          {!loading && pagination != null && pagination?.data.length > 0 && (
            <div className='flex flex-col gap-2'>
              {pagination.data.map((meter) => (
                <div
                  key={meter.meter_id}
                  className='rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm'
                  onClick={() => selectMeter(meter)}
                >
                  <div className='flex flex-wrap items-center gap-4 text-sm'>
                    <div className='flex items-center gap-1'>
                      <span className='font-medium text-slate-700'>Serial:</span>
                      <span className='text-slate-600'>{meter?.meter_serial ?? 'N/A'}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <span className='font-medium text-slate-700'>Type:</span>
                      <span className='text-slate-600'>
                        {meter?.meter_type?.parameter_value ?? 'N/A'}
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <span className='font-medium text-slate-700'>Programmable PT Ratio:</span>
                      <span className='text-slate-600'>{meter?.programmable_pt_ratio}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <span className='font-medium text-slate-700'>Programmable CT Ratio:</span>
                      <span className='text-slate-600'>{meter?.programmable_ct_ratio}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {pagination != null && (
          <RestPagination
            pagination={pagination}
            onNewPage={setCurrentPage}
          />
        )}
      </div>
    </Modal>
  )
}
