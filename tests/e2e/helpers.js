import { expect } from '@playwright/test'

export const active = (page, key) => page.locator(`[data-page="${key}"][data-active="true"]`)

// Bìa đung đưa liên tục trên thiết bị cảm ứng nên không bao giờ "stable": chạm theo toạ độ.
export async function openCard(page) {
  const b = await page.getByTestId('book').boundingBox()
  await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2)
  await expect(active(page, 'greet')).toBeVisible({ timeout: 4000 })
}
