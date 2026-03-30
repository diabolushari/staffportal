import React, { useState } from 'react'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { ParameterValues } from '@/interfaces/parameter_types'
import Button from '@/ui/button/Button'
import SelectList from '@/ui/form/SelectList'
import Input from '@/ui/form/Input'
import StrongText from '@/typography/StrongText'
import { route } from 'ziggy-js'
import Card from '@/ui/Card/Card'
import MainLayout from '@/layouts/main-layout'
import type { BreadcrumbItem } from '@/types'
import { meteringBillingNavItems } from '@/components/Navbar/navitems'
import { ArrowLeft } from 'lucide-react'
import { router } from '@inertiajs/react'
import dayjs from 'dayjs'

interface MeteringTimezone {
  metering_timezone_id?: number
  pricing_type?: { id: number; parameter_value: string }
  timezone_type?: { id: number; parameter_value: string }
  timezone_name?: { id: number; parameter_value: string }
  from_hrs?: number
  from_mins?: number
  to_hrs?: number
  to_mins?: number
  created_by?: number
  updated_by?: number
}

interface Props {
  timezone?: MeteringTimezone
  pricingTypes: ParameterValues[]
  timezoneTypes: ParameterValues[]
  timezoneNames: ParameterValues[]
  isEdit?: boolean
}

export default function MeteringTimezoneFormPage({
  timezone,
  timezoneTypes,
  timezoneNames,
  isEdit = false,
}: Props) {
  const [timeSummary, setTimeSummary] = useState<string>('')

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
      title: 'Metering Timezones',
      href: route('meter-timezones.index'),
    },
    {
      title: isEdit ? 'Edit Timezone' : 'Create Timezone',
      href: isEdit
        ? route('meter-timezones.edit', timezone?.metering_timezone_id)
        : route('meter-timezones.create'),
    },
  ]

  const { formData, setFormValue } = useCustomForm({
    timezone_type_id: timezone?.timezone_type?.id?.toString() ?? '',
    timezone_name_id: timezone?.timezone_name?.id?.toString() ?? '',
    from_hrs: timezone?.from_hrs?.toString() ?? '',
    from_mins: timezone?.from_mins?.toString() ?? '',
    to_hrs: timezone?.to_hrs?.toString() ?? '',
    to_mins: timezone?.to_mins?.toString() ?? '',
    _method: isEdit ? 'PUT' : undefined,
  })

  const { post, errors, loading } = useInertiaPost<typeof formData>(
    isEdit
      ? route('meter-timezones.update', timezone?.metering_timezone_id)
      : route('meter-timezones.store')
  )

  const handleBack = () => {
    router.get(route('meter-timezones.index'))
  }

  // Utility to create readable time string
  const formatTime = (hrs: string, mins: string) =>
    `${hrs.padStart(2, '0')}:${mins.padStart(2, '0')}`

  // Compute time difference — supports next-day scenario
  const computeTimeSummary = (fromH: string, fromM: string, toH: string, toM: string) => {
    if (!fromH || !fromM || !toH || !toM) return ''

    const start = dayjs(`2000-01-01 ${formatTime(fromH, fromM)}`)
    let end = dayjs(`2000-01-01 ${formatTime(toH, toM)}`)

    // Handle "next day" scenario (e.g. 22:00 → 06:00)
    if (end.isBefore(start)) {
      end = end.add(1, 'day')
    }

    const duration = end.diff(start, 'minutes')
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60

    const nextDayText = end.isAfter(start, 'day') ? ' (next day)' : ''
    return `From ${formatTime(fromH, fromM)} to ${formatTime(toH, toM)}${nextDayText} — Duration: ${hours}h ${minutes}m`
  }

  // Update preview whenever user types
  const handleTimeChange = (key: string, value: string) => {
    setFormValue(key)(value)
    const { from_hrs, from_mins, to_hrs, to_mins } = {
      ...formData,
      [key]: value,
    }
    const summary = computeTimeSummary(from_hrs, from_mins, to_hrs, to_mins)
    setTimeSummary(summary)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  return (
    <MainLayout
      breadcrumb={breadcrumbs}
      navItems={meteringBillingNavItems}
      selectedItem='Metering Timezones'
      selectedTopNav='Consumers'
    >
      <div className='container mx-auto py-8'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='mb-2 text-3xl font-bold text-gray-800'>
              {isEdit ? 'Edit Metering Timezone' : 'Create New Metering Timezone'}
            </h1>
            <p className='text-gray-500'>
              {isEdit ? 'Update timezone configuration' : 'Configure a new metering timezone'}
            </p>
          </div>
          <div className='flex gap-2'>
            <Button
              label='Back to List'
              onClick={handleBack}
              variant='outline'
            />
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-6'
        >
          <Card className='overflow-hidden rounded-xl border border-gray-200 shadow-sm'>
            <div className='border-b-2 border-gray-200 px-6 py-3'>
              <StrongText className='text-base font-semibold'>Basic Information</StrongText>
            </div>
            <div className='mt-6 grid grid-cols-1 gap-6 p-6 md:grid-cols-2'>
              <SelectList
                label='Timezone Type'
                list={timezoneTypes}
                dataKey='id'
                displayKey='parameter_value'
                setValue={setFormValue('timezone_type_id')}
                value={formData.timezone_type_id}
                error={errors?.timezone_type_id}
                required
              />
            </div>
            <div className='mt-6 grid grid-cols-1 gap-6 p-6'>
              <SelectList
                label='Timezone Name'
                list={timezoneNames}
                dataKey='id'
                displayKey='parameter_value'
                setValue={setFormValue('timezone_name_id')}
                value={formData.timezone_name_id}
                error={errors?.timezone_name_id}
                required
              />
            </div>
          </Card>

          <Card className='overflow-hidden rounded-xl border border-gray-200 shadow-sm'>
            <div className='border-b-2 border-gray-200 px-6 py-3'>
              <StrongText className='text-base font-semibold'>Time Range Configuration</StrongText>
            </div>

            {timeSummary && (
              <div className='mx-6 mt-4 rounded-md border border-blue-200 bg-blue-50 p-3'>
                <p className='text-sm text-blue-700'>{timeSummary}</p>
              </div>
            )}

            <div className='mt-6 grid grid-cols-1 gap-6 p-6 md:grid-cols-2'>
              <div className='space-y-4'>
                <StrongText className='text-sm font-medium text-gray-700'>From Time</StrongText>
                <div className='grid grid-cols-2 gap-4'>
                  <Input
                    label='Hours (00-23)'
                    type='number'
                    min={0}
                    max={23}
                    setValue={(val) => handleTimeChange('from_hrs', val)}
                    value={formData.from_hrs}
                    placeholder='00'
                    required
                  />
                  <Input
                    label='Minutes (00-59)'
                    type='number'
                    min={0}
                    max={59}
                    setValue={(val) => handleTimeChange('from_mins', val)}
                    value={formData.from_mins}
                    placeholder='00'
                    required
                  />
                </div>
              </div>
              <div className='space-y-4'>
                <StrongText className='text-sm font-medium text-gray-700'>To Time</StrongText>
                <div className='grid grid-cols-2 gap-4'>
                  <Input
                    label='Hours (00-23)'
                    type='number'
                    min={0}
                    max={23}
                    setValue={(val) => handleTimeChange('to_hrs', val)}
                    value={formData.to_hrs}
                    placeholder='00'
                    required
                  />
                  <Input
                    label='Minutes (00-59)'
                    type='number'
                    min={0}
                    max={59}
                    setValue={(val) => handleTimeChange('to_mins', val)}
                    value={formData.to_mins}
                    placeholder='00'
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className='flex justify-end gap-4'>
            <Button
              label='Cancel'
              onClick={handleBack}
              variant='outline'
              disabled={loading}
              type='button'
            />
            <Button
              label={isEdit ? 'Update Timezone' : 'Create Timezone'}
              type='submit'
              disabled={loading}
              variant='primary'
            />
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
