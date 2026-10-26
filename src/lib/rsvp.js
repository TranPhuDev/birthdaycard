export class RsvpError extends Error {}

export const RSVP_KEY = 'bday23-rsvp'

export const normalizeName = raw => raw.trim().replace(/\s+/g, ' ').slice(0, 40)

// Content-Type text/plain để Apps Script không bị preflight CORS.
// Chỉ coi là thành công khi Apps Script trả JSON { ok: true }.
export async function submitRsvp({ name, choice }, { url = import.meta.env.VITE_RSVP_URL, fetchImpl = fetch } = {}) {
  if (!url) throw new RsvpError('Thiếu VITE_RSVP_URL')
  let res, json
  try {
    res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ name, choice }),
    })
  } catch (e) {
    throw new RsvpError(`Không kết nối được: ${e.message}`)
  }
  if (!res.ok) throw new RsvpError(`HTTP ${res.status}`)
  try {
    json = await res.json()
  } catch {
    throw new RsvpError('Phản hồi không phải JSON')
  }
  if (json?.ok !== true) throw new RsvpError(json?.error || 'Apps Script báo lỗi')
}

export function saveRsvp({ name, choice }) {
  try { localStorage.setItem(RSVP_KEY, JSON.stringify({ name, choice })) } catch { /* webview chặn storage */ }
}

export function loadRsvp() {
  try {
    const v = JSON.parse(localStorage.getItem(RSVP_KEY))
    return v && typeof v.name === 'string' && typeof v.choice === 'string' ? { name: v.name, choice: v.choice } : null
  } catch {
    return null
  }
}
