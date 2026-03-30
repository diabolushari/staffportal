import React from 'react'

export interface FieldConfig {
  label: string
  key: string
}

interface ViewParameterDetailProps {
  title: string
  data: any
  fields: FieldConfig[]
}

const ViewParameterDetail: React.FC<ViewParameterDetailProps> = ({ title, data, fields }) => {
  return (
    <div className='flex min-h-screen justify-center bg-gray-50 px-4 py-8'>
      <div className='w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-lg'>
        <h2 className='mb-6 border-b pb-3 text-2xl font-bold text-gray-800'>{title}</h2>
        <div className='grid gap-4'>
          {fields.map((field) => (
            <div
              key={field.key}
              className='flex justify-between border-b pb-3'
            >
              <span className='text-base font-semibold text-gray-700'>{field.label}</span>

              <span className='max-w-[60%] text-right text-base break-words text-gray-900'>
                {data[field.key] !== undefined && data[field.key] !== null ? (
                  data[field.key]
                ) : (
                  <span className='text-gray-400 italic'>Not Available</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ViewParameterDetail
