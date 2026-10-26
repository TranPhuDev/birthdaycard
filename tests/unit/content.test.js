import { content } from '../../src/content.js'

test('dữ liệu tiệc đúng spec', () => {
  expect(content.partyStartISO).toBe('2026-10-30T18:00:00+07:00')
  expect(content.dateLabel).toBe('Thứ Sáu, 30/10/2026')
  expect(content.schedule.items.map(i => i.time)).toEqual(['18:00', '21:00', '23:00'])
  expect(content.places.items.map(p => p.address)).toEqual([
    '222 Đ. 2 Tháng 9, Hòa Cường, Đà Nẵng 550000', '311 Lê Thanh Nghị, Hòa Cường, Đà Nẵng'])
  expect(content.invite.teams).toEqual(['Team Java ☕', 'Team AI 🤖', 'Team Dệt May 🧵'])
  expect(content.reason.paragraphs.join(' ')).toContain('release phiên bản 23.0')
  expect(JSON.stringify(content)).not.toContain('đẹp trai/xinh gái')
})
