interface Properties {
  value: string
  onClose?: () => void
  type?: string
}

const pillStyle = (type: string) => {
  switch (type) {
    case 'info': {
      return 'bg-info-500 text-white'
    }
    case 'success': {
      return 'bg-success-500 text-white'
    }
    case 'danger': {
      return 'bg-red-500 text-white'
    }
    case 'warning': {
      return 'bg-yellow-500 text-white'
    }
    default: {
      return 'bg-primary-500'
    }
  }
}

const Pill = ({ value, onClose, type = 'white' }: Properties) => {
  return (
    <div
      className={`flex flex-wrap rounded-2xl border px-4 py-1 text-xs md:text-sm ${pillStyle(
        type
      )}`}
    >
      <span>{value}</span>
      {onClose != null && (
        <>
          <span>&nbsp;&nbsp;&nbsp;</span>
          <span
            className='hover:font-h2-1stop cursor-pointer'
            onClick={onClose}
          >
            x
          </span>
        </>
      )}
    </div>
  )
}

export default Pill
