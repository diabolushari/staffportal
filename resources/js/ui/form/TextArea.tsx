import { FormFieldProp } from '../ui_interfaces'
import ErrorText from '@/typography/ErrorText'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export default function TextArea({
  label,
  value,
  error,
  rows,
  maxLength,
  setValue,
  placeholder,
  disabled = false,
  className = '',
}: FormFieldProp & { className?: string; rows?: number; maxLength?: number }) {
  // Figma-based styling as default - clean white background with subtle border
  const figmaTextareaClasses = cn(
    'w-full bg-white px-3 py-2 rounded border border-gray-200 text-sm font-normal text-black min-h-[80px]',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0078d4] focus-visible:border-[#0078d4]',
    'disabled:bg-gray-50 disabled:text-black disabled:cursor-not-allowed disabled:opacity-100',
    'placeholder:text-gray-400 resize-y',
    className
  )

  return (
    <div className='space-y-1'>
      {label != null && (
        <label className='text-sm leading-6 font-normal text-[#252c32]'>{label}</label>
      )}

      <Textarea
        value={String(value || '')}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={figmaTextareaClasses}
        rows={rows}
        maxLength={maxLength}
      />

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}
