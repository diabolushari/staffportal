import { Office, OfficeHierarchy } from '@/interfaces/data_interfaces'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterValues } from '@/interfaces/parameter_types'
import React, { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import Input from '@/ui/form/Input'
import TextArea from '@/ui/form/TextArea'
import SelectList from '@/ui/form/SelectList'
import Button from '@/ui/button/Button'
import StrongText from '@/typography/StrongText'
import { Card } from '../ui/card'
import ParentOfficeModal from './ParentOfficeModal'
import { Building, MapPin } from 'lucide-react'
import DeleteButton from '@/ui/button/DeleteButton'

interface Props {
  parameterValues: ParameterValues[]
  office?: Office
  officeHierarchies: OfficeHierarchy[]
}

export default function OfficeForm({
  parameterValues,
  office,
  officeHierarchies,
}: Readonly<Props>) {
  const [sortPriority, setSortPriority] = useState<number | null | undefined>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { formData, setFormValue } = useCustomForm({
    office_name: office?.office_name ?? '',
    office_code: office?.office_code ?? '',
    office_description: office?.office_description ?? '',
    office_type_id: office?.office_type_id ?? '',
    parent_offices: office?.parent_offices ?? [],
    _method: office != null ? 'PUT' : undefined,
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    office ? route('offices.update', office.office_id) : route('offices.store'),
    {
      showErrorToast: true,
      onComplete: () => {
        router.visit(route('offices.index'))
      },
    }
  )

  useEffect(() => {
    const sortPriorityValue = parameterValues.find(
      (item: ParameterValues) => item.id == Number(formData.office_type_id)
    )
    setSortPriority(sortPriorityValue?.sort_priority)
  }, [formData.office_type_id, parameterValues])

  const handleAddParentOffice = (entry: any) => {
    // prevent duplicate hierarchy
    const exists = formData.parent_offices.some((po: any) => po.hierarchy_id === entry.hierarchy_id)
    if (exists) return

    const updated = [...formData.parent_offices, entry].sort((a, b) => {
      if (a.hierarchy_code === b.hierarchy_code) {
        return a.office_code.localeCompare(b.office_code)
      }
      return a.hierarchy_code.localeCompare(b.hierarchy_code)
    })

    setFormValue('parent_offices')(updated)
  }

  const handleRemoveParentOffice = (hierarchyId: number) => {
    const updated = formData.parent_offices.filter((po: any) => po.hierarchy_id !== hierarchyId)
    setFormValue('parent_offices')(updated)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload = {
      ...formData,
      parent_offices: formData.parent_offices.map((po: any) => ({
        hierarchy_code: po.hierarchy_code,
        office_code: po.office_code,
      })),
    }
    post(payload)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-4'
    >
      <Card>
        <div className='flex justify-between border-b-2 border-gray-200 py-4'>
          <StrongText className='text-base font-semibold'>Basic Information</StrongText>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-8 p-4 md:grid-cols-2'>
          <SelectList
            label='Office Type'
            setValue={setFormValue('office_type_id')}
            value={formData.office_type_id}
            placeholder='Select Office Type'
            error={errors?.office_type_id}
            dataKey='id'
            displayKey='parameter_value'
            list={parameterValues}
          />

          <Input
            label='Name'
            setValue={setFormValue('office_name')}
            value={formData.office_name}
            error={errors?.office_name}
            type='text'
          />

          <Input
            label='Office Code'
            setValue={setFormValue('office_code')}
            value={formData.office_code}
            error={errors?.office_code}
            type='number'
            disabled={office != null}
          />

          <TextArea
            label='Office Description'
            setValue={setFormValue('office_description')}
            value={formData.office_description}
            error={errors?.office_description}
          />
        </div>
      </Card>

      {/* Parent Offices Section */}
      {officeHierarchies && (
        <Card>
          <div className='flex justify-between border-b-2 border-gray-200 py-4'>
            <StrongText className='text-base font-semibold'>Parent Offices</StrongText>

            {/* Only show Add button if not all hierarchies used */}
            {formData?.parent_offices?.length < officeHierarchies?.length && (
              <Button
                type='button'
                label='Add'
                variant='primary'
                onClick={() => setIsModalOpen(true)}
              />
            )}
          </div>
          <Card className='rounded-lg p-7'>
            <div className='space-y-2 p-4'>
              {formData.parent_offices.length === 0 && (
                <p className='text-sm text-gray-500'>No parent offices added.</p>
              )}

              {formData.parent_offices.map((po: any) => (
                <>
                  <div className=''>
                    <div className='rounded-lg border border-gray-200 p-2.5'>
                      <div className='flex items-start justify-between p-2.5'>
                        <div className='flex-1 space-y-2.5'>
                          <div className='space-y-1'>
                            <div className='flex items-center gap-3'>
                              <div className='text-base font-semibold text-black'>
                                {po.office_name}
                              </div>
                              <div className='rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-normal text-blue-800'>
                                {po.office_code}
                              </div>
                            </div>
                            <div className='flex items-center gap-5'>
                              <div className='flex items-center gap-1'>
                                <Building className='h-3.5 w-3.5 text-gray-400' />
                                <span className='text-sm font-normal text-[#252c32]'>
                                  {po.hierarchy_code}
                                </span>
                              </div>
                              <div className='flex items-center gap-1'>
                                <MapPin className='h-3.5 w-3.5 text-gray-400' />
                                <span className='text-sm font-normal text-[#252c32]'>
                                  {po.hierarchy_code}
                                </span>
                              </div>
                            </div>
                            <div className='text-sm font-normal text-[#252c32]'>
                              {po.hierarchy_code}
                            </div>
                          </div>
                        </div>
                        <div className='flex flex-col items-end gap-2 p-2.5'>
                          <div className='rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-normal text-[#1c6534]'>
                            {po.is_current ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        <DeleteButton onClick={() => handleRemoveParentOffice(po.hierarchy_id)} />
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </Card>
        </Card>
      )}
      <div className='flex justify-end'>
        <Button
          type='submit'
          disabled={loading}
          label='Submit'
          variant='primary'
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ParentOfficeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddParentOffice}
          officeHierarchies={officeHierarchies}
          alreadySelected={formData.parent_offices.map((po: any) => po.hierarchy_id)} // 👈 pass selected
        />
      )}
    </form>
  )
}
