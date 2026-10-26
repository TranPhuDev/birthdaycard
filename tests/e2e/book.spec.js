import { test, expect } from '@playwright/test'
import { active, openCard } from './helpers.js'

test('chạm bìa mở thiệp, nav hiện', async ({ page }) => {
  await page.goto('/'); await openCard(page)
  await expect(page.getByTestId('nav')).toHaveCSS('opacity', '1', { timeout: 3000 })
})

test('trang dưới là giấy trắng khi đang lật', async ({ page }) => {
  await page.goto('/'); await openCard(page)
  await page.getByTestId('next').click()
  await page.waitForTimeout(400)
  const op = await page.locator('[data-page="reason"] [data-reveal] > *').first().evaluate(e => getComputedStyle(e).opacity)
  expect(op).toBe('0')
  await expect(active(page, 'reason')).toBeVisible({ timeout: 3000 })
})

test('vuốt, phím, và bỏ qua lệnh dồn khi đang lật', async ({ page }) => {
  await page.goto('/'); await openCard(page)
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight')
  await expect(active(page, 'reason')).toBeVisible({ timeout: 3000 })
  await page.waitForTimeout(300)
  await expect(active(page, 'reason')).toBeVisible()
  const box = await page.getByTestId('book').boundingBox()
  await page.mouse.move(box.x + box.width * .8, box.y + box.height / 2); await page.mouse.down()
  await page.mouse.move(box.x + box.width * .2, box.y + box.height / 2, { steps: 5 }); await page.mouse.up()
  await expect(active(page, 'invite')).toBeVisible({ timeout: 3000 })
  await page.keyboard.press('ArrowLeft')
  await expect(active(page, 'reason')).toBeVisible({ timeout: 3000 })
  await expect(page.getByTestId('prev')).toBeEnabled()
})
