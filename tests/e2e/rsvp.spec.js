import { test, expect } from '@playwright/test'
import { openRsvp } from './helpers.js'

const URL = 'https://rsvp.test/exec'
const okRoute = bodies => r => { bodies.push(r.request().postData()); r.fulfill({ status: 200, body: '{"ok":true}' }) }

test('Có → gửi đúng, cảm ơn, nhớ khi mở lại', async ({ page }) => {
  const bodies = []; await page.route(URL, okRoute(bodies))
  await openRsvp(page)
  await page.getByRole('button', { name: 'Có 🥳' }).click()
  await expect(page.getByRole('alert')).toHaveText('Nhập tên trước đã nha 😉'); expect(bodies).toHaveLength(0)
  await page.getByPlaceholder('Tên của bạn là…').fill('  An  ')
  await page.getByRole('button', { name: 'Có 🥳' }).dblclick()
  await expect(page.getByText('Hẹn gặp An')).toBeVisible()
  await page.waitForTimeout(500)
  expect(bodies.map(b => JSON.parse(b))).toEqual([{ name: 'An', choice: 'Có' }])
  await page.reload(); await openRsvp(page); await expect(page.getByText('Hẹn gặp An')).toBeVisible()
})

test('Không: né 4 lần, chưa tên vẫn giữ chữ Không, có tên mới lộ chữ', async ({ page }) => {
  const bodies = []; await page.route(URL, okRoute(bodies))
  await openRsvp(page)
  const no = page.locator('#no')
  for (let i = 0; i < 4; i++) {
    const b = await no.boundingBox(); await no.tap(); await page.waitForTimeout(450)
    const a = await no.boundingBox(); expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(30)
  }
  await page.waitForTimeout(400)
  const yes = await page.getByRole('button', { name: 'Có 🥳' }).boundingBox(), nb = await no.boundingBox()
  expect(nb.x + nb.width <= yes.x || nb.x >= yes.x + yes.width || nb.y + nb.height <= yes.y || nb.y >= yes.y + yes.height).toBe(true)
  await no.tap(); await expect(no).toHaveText('Không 😢'); await expect(page.getByRole('alert')).toHaveText('Nhập tên trước đã nha 😉')
  await page.getByPlaceholder('Tên của bạn là…').fill('Bình')
  await no.tap(); await expect(no).toHaveText('Không thể không đi 😏')
  await no.click({ force: true })
  await expect(page.getByText('Hẹn gặp Bình')).toBeVisible()
  await page.waitForTimeout(1200)
  expect(bodies.map(b => JSON.parse(b))).toEqual([{ name: 'Bình', choice: 'Không thể không đi' }])
})

test('gửi lỗi: báo lỗi, không cảm ơn, bấm lại được', async ({ page }) => {
  let fail = true
  await page.route(URL, r => (fail ? r.fulfill({ status: 500, body: 'x' }) : r.fulfill({ status: 200, body: '{"ok":true}' })))
  await openRsvp(page); await page.getByPlaceholder('Tên của bạn là…').fill('Chi')
  await page.getByRole('button', { name: 'Có 🥳' }).click()
  await expect(page.getByRole('alert')).toHaveText('Gửi chưa được 😥 Kiểm tra mạng rồi bấm lại nha!')
  await expect(page.getByText('Hẹn gặp Chi')).toHaveCount(0)
  expect(await page.evaluate(() => localStorage.getItem('bday23-rsvp'))).toBeNull()
  fail = false; await page.getByRole('button', { name: 'Có 🥳' }).click()
  await expect(page.getByText('Hẹn gặp Chi')).toBeVisible()
})

test('desktop: rê chuột làm nút né', async ({ browser }) => {
  const ctx = await browser.newContext({ baseURL: 'http://localhost:4173', viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage(); await openRsvp(page)
  const no = page.locator('#no'); const b = await no.boundingBox()
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(450)
  const a = await no.boundingBox(); expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(30)
  await ctx.close()
})

test('lộ chữ "Không thể không đi" thì nút nằm giữa, không bị cắt', async ({ page }) => {
  await page.route(URL, r => new Promise(() => {})) // treo request để nhìn nút
  await openRsvp(page)
  await page.getByPlaceholder('Tên của bạn là…').fill('Dũng')
  const no = page.locator('#no')
  for (let i = 0; i < 4; i++) { await no.tap(); await page.waitForTimeout(450) }
  await page.waitForTimeout(400)
  await no.tap(); await expect(no).toHaveText('Không thể không đi 😏')
  await page.waitForTimeout(800)
  const area = await page.locator('.area').boundingBox(), b = await no.boundingBox()
  expect(b.x).toBeGreaterThanOrEqual(area.x - 1); expect(b.x + b.width).toBeLessThanOrEqual(area.x + area.width + 1)
  expect(Math.abs((b.x + b.width / 2) - (area.x + area.width / 2))).toBeLessThan(3)
})
