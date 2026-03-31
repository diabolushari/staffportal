interface Properties {
  value: string
  onClose?: () => void
  type?: string
}

const pillStyle = (type: string) => {
  switch (type) {
    case 'info': {
      return 'bg-blue-100 text-blue-800'
    }
    case 'success': {
      return 'bg-green-100 text-green-800'
    }
    case 'danger': {
      return 'bg-red-100 text-red-800'
    }
    case 'warning': {
      return 'bg-yellow-100 text-yellow-800'
    }
    default: {
      return 'bg-white border-black'
    }
  }
}

const BorderedPill = ({ value, onClose, type = 'white' }: Properties) => {
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

export default BorderedPill
