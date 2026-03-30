import { MeterTransformer } from '@/interfaces/data_interfaces'
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
  onSelect: (transformer: MeterTransformer) => void
  currentSelection?: MeterTransformer | null
  transformerTypes: ParameterValues[]
}

export default function SelectUnassignedTransformerModal({
  onClose,
  onSelect,
  currentSelection,
  transformerTypes,
}: Readonly<Props>) {
  const [selectedTransformer, setSelectedTransformer] = useState<MeterTransformer | null>(
    currentSelection ?? null
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<number | null>(() => {
    if (transformerTypes.length === 0) {
      return null
    }
    return transformerTypes[0].id ?? null
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<Paginator<MeterTransformer> | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchTransformers = useCallback(async () => {
    setLoading(true)
    setPagination(null)
    setSelectedTransformer(null)
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        page_size: 10,
      }

      if (debouncedSearch) {
        params.search = debouncedSearch
      }

      if (typeFilter != null) {
        params.type_id = typeFilter
      }

      const {
        data,
      }: { data: { success: boolean; data: Paginator<MeterTransformer> | null; message: string } } =
        await axios.get<{ success: boolean; data: Paginator<MeterTransformer>; message: string }>(
          '/api/unassigned-transformers',
          { params }
        )
      console.log(data)
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
  }, [currentPage, debouncedSearch, typeFilter])

  useEffect(() => {
    fetchTransformers()
  }, [fetchTransformers])

  const selectTransformer = (transformer: MeterTransformer) => {
    onSelect(transformer)
    onClose()
  }

  const handleClose = () => {
    setSearchQuery('')
    setTypeFilter(null)
    setCurrentPage(1)
    onClose()
  }

  console.log(typeFilter)

  return (
    <Modal
      setShowModal={handleClose}
      title='Select CT/PT Transformer'
      large
    >
      <div className='space-y-4'>
        <div className='flex gap-4'>
          <div className='flex-1'>
            <Input
              placeholder='Search by CTPT serial...'
              value={searchQuery}
              setValue={setSearchQuery}
            />
          </div>
        </div>
        <div className='flex gap-4 border-b pb-4'>
          {transformerTypes.map((type) => (
            <label
              className='flex cursor-pointer items-center gap-2'
              key={type.id.toString()}
            >
              <input
                type='radio'
                name='typeFilter'
                value={type.id}
                checked={typeFilter === type.id}
                onChange={() => {
                  setTypeFilter(type.id)
                  setCurrentPage(1)
                }}
                className='cursor-pointer'
              />
              <span className='text-sm'>{type.parameter_value}</span>
            </label>
          ))}
        </div>
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
              {pagination.data.map((ctpt) => (
                <div
                  key={ctpt.meter_ctpt_id}
                  className='rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm'
                  onClick={() => selectTransformer(ctpt)}
                >
                  <div className='flex flex-wrap items-center gap-4 text-sm'>
                    <div className='flex items-center gap-1'>
                      <span className='font-medium text-slate-700'>Serial:</span>
                      <span className='text-slate-600'>{ctpt?.ctpt_serial ?? 'N/A'}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <span className='font-medium text-slate-700'>Type:</span>
                      <span className='text-slate-600'>{ctpt?.type?.parameter_value ?? 'N/A'}</span>
                    </div>
                    {ctpt?.ratio_primary_value != null && ctpt?.ratio_secondary_value != null && (
                      <div className='flex items-center gap-1'>
                        <span className='font-medium text-slate-700'>Ratio:</span>
                        <span className='text-slate-600'>
                          {ctpt?.ratio_primary_value} / {ctpt?.ratio_secondary_value}
                        </span>
                      </div>
                    )}
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
