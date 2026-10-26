import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { content } from './src/content.js'

// URL trang để ảnh xem trước (og:image) là đường dẫn tuyệt đối — Zalo/Messenger cần vậy.
const siteUrl = process.env.VITE_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')

const escapeAttr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const htmlMeta = () => ({
  name: 'html-meta',
  transformIndexHtml: html => html
    .replaceAll('__SITE_URL__', siteUrl.replace(/\/$/, ''))
    .replaceAll('__OG_TITLE__', escapeAttr(content.og.title))
    .replaceAll('__OG_DESCRIPTION__', escapeAttr(content.og.description)),
})

export default defineConfig({
  plugins: [react(), htmlMeta()],
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.{js,jsx}'],
    setupFiles: ['tests/unit/setup.js'],
    globals: true,
  },
})
