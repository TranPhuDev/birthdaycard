import { test, expect } from '@playwright/test'
import { content } from '../../src/content.js'
import { active } from './helpers.js'

test('meta xem trước link', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og\.png$/)
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', content.og.title)
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', content.og.description)
  await expect(page).toHaveTitle(content.og.title)
  expect((await page.request.get('/og.png')).status()).toBe(200)
})

test('reduced motion: vẫn lật và đọc được nội dung', async ({ browser }) => {
  const ctx = await browser.newContext({ baseURL: 'http://localhost:4173', reducedMotion: 'reduce', viewport: { width: 390, height: 844 }, hasTouch: true })
  const page = await ctx.newPage(); await page.goto('/')
  await expect(page.locator('.petal')).toHaveCount(0)
  await page.getByTestId('cover').tap()
  await expect(active(page, 'greet')).toBeVisible({ timeout: 1500 })
  await expect(page.getByText('Ê! Đúng rồi, là bạn đó 👀')).toBeVisible()
  await page.getByTestId('next').click()
  await expect(active(page, 'reason')).toBeVisible({ timeout: 1500 })
  await ctx.close()
})
