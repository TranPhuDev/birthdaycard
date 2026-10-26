import { test, expect } from '@playwright/test'
import { openCard, goTo } from './helpers.js'

test('nội dung các trang', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-29T17:00:00+07:00') })
  await page.goto('/'); await openCard(page)
  await expect(page.getByText('LEVEL 23')).toBeVisible({ timeout: 4000 })
  await expect(page.getByText('✨ LEVEL UP! ✨')).toBeVisible({ timeout: 4000 })
  await goTo(page, 'reason')
  await expect(page.getByTestId('n23')).toHaveText('23', { timeout: 3000 })
  await goTo(page, 'invite')
  await expect(page.getByTestId('countdown')).toContainText('1')
  for (const t of ['Team Java ☕', 'Team AI 🤖', 'Team Dệt May 🧵']) await expect(page.getByText(t)).toBeVisible()
  await goTo(page, 'schedule')
  for (const t of ['18:00', '21:00', '23:00']) await expect(page.locator('[data-page="schedule"]').getByText(t, { exact: false })).toBeVisible()
})

test('sau giờ tiệc hiện "Tiệc đang diễn ra"', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-30T19:00:00+07:00') })
  await page.goto('/'); await openCard(page); await goTo(page, 'invite')
  await expect(page.getByText('Tiệc đang diễn ra! 🎉')).toBeVisible()
})

test('bản đồ hiện đúng chỗ, ẩn khi rời trang, canh lại khi xoay', async ({ page }) => {
  await page.goto('/'); await openCard(page); await goTo(page, 'places')
  const f = page.locator('iframe.mapframe')
  await expect(f).toHaveCount(2)
  await expect(f.first()).toHaveCSS('opacity', '1', { timeout: 3000 })
  const box = await page.locator('.mapbox').first().boundingBox(), fb = await f.first().boundingBox()
  expect(Math.abs(box.x - fb.x)).toBeLessThan(2); expect(Math.abs(box.y - fb.y)).toBeLessThan(2)
  await expect(page.getByRole('link', { name: '📍 Chỉ đường' }).first()).toHaveAttribute('href', /maps\/dir\/\?api=1&destination=Qu%C3%A1n/)
  await page.setViewportSize({ width: 430, height: 700 }); await page.waitForTimeout(300)
  const box2 = await page.locator('.mapbox').first().boundingBox(), fb2 = await f.first().boundingBox()
  expect(Math.abs(box2.x - fb2.x)).toBeLessThan(2); expect(Math.abs(box2.y - fb2.y)).toBeLessThan(2)
  await page.getByTestId('next').click()
  await expect(f.first()).toHaveCSS('opacity', '0')
})

test('rời trang Địa điểm trong <1s thì bản đồ không hiện', async ({ page }) => {
  await page.goto('/'); await openCard(page); await goTo(page, 'places')
  await page.getByTestId('prev').click(); await page.waitForTimeout(1500)
  await expect(page.locator('iframe.mapframe').first()).toHaveCSS('opacity', '0')
})
