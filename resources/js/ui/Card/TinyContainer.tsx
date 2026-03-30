interface Props {
  children: React.ReactNode
  variant?: string
}
export default function TinyContainer({ children, variant = 'info' }: Props) {
  const variantStyle = (variant: string) => {
    switch (variant) {
      case 'info': {
        return 'rounded-[50px] bg-[#DBEAFE] p-1 px-2 text-col font-inter text-xs text-[#1E40AF] flex justify-center items-center'
      }
      case 'success': {
        return 'rounded-[50px] bg-[#DCFCE7] p-1 px-2 text-col font-inter text-xs text-[#1C6534] flex justify-center items-center'
      }
      case 'danger': {
        return 'rounded-[50px] bg-[#FCE7E7] p-1 px-2 text-col font-inter text-xs text-[#65341C] flex justify-center items-center'
      }
      case 'warning': {
        return 'rounded-[50px] bg-[#FCE7E7] p-1 px-2 text-col font-inter text-xs text-[#65341C] flex justify-center items-center'
      }
      default: {
        return 'rounded-[50px] bg-[#DBEAFE] p-1 px-2 text-col font-inter text-xs text-[#1C6534] flex justify-center items-center'
      }
    }
  }

  return <div className={variantStyle(variant)}>{children}</div>
}
