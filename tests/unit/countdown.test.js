import { getCountdown } from '../../src/lib/countdown.js'

const T = Date.parse('2026-10-30T18:00:00+07:00')

test('đếm ngược đúng giờ VN', () => {
  expect(getCountdown(Date.parse('2026-10-29T17:00:00+07:00'), T)).toEqual({ days: 1, hours: 1, minutes: 0, seconds: 0, started: false })
  expect(getCountdown(Date.parse('2026-10-30T10:59:59Z'), T)).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 1, started: false })
})

test('sau giờ tiệc', () => {
  expect(getCountdown(T, T)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, started: true })
  expect(getCountdown(T + 3600e3, T).started).toBe(true)
})
