import dayjs from 'dayjs'

export const getNextDay = (dateStr: string) => {
  if (!dateStr) {
    return ''
  }
  const date = dayjs(dateStr)
  return date.add(1, 'day').format('YYYY-MM-DD')
}

export const getToday = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}
