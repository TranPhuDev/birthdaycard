# Hướng dẫn đưa thiệp mời lên mạng

Làm lần lượt 4 bước dưới đây, tổng cộng khoảng 15–20 phút. Không cần biết code.

---

## Bước 1 — Điền tên của bạn

Mở file `src/content.js`, sửa **2 dòng đầu**:

```js
const hostName = '[Tên]'          // ← thay [Tên] bằng tên/biệt danh, ví dụ 'Phú'
const compliment = 'đẹp trai'     // ← hoặc 'xinh gái'
```

Muốn sửa câu chữ nào khác trên thiệp thì cũng sửa trong file này luôn.
`**chữ**` sẽ được in đậm, `\n` là xuống dòng.

---

## Bước 2 — Tạo Google Sheet nhận danh sách xác nhận

1. Vào <https://sheets.new> để tạo một Google Sheet mới. Đặt tên, ví dụ "Sinh nhật 23 — Xác nhận".
2. Trên thanh menu: **Tiện ích mở rộng → Apps Script**.
3. Xoá hết code có sẵn, dán toàn bộ nội dung file `apps-script/Code.gs` vào. Bấm 💾 **Lưu**.
4. Bấm **Triển khai → Tùy chọn triển khai mới** (Deploy → New deployment).
   - Bấm ⚙️ cạnh "Chọn loại" → chọn **Ứng dụng web** (Web app).
   - **Thực thi với tư cách:** Tôi (email của bạn).
   - **Ai có quyền truy cập:** **Bất kỳ ai** (Anyone).
   - Bấm **Triển khai**.
5. Google sẽ hỏi cấp quyền → **Cho phép**. Nếu hiện "Google chưa xác minh ứng dụng này" thì bấm **Nâng cao → Đi tới … (không an toàn)** → **Cho phép**. Đây là script của chính bạn nên không sao.
6. Copy **URL ứng dụng web**, có dạng `https://script.google.com/macros/s/……/exec`.
7. Dán URL đó vào thanh địa chỉ trình duyệt. Thấy `{"ok":true,"ping":"bday23"}` là đã làm đúng.

> Sau này nếu sửa `Code.gs`, phải vào **Triển khai → Quản lý triển khai → ✏️ → Phiên bản: Phiên bản mới → Triển khai** thì thay đổi mới có tác dụng. URL vẫn giữ nguyên.

---

## Bước 3 — Đưa trang lên Vercel

1. Đẩy thư mục dự án này lên một repo GitHub. Repo để Private cũng được.
2. Vào <https://vercel.com>, đăng nhập bằng GitHub → **Add New… → Project** → chọn repo vừa đẩy → **Import**.
3. Vercel tự nhận ra đây là dự án Vite, không cần chỉnh gì. Mở mục **Environment Variables** và thêm:
   - Name: `VITE_RSVP_URL`
   - Value: URL Apps Script ở Bước 2.6
4. Bấm **Deploy**. Chờ khoảng 1 phút là có link dạng `https://ten-du-an.vercel.app`.

> Nếu đã deploy rồi mới thêm hoặc sửa biến môi trường: vào **Deployments → … → Redeploy** để áp dụng.

---

## Bước 4 — Kiểm tra trước khi gửi link ✅

Làm hết danh sách này **trên điện thoại** trước khi gửi cho mọi người:

- [ ] Mở link: thấy thiệp hồng đào đung đưa. Chạm vào thì thiệp mở ra.
- [ ] Vuốt qua hết 6 trang. Chữ tiếng Việt có dấu hiển thị đẹp, tên của bạn đúng.
- [ ] Trang **Lời mời**: đồng hồ đếm ngược đang chạy.
- [ ] Trang **Địa điểm**: 2 bản đồ hiện đúng Quán Đèn Dầu và Karaoke Sao Mai. Bấm **📍 Chỉ đường** thì mở được Google Maps.
- [ ] Trang **Xác nhận**: nhập tên `Test Có` → bấm **Có** → thấy confetti và lời cảm ơn.
- [ ] Mở link trong **tab ẩn danh**, nhập `Test Troll` → bấm **Không** cho tới khi nó hiện "Không thể không đi 😏" → thấy lời cảm ơn.
- [ ] Mở Google Sheet: có **2 dòng**, `Có` và `Không thể không đi`, kèm giờ.
- [ ] Thử thêm một lần với tên `=1+1` (tab ẩn danh) → trong Sheet hiện đúng chữ `=1+1`, không bị tính thành `2`.
- [ ] Dán link vào Zalo hoặc Messenger (gửi cho chính mình): thấy ảnh bìa thiệp và tiêu đề.
- [ ] **Xoá các dòng thử** trong Sheet (chừa lại dòng tiêu đề).

> Máy nào đã xác nhận rồi thì lần sau mở lại sẽ hiện luôn lời cảm ơn. Vì vậy hãy thử bằng tab ẩn danh.

Xong hết thì gửi link vào nhóm chat. Chúc sinh nhật vui vẻ! 🎂

---

## Gặp sự cố?

| Hiện tượng | Cách xử lý |
|---|---|
| Bấm Có thì báo "Gửi chưa được 😥" | Kiểm tra `VITE_RSVP_URL` trên Vercel đúng URL `/exec` chưa, rồi **Redeploy**. Mở URL đó trên trình duyệt phải thấy `{"ok":true,...}`. Kiểm tra quyền truy cập Apps Script đã chọn **Bất kỳ ai** chưa. |
| Dán link vào Zalo không thấy ảnh | Zalo/Facebook lưu bản xem trước cũ. Thử thêm `?v=2` vào cuối link. Với Facebook, dùng <https://developers.facebook.com/tools/debug/> → "Scrape Again". |
| Muốn đổi ảnh xem trước sau khi sửa tên | Chạy `npm run og` (cần cài Node.js), rồi đẩy lại lên GitHub. |
