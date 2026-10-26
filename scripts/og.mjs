// Tạo public/og.png (1200×630) — ảnh hiện ra khi dán link vào Zalo/Messenger.
import { execSync, spawn } from 'node:child_process'
import { chromium } from 'playwright'

execSync('npm run build', { stdio: 'inherit' })
const server = spawn('npx', ['vite', 'preview', '--port', '4180', '--strictPort'], { shell: true })
try {
  await new Promise(r => setTimeout(r, 2500))
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: 'reduce' })
  await page.goto('http://localhost:4180/')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1500)
  await page.screenshot({ path: 'public/og.png' })
  await browser.close()
  console.log('Đã tạo public/og.png')
} finally {
  server.kill()
  if (process.platform === 'win32') try { execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: 'ignore' }) } catch { /* đã tắt */ }
}
