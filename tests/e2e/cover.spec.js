import { test, expect } from '@playwright/test'

test('bìa thiệp hiển thị, nav ẩn khi chưa mở', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Happy Birthday')).toBeVisible()
  await expect(page.getByTestId('cover').getByText('23', { exact: true })).toBeVisible()
  await expect(page.getByText('30 · 10 · 2026')).toBeVisible()
  await expect(page.getByText('Chạm để mở')).toBeVisible()
  await expect(page.getByTestId('cover')).toBeInViewport()
  await expect(page.getByTestId('nav')).toHaveCSS('opacity', '0')
})
