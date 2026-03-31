import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const splitDateTime = (date: string): string[] => {
  if (date == null) {
    return []
  }

  const splitByT = date.split('T')
  if (splitByT.length === 2) {
    return splitByT
  }

  const splitBySpace = date.split(' ')
  if (splitBySpace.length === 2) {
    return splitBySpace
  }

  return []
}
export const getTime = (date?: string): string => {
  if (!date) return ''

  const dateObj = new Date(date)

  const hours = dateObj.getHours()
  const minutes = dateObj.getMinutes()

  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes.toString().padStart(2, '0')

  return `${formattedHours}:${formattedMinutes} ${ampm}`
}

export const longMonthnames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const shortMonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
]
export const getDisplayDate = (date?: string | null) => {
  if (date == null) {
    return '-'
  }
  const splitTime = splitDateTime(date)
  const datePart = splitTime.length === 2 ? splitTime[0] : date
  const splitUpdDate = datePart.split('-')
  if (splitUpdDate.length !== 3) {
    return ''
  }
  const month = Number(splitUpdDate[1])
  if (isNaN(month) || month < 1 || month > 12) {
    return ''
  }
  return splitUpdDate[2] + ', ' + shortMonthNames[month - 1] + ' ' + splitUpdDate[0]
}

export const formatDate = (date: Date | null) => {
  if (date == null) {
    return ''
  }
  let month
  if (date.getMonth() + 1 < 10) {
    month = '0' + (date.getMonth() + 1)
  } else {
    month = date.getMonth() + 1
  }
  let day
  if (date.getDate() < 10) {
    day = '0' + date.getDate()
  } else {
    day = date.getDate()
  }
  return date.getFullYear() + '-' + month + '-' + day
}

export const getDisplayMonthYear = (
  date?: string | null,
  longMonthNames: boolean = false,
  capitalize: boolean = false
) => {
  if (!date) {
    return ''
  }
  const splitTime = splitDateTime(date)
  const datePart = splitTime.length === 2 ? splitTime[0] : date
  const splitUpdDate = datePart.split('-')
  if (splitUpdDate.length !== 3) {
    return ''
  }
  const month = Number(splitUpdDate[1])
  if (isNaN(month) || month < 1 || month > 12) {
    return ''
  }
  let value = longMonthNames
    ? longMonthnames[month - 1] + ' ' + splitUpdDate[0]
    : shortMonthNames[month - 1] + ' ' + splitUpdDate[0]
  if (capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  return value
}
import dayjs from 'dayjs'

export const formatMeterReadingMonth = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return '-'

  const start = dayjs(startDate)
  const end = dayjs(endDate)

  return start.format('MMMM YYYY')
}
export const numberToWords = (amount: number): string => {
  if (isNaN(amount)) return ''

  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ]

  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ]

  const convertBelowHundred = (num: number): string => {
    if (num < 20) return ones[num]
    return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '')
  }

  const convertNumber = (num: number): string => {
    let result = ''

    if (num >= 10000000) {
      result += convertNumber(Math.floor(num / 10000000)) + ' Crore '
      num %= 10000000
    }
    if (num >= 100000) {
      result += convertNumber(Math.floor(num / 100000)) + ' Lakh '
      num %= 100000
    }
    if (num >= 1000) {
      result += convertNumber(Math.floor(num / 1000)) + ' Thousand '
      num %= 1000
    }
    if (num >= 100) {
      result += ones[Math.floor(num / 100)] + ' Hundred '
      num %= 100
      if (num > 0) result += 'and '
    }
    if (num > 0) {
      result += convertBelowHundred(num) + ' '
    }

    return result.trim()
  }

  const rupees = Math.floor(amount)
  const paise = Math.round((amount - rupees) * 100)

  let words = ''

  if (rupees > 0) {
    words += convertNumber(rupees) + ' Rupees'
  }

  if (paise > 0) {
    words += (words ? ' and ' : '') + convertBelowHundred(paise) + ' Paise'
  }

  return words + ' Only'
}

export const roundedOffAmount = (amount: number): { updatedAmount: string; roundOff: string } => {
  const roundedAmount = Math.round(amount)
  const roundOff = roundedAmount - amount
  return {
    updatedAmount: roundedAmount.toFixed(2),
    roundOff: (roundOff > 0 ? '+' : '') + roundOff.toFixed(2),
  }
}
