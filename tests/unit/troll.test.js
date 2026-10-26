import { initialTroll, trollOnHover, trollOnClick, trollLabel, randomDodgePosition, MAX_DODGES } from '../../src/lib/troll.js'
import { content } from '../../src/content.js'

test('MAX_DODGES = 4', () => expect(MAX_DODGES).toBe(4))

test('nút Không: né 4 lần rồi đòi tên rồi lộ chữ rồi gửi', () => {
  let s = initialTroll(), r
  for (let i = 0; i < 4; i++) { r = trollOnClick(s, false); expect(r.action).toBe('dodge'); s = r.state }
  expect(trollOnHover(s).action).toBe('none')
  r = trollOnClick(s, false); expect(r.action).toBe('askName'); expect(trollLabel(r.state, content.rsvp)).toBe('Không 😢')
  r = trollOnClick(r.state, true); expect(r.action).toBe('reveal'); expect(trollLabel(r.state, content.rsvp)).toBe('Không thể không đi 😏')
  expect(trollOnClick(r.state, true).action).toBe('submit')
})

test('hover và click cùng đếm vào 4 lần né', () => {
  let s = initialTroll()
  s = trollOnHover(s).state; s = trollOnHover(s).state; s = trollOnClick(s, true).state; s = trollOnHover(s).state
  expect(s.dodges).toBe(4); expect(trollOnClick(s, true).action).toBe('reveal')
})

test('randomDodgePosition nằm trong vùng, không đè nút Có, cách chỗ cũ', () => {
  const area = { width: 290, height: 150 }, btn = { width: 110, height: 42 }, avoid = { x: 20, y: 40, width: 90, height: 42 }
  for (let i = 0; i < 200; i++) {
    const cur = { x: 160, y: 40 }
    const p = randomDodgePosition(area, btn, avoid, cur)
    expect(p.x).toBeGreaterThanOrEqual(0); expect(p.x).toBeLessThanOrEqual(180)
    expect(p.y).toBeGreaterThanOrEqual(0); expect(p.y).toBeLessThanOrEqual(108)
    const overlap = p.x < avoid.x + avoid.width + 8 && p.x + btn.width > avoid.x - 8 && p.y < avoid.y + avoid.height + 8 && p.y + btn.height > avoid.y - 8
    expect(overlap).toBe(false)
    expect(Math.hypot(p.x - cur.x, p.y - cur.y)).toBeGreaterThanOrEqual(60)
  }
})
