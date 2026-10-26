import { canFlip, swipeDirection } from '../../src/lib/flip.js'

test('canFlip', () => {
  expect(canFlip(0, 1, 7)).toBe(true); expect(canFlip(6, 1, 7)).toBe(false)
  expect(canFlip(1, -1, 7)).toBe(false); expect(canFlip(2, -1, 7)).toBe(true)
})

test('swipeDirection', () => {
  expect(swipeDirection(-41)).toBe(1); expect(swipeDirection(41)).toBe(-1); expect(swipeDirection(-40)).toBe(0)
})
