# Thiệp mời sinh nhật 23 tuổi — Thiết kế

Ngày viết: 2026-10-26 · Ngày diễn ra tiệc: **Thứ Sáu 30/10/2026** (còn 4 ngày)

## 1. Ý định và lý do

Chủ nhân (người dùng) tổ chức sinh nhật **23 tuổi** và muốn mời đồng nghiệp bằng một trang web thiệp mời thay vì tin nhắn thường. Thước đo thành công duy nhất họ nêu: **người nhận mở link phải "wowww"**. Trang gửi qua nhóm chat công ty; khách là đồng nghiệp của **Team Java, Team AI, Team Dệt May** — giọng văn thân mật, vui, có chút "dev humor".

Trang cũng phải trả lời được câu hỏi thực tế của chủ nhân: **ai sẽ đến** (để đặt bàn).

## 2. Mục tiêu / Không phải mục tiêu / Phản mục tiêu

**Mục tiêu**
- Màn mở đầu gây ấn tượng: thiệp gập 3D mở ra mượt như thật.
- Truyền đủ thông tin: lý do, lời mời, lịch trình, 2 địa điểm có chỉ đường.
- Nút xác nhận "troll" vui, và danh sách xác nhận ghi vào Google Sheets.
- Live trên Vercel **trước 28/10/2026** để còn thời gian gửi link.

**Không phải mục tiêu**
- Trang quản trị, đăng nhập, đa ngôn ngữ, CMS.
- Mỗi khách một link riêng.
- Nhạc nền (chưa được yêu cầu — không làm).

**Phản mục tiêu (làm ra mà dính những cái này là thất bại)**
- Giật/lag trên điện thoại tầm trung — người nhận chủ yếu mở trên điện thoại qua app chat.
- Font chữ bị vỡ dấu tiếng Việt.
- Nút troll khiến khách **không thể** xác nhận được, hoặc xác nhận mà không ghi vào Sheet.
- Thông tin sai (ngày, giờ, địa chỉ).

## 3. Ràng buộc (người dùng đã chọn)

- **React**, deploy **Vercel**, animation bằng **GSAP** (https://gsap.com).
- Kiểu mở thiệp: **B — thiệp gập 3D** (đã duyệt qua bản thử trong `.superpowers/brainstorm/.../opening-style-v2.html`).
- Tông màu: **3 — Hồng đào + kem + vàng hồng (rose gold)** (bản thử `palette-pink.html`). Tham khảo bảng màu từ bản thử:
  - Nền: `#fffaf5` → `#ffe6dd` → `#fdd5cb` (radial)
  - Bìa thiệp: `#ffd6cc` → `#fbb9b0`, viền trong `#c98a74`
  - Chữ rose gold (gradient): `#b76e5f`, `#fbd3c4`, `#c27e6b`, `#f3c0ae`
  - Chữ chính: `#7a4b42`; chữ nhấn: `#e07d78`
  - Giấy bên trong: kem `#fffefb` → `#fbf3ec` với vân giấy mảnh
  - Cánh hoa rơi nhẹ ở nền: `#fbb9b0`, `#ffd9c7`, `#f5c2b5`
- Lưu xác nhận vào **Google Sheets**.

## 4. Nội dung (dữ liệu thật)

| Mục | Giá trị |
|---|---|
| Tuổi | 23 |
| Ngày | Thứ Sáu, 30/10/2026 |
| Khách | Team Java, Team AI, Team Dệt May |
| 18:00 | Có mặt tại **Quán Đèn Dầu** — 222 Đ. 2 Tháng 9, Hòa Cường, Đà Nẵng 550000 |
| 21:00 | Đi hát **Karaoke Sao Mai** — 311 Lê Thanh Nghị, Hòa Cường, Đà Nẵng |
| 23:00 | Bắt Grab về nhà |

**Tên chủ nhân:** chưa cung cấp → để trong file cấu hình dạng `[Tên]`, chủ nhân tự điền. Tương tự cụm "đẹp trai/xinh gái" — để biến cấu hình (chọn một).

Tất cả nội dung chữ và dữ liệu trên đặt trong **một file cấu hình** (vd. `src/content.js`) để chủ nhân sửa không phải đụng code.

### Văn bản (bản nháp đã được chủ nhân "ok", có thể sửa sau)

- **Bìa:** "Happy Birthday" + số **23** chữ rose gold.
- **Bên trong thiệp:** "Ê! Đúng rồi, là bạn đó 👀 / [Tên] sắp lên level 23 rồi nè!"
- **Lý do:** "Một năm qua code cũng nhiều, bug cũng lắm, deadline thì không đếm xuể… Nên 30/10 này [Tên] chính thức **release phiên bản 23.0** — ổn định hơn, đẹp trai/xinh gái hơn, và đặc biệt là **không có bug** (chắc vậy 😅). Một sự kiện trọng đại như vậy thì không thể thiếu bạn được!"
- **Lời mời:** "Trân trọng kính mời toàn thể **Team Java ☕ · Team AI 🤖 · Team Dệt May 🧵** đến ăn uống, hát hò và cùng [Tên] "merge" thêm một tuổi mới." + ngày + đồng hồ đếm ngược.
- **Lịch trình:** 18:00 "Tập trung tại Quán Đèn Dầu — đến trễ phạt 1 ly!" · 21:00 "Di chuyển sang Karaoke Sao Mai — ai hát dở cũng phải hát." · 23:00 "Bắt Grab về nhà an toàn, mai còn đi làm (hoặc không 😌)".
- **Xác nhận:** "Bạn có đến không?" — [Có 🥳] [Không 😢]. Sau khi xác nhận: "Tuyệt! Hẹn gặp bạn tối thứ Sáu nha 🎉".

## 5. Trải nghiệm, theo thứ tự — thiệp lật trang

**Bản thử tham chiếu (người dùng đã duyệt):** `.superpowers/brainstorm/160-1793017498/content/flipbook-spike-v4.html`. Bản thử là code bỏ đi; dùng để tham chiếu cảm giác, nhịp animation và bố cục — không bê nguyên vào sản phẩm.

Người dùng chọn **lật từng trang trong thiệp** (giống cuốn sổ nhỏ), **không** phải trang dài cuộn dọc. Thứ tự: **Bìa → Lời chào → Lý do → Lời mời → Lịch trình → Địa điểm → Xác nhận** (bìa + 6 trang).

1. **Màn thiệp đóng.** Nền kem đào, cánh hoa rơi chậm. Giữa màn hình là thiệp: bìa hồng đào, viền rose gold, "Happy Birthday" + "23" + "30 · 10 · 2026" ánh rose gold, vệt sáng lướt qua định kỳ, mép giấy xếp chồng phía dưới cho cảm giác có độ dày. Desktop: thiệp nghiêng 3D theo chuột. Điện thoại: tự đung đưa nhẹ (lựa chọn của tôi). Chữ "Chạm để mở" nhấp nháy.
2. **Lật trang.** Chạm bìa để mở. Sau đó lật bằng: vuốt/kéo ngang (trái = trang sau, phải = trang trước), nút ‹ ›, phím mũi tên. Trang lật quanh gáy trái bằng 3D (~1.1s), mờ dần ở nửa sau, trang bên dưới có bóng đổ nhạt dần. Dưới thiệp có thanh điều hướng ‹ • • • ›, chỉ hiện sau khi mở bìa. Thao tác trên ô nhập/nút/link/bản đồ không bị tính là vuốt.
3. **Quy tắc người dùng yêu cầu:** trong lúc lật, trang bên dưới **chỉ là giấy trắng** — **nội dung chỉ hiện ra sau khi lật xong** (kèm animation). Lật ngược cũng vậy.
4. **Animation khi vào từng trang** (đã duyệt trong bản thử):
   - Lời chào: thanh XP chạy đầy, "LEVEL 22" → "LEVEL 23", bật "✨ LEVEL UP! ✨".
   - Lý do: số 23 đếm từ 0 lên.
   - Lời mời: 3 nhãn team bật ra lần lượt; đồng hồ đếm ngược ngày/giờ/phút/giây.
   - Lịch trình: đường kẻ dọc vẽ xuống, 3 mốc trượt vào lần lượt.
   - Địa điểm: 2 thẻ trượt lên.
   - Chung: các dòng chữ hiện dần từ dưới lên.
5. **Địa điểm:** 2 thẻ (Quán Đèn Dầu 18:00, Karaoke Sao Mai 21:00), mỗi thẻ có bản đồ Google Maps nhúng (iframe `maps.google.com/maps?q=…&output=embed`, không cần API key) và nút "📍 Chỉ đường" (`google.com/maps/dir/?api=1&destination=…`, trên điện thoại mở app).
   - **Ràng buộc kỹ thuật đã kiểm chứng:** iframe đặt **bên trong** khối 3D (`preserve-3d`/`backface-visibility`) thì trình duyệt **không vẽ**. Cách đã chạy được trong bản thử: trong trang chỉ để ô giữ chỗ; iframe thật nằm ở lớp phẳng bên ngoài cuốn sách, canh đúng toạ độ ô giữ chỗ, **chỉ hiện khi trang Địa điểm đã đứng yên**, ẩn ngay khi bắt đầu lật, canh lại khi đổi kích thước màn hình.
6. **Đồng hồ đếm ngược** tới 18:00 30/10/2026 giờ Việt Nam (UTC+7), đúng bất kể múi giờ máy khách. Sau mốc đó hiện "Tiệc đang diễn ra! 🎉".

## 6. Nút xác nhận troll (người dùng mô tả, chi tiết đã chốt)

- Ô nhập **tên** (bắt buộc) phía trên 2 nút **Có** và **Không**. Thiếu tên → ô tên rung + "Nhập tên trước đã nha 😉".
- **Có:** gửi xác nhận → confetti → thông điệp cảm ơn.
- **Không:** khi chuột rê tới (desktop) hoặc ngón tay chạm vào (điện thoại), nút **nhảy sang chỗ khác** (vị trí ngẫu nhiên trong vùng nút của trang, không đè nút Có). Lặp lại **4 lần** (lựa chọn của tôi; người dùng nói "vài lần"). Sau đó nút **đứng yên** cho bấm.
- Nút "Không" né 4 lần **kể cả khi chưa nhập tên**.
- Bấm được "Không" khi **chưa nhập tên** → nút **vẫn giữ chữ "Không"**, yêu cầu nhập tên (người dùng yêu cầu).
- Bấm được "Không" khi **đã có tên** → nút giãn ra hiện đủ chữ **"Không thể không đi 😏"** (nút Có mờ đi) → coi như **Có**: ghi xác nhận, confetti, cảm ơn.
- Ghi vào Sheet phải phân biệt được 2 trường hợp (cột "Lựa chọn": `Có` / `Không thể không đi`).

## 7. Lưu xác nhận — Google Sheets

- Một Google Sheet của chủ nhân + **Google Apps Script** triển khai dạng Web App (ai cũng gọi được). Trang web `POST` tới URL Web App.
- Mỗi lượt xác nhận ghi 1 dòng: **Thời gian | Tên | Lựa chọn**.
- URL Web App đặt trong biến môi trường Vercel (vd. `VITE_RSVP_URL`).
- Bàn giao kèm: mã Apps Script và **hướng dẫn từng bước bằng tiếng Việt** để chủ nhân tự tạo Sheet + deploy script (~5 phút).
- Khi gửi lỗi (mất mạng): báo lỗi thân thiện và cho bấm gửi lại — không được nuốt lỗi im lặng. (Lưu ý: Apps Script + CORS — builder chọn cách gọi sao cho xác nhận được là đã ghi thành công.)
- Một người xác nhận nhiều lần → cứ ghi nhiều dòng; chủ nhân tự lọc. Có thể nhớ trạng thái "đã xác nhận" trong localStorage để lần sau mở lại hiện luôn lời cảm ơn (lựa chọn của tôi).

## 8. Kỹ thuật (lựa chọn của tôi, trừ những gì ghi ở mục 3)

- **Vite + React**, GSAP, `@gsap/react` (`useGSAP`) để dọn animation đúng cách. Không cần ScrollTrigger (không còn trang cuộn).
- **Font hỗ trợ tiếng Việt** — dùng *Dancing Script* (có dấu tiếng Việt, đã dùng trong bản thử lật trang) cho chữ viết tay; *không* dùng *Great Vibes* (thiếu dấu). *Playfair Display* và *Be Vietnam Pro* giữ nguyên.
- Thiết kế **ưu tiên điện thoại** (360–430px), desktop vẫn đẹp.
- Tôn trọng `prefers-reduced-motion`: giảm animation, nội dung vẫn đọc được.
- **Ảnh xem trước khi gửi link** (Open Graph: tiêu đề, mô tả, ảnh bìa thiệp) để link hiện đẹp trong Zalo/Messenger — quan trọng cho "wow" ngay từ khung chat.
- Confetti: tự làm bằng GSAP (như bản thử hộp quà) hoặc thư viện nhỏ — builder chọn.
- Không backend riêng ngoài Apps Script.

## 9. Để builder tự quyết

- Cấu trúc component, cách tổ chức file.
- Tinh chỉnh hiệu ứng từng trang (giữ tông, độ mượt và nhịp như bản thử).
- Bố cục chi tiết từng phần, icon, khoảng cách.
- Thư viện confetti hay tự viết.
- Cách gọi Apps Script (fetch/form) miễn đảm bảo yêu cầu ở mục 7.

## 10. Bàn giao

- Repo code, deploy được lên Vercel.
- `src/content.js` (hoặc tương đương) chứa toàn bộ chữ/dữ liệu, có chỗ `[Tên]`.
- Mã Apps Script + hướng dẫn tiếng Việt cài Google Sheets và đặt biến môi trường trên Vercel.
- Hướng dẫn ngắn deploy Vercel.
- **Ai deploy (lựa chọn của tôi):** tài khoản Google và Vercel là của chủ nhân, nên chủ nhân tự tạo Sheet, deploy Apps Script và nối Vercel theo hướng dẫn. Vì vậy code phải xong **trước 27/10** và kèm **checklist kiểm tra** (gửi thử 1 xác nhận "Có" + 1 "Không thể không đi", kiểm tra dòng xuất hiện trong Sheet) để chủ nhân xác nhận đường ghi Sheet chạy thật trước khi gửi link.
