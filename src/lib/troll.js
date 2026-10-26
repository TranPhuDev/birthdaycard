export const MAX_DODGES = 4

export const initialTroll = () => ({ dodges: 0, trolled: false })

const dodged = state => ({ state: { ...state, dodges: state.dodges + 1 }, action: 'dodge' })

export function trollOnHover(state) {
  return state.dodges < MAX_DODGES ? dodged(state) : { state, action: 'none' }
}

export function trollOnClick(state, hasName) {
  if (state.dodges < MAX_DODGES) return dodged(state)
  if (!hasName) return { state, action: 'askName' }
  if (!state.trolled) return { state: { ...state, trolled: true }, action: 'reveal' }
  return { state, action: 'submit' }
}

export const trollLabel = (state, text) => (state.trolled ? text.noTrolled : text.no)

const MARGIN = 8
const MIN_JUMP = 60
const TRIES = 200

// Toạ độ góc trên-trái mới cho nút Không trong vùng nút: không đè nút Có, cách chỗ cũ đủ xa.
// Không tìm được chỗ thoả hết thì lấy chỗ không đè nút Có mà xa nhất.
export function randomDodgePosition(area, btn, avoid, current, rand = Math.random) {
  let best = null, bestScore = -Infinity
  for (let i = 0; i < TRIES; i++) {
    const p = { x: rand() * Math.max(0, area.width - btn.width), y: rand() * Math.max(0, area.height - btn.height) }
    const overlaps = p.x < avoid.x + avoid.width + MARGIN && p.x + btn.width > avoid.x - MARGIN &&
      p.y < avoid.y + avoid.height + MARGIN && p.y + btn.height > avoid.y - MARGIN
    const dist = Math.hypot(p.x - current.x, p.y - current.y)
    if (!overlaps && dist >= MIN_JUMP) return p
    const score = (overlaps ? -1e6 : 0) + dist
    if (score > bestScore) { best = p; bestScore = score }
  }
  return best
}
