# Thiệp mời sinh nhật 23 🎂

Thiệp mời dạng lật trang 3D (React + GSAP). Khách xác nhận tham gia, kết quả ghi vào Google Sheets.

👉 **Hướng dẫn đưa lên mạng (tiếng Việt):** [docs/HUONG-DAN.md](docs/HUONG-DAN.md)

## Lệnh

| Lệnh | Việc |
|---|---|
| `npm run dev` | Chạy thử trên máy |
| `npm test` | Test logic (Vitest) |
| `npm run e2e` | Test giao diện trên điện thoại giả lập (Playwright) |
| `npm run build` | Build ra `dist/` |
| `npm run og` | Tạo lại ảnh xem trước `public/og.png` |

## Cấu trúc

- `src/content.js`: toàn bộ chữ và dữ liệu (tên, ngày giờ, địa điểm).
- `src/components/Book.jsx`: cuốn sách và cơ chế lật trang.
- `src/components/pages/`: từng trang của thiệp.
- `src/lib/`: logic thuần (đếm ngược, nút troll, gửi xác nhận…).
- `apps-script/Code.gs`: backend Google Apps Script ghi Sheet.

## Biến môi trường

- `VITE_RSVP_URL`: URL Web App Apps Script (bắt buộc).
- `VITE_SITE_URL`: URL trang, dùng cho ảnh xem trước. Không bắt buộc, vì trên Vercel trang tự lấy `VERCEL_PROJECT_PRODUCTION_URL`.
