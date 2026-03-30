import React, { ChangeEvent, useId } from 'react'
import { XIcon, UploadIcon } from 'lucide-react'
import StrongText from '@/typography/StrongText'
import Paragraph from '@/typography/Paragraph'
import ErrorText from '@/typography/ErrorText'

export interface Props {
  file?: File | null
  label?: string
  error?: string
  styles?: string
  setValue: (value: File | null) => unknown
  accept?: string
}

function fileSizeInMB(sizeInBytes?: number): string {
  return ((sizeInBytes ?? 0) / (1024 * 1024)).toFixed(2)
}

export default function FileInput({ file, label, error, setValue, accept }: Props) {
  const inputId = useId()

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue(e.target.files[0])
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      {label && <label className='small-1stop standard-label'>{label}</label>}

      {/* No file selected */}
      {file == null && (
        <div className='flex items-center gap-3'>
          <input
            id={inputId}
            type='file'
            onChange={onFile}
            accept={accept}
            className='hidden'
          />

          <label
            htmlFor={inputId}
            className='inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          >
            <UploadIcon size={16} />
            Choose file
          </label>

          <span className='text-sm text-slate-500'>No file chosen</span>
        </div>
      )}

      {/* File selected */}
      {file != null && (
        <div className='flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3'>
          <div className='flex flex-col'>
            <StrongText>{file.name}</StrongText>
            <Paragraph>
              {fileSizeInMB(file.size)} MB · {file.type || 'Unknown type'}
            </Paragraph>
          </div>

          <button
            type='button'
            onClick={() => setValue(null)}
            className='rounded-md p-2 text-red-500 transition hover:bg-red-100'
            aria-label='Remove file'
          >
            <XIcon size={18} />
          </button>
        </div>
      )}

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}
