interface Props {
  className?: string
  children?: string
}

export default function WarningText({ children, className = '' }: Props) {
  return <div className='text-sm break-all text-yellow-500'>{children}</div>
}
