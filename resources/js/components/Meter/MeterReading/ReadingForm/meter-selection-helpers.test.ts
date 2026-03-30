import assert from 'node:assert/strict'
import test from 'node:test'

const { canSelectMeterWithNextReadingDate, getSelectedMeterNextReadingDate } = await import(
  new URL('./meter-selection-helpers.ts', import.meta.url).href
)

const meterRows = [
  {
    meter_id: 1,
    next_reading_date: '2026-03-01',
  },
  {
    meter_id: 2,
    next_reading_date: '2026-03-01',
  },
  {
    meter_id: 3,
    next_reading_date: '2026-03-05',
  },
]

test('returns the next reading date from the first selected meter', () => {
  assert.equal(getSelectedMeterNextReadingDate(meterRows, [2, 1]), '2026-03-01')
})

test('allows selecting any meter when no meter is selected yet', () => {
  assert.equal(canSelectMeterWithNextReadingDate(meterRows, [], 3), true)
})

test('allows selecting meters with the same next reading date', () => {
  assert.equal(canSelectMeterWithNextReadingDate(meterRows, [1], 2), true)
})

test('blocks selecting meters with a different next reading date', () => {
  assert.equal(canSelectMeterWithNextReadingDate(meterRows, [1], 3), false)
})

test('keeps already selected meters selectable', () => {
  assert.equal(canSelectMeterWithNextReadingDate(meterRows, [1, 3], 3), true)
})
