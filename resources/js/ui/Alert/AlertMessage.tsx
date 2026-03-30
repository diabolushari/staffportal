import StrongText from '@/typography/StrongText'

interface Props {
  message?: string | null
  variant: 'success' | 'error' | 'warning' | 'info'
}

function getTextColor(variant: 'success' | 'error' | 'warning' | 'info') {
  switch (variant) {
    case 'success':
      return 'text-green-500'
    case 'error':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
    case 'info':
      return 'text-blue-500'
  }
}

function getIcon(variant: 'success' | 'error' | 'warning' | 'info') {
  switch (variant) {
    case 'success':
      return 'la-check-circle'
    case 'error':
      return 'la-times-circle'
    case 'warning':
      return 'la-exclamation-circle'
    case 'info':
      return 'la-info-circle'
  }
}

export default function AlertMessage({ message, variant }: Readonly<Props>) {
  const textColor = getTextColor(variant)
  const icon = getIcon(variant)

  return (
    <div className={`flex items-center gap-2 ${textColor}`}>
      <i className={`la ${icon} subheader-sm-1stop text-lg`}></i>
      <StrongText>{message}</StrongText>
    </div>
  )
}
