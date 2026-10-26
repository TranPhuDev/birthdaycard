import { normalizeName, submitRsvp, RsvpError, saveRsvp, loadRsvp, RSVP_KEY } from '../../src/lib/rsvp.js'

const okRes = () => Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }))

test('normalizeName', () => {
  expect(normalizeName('   ')).toBe('')
  expect(normalizeName('  An   Nguyễn ')).toBe('An Nguyễn')
  expect(normalizeName('x'.repeat(50))).toHaveLength(40)
})

test('gửi đúng định dạng', async () => {
  const f = vi.fn(okRes)
  await submitRsvp({ name: 'An', choice: 'Không thể không đi' }, { url: 'https://rsvp.test/exec', fetchImpl: f })
  const [url, init] = f.mock.calls[0]
  expect(url).toBe('https://rsvp.test/exec'); expect(init.method).toBe('POST')
  expect(init.headers['Content-Type']).toBe('text/plain;charset=utf-8')
  expect(JSON.parse(init.body)).toEqual({ name: 'An', choice: 'Không thể không đi' })
})

test.each([
  ['không có url', { url: '', fetchImpl: vi.fn(okRes) }],
  ['mất mạng', { url: 'u', fetchImpl: () => Promise.reject(new TypeError('Failed to fetch')) }],
  ['HTTP 500', { url: 'u', fetchImpl: () => Promise.resolve(new Response('x', { status: 500 })) }],
  ['trả HTML', { url: 'u', fetchImpl: () => Promise.resolve(new Response('<html>', { status: 200 })) }],
  ['ok false', { url: 'u', fetchImpl: () => Promise.resolve(new Response('{"ok":false}', { status: 200 })) }],
])('lỗi: %s → RsvpError', async (_, opts) => {
  await expect(submitRsvp({ name: 'An', choice: 'Có' }, opts)).rejects.toBeInstanceOf(RsvpError)
})

test('lưu/đọc localStorage, chịu được storage hỏng', () => {
  saveRsvp({ name: 'An', choice: 'Có' }); expect(loadRsvp()).toEqual({ name: 'An', choice: 'Có' })
  localStorage.setItem(RSVP_KEY, '{hỏng'); expect(loadRsvp()).toBeNull()
})
