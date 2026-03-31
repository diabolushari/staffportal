import React from 'react'
import { FormFieldProp } from '../ui_interfaces'

export default function TimePicker({
  label,
  value,
  error,
  setValue,
  placeholder,
  disabled = false,
  readonly = false,
}: FormFieldProp) {
  return (
    <>
      <label className='small-1stop mb-1 text-sm tracking-normal text-gray-800'>{label}</label>
      <input
        type='time'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className='bg-accent-light rounded-lg border border-gray-300 py-3 pl-3 text-sm text-gray-800 shadow-xs focus:border-indigo-700 focus:outline-hidden disabled:bg-gray-100'
        disabled={disabled}
        readOnly={readonly}
      />
      {error && <div className='error-text'>{error}</div>}
    </>
  )
}
