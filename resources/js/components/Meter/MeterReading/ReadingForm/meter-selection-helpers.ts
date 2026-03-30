export interface MeterSelectionRow {
  meter_id: number
  next_reading_date: string | null
}

export function getSelectedMeterNextReadingDate(
  meterRows: MeterSelectionRow[],
  selectedMeters: number[]
): string | null | undefined {
  if (selectedMeters.length === 0) {
    return undefined
  }

  return meterRows.find((meterRow) => meterRow.meter_id === selectedMeters[0])?.next_reading_date
}

export function canSelectMeterWithNextReadingDate(
  meterRows: MeterSelectionRow[],
  selectedMeters: number[],
  meterId: number
): boolean {
  if (selectedMeters.includes(meterId)) {
    return true
  }

  const selectedMeterNextReadingDate = getSelectedMeterNextReadingDate(meterRows, selectedMeters)

  if (selectedMeters.length === 0 || selectedMeterNextReadingDate === undefined) {
    return true
  }

  const meterRow = meterRows.find((row) => row.meter_id === meterId)

  if (meterRow == null) {
    return false
  }

  return meterRow.next_reading_date === selectedMeterNextReadingDate
}
