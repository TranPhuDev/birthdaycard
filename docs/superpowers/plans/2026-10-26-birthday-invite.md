# Thiệp mời sinh nhật 23 — Kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trang web thiệp mời sinh nhật dạng thiệp lật trang 3D (React + GSAP), có nút xác nhận "troll" ghi vào Google Sheets, deploy được lên Vercel.

**Architecture:** SPA Vite + React một trang. Logic thuần (đếm ngược, URL bản đồ, điều hướng lật trang, máy trạng thái nút troll, gửi RSVP) nằm trong `src/lib/` và được test bằng Vitest. Phần hình ảnh/animation (cuốn sách, các trang) là component React dùng GSAP qua `useGSAP`, được kiểm chứng bằng Playwright e2e trên viewport điện thoại. Google Apps Script làm backend duy nhất để ghi Sheet.

**Tech Stack:** Vite 5, React 18, GSAP 3 + `@gsap/react`, Vitest + jsdom, Playwright (`@playwright/test`), Google Apps Script.

**Spec:** `docs/superpowers/specs/2026-10-26-birthday-invite-design.md` (đọc kèm). Bản thử tham chiếu cảm giác/nhịp/bố cục: `.superpowers/brainstorm/160-1793017498/content/flipbook-spike-v4.html` — mở bằng trình duyệt để xem; **không** copy nguyên, nhưng giữ đúng thông số animation trong đó (thời lượng, easing, màu, kích thước).

## Global Constraints

- Ngôn ngữ giao diện: tiếng Việt. Mọi chữ hiển thị lấy từ `src/content.js` (không hard-code chữ trong component, trừ ký hiệu ‹ › •).
- Ngày giờ tiệc: `2026-10-30T18:00:00+07:00`. Nhãn ngày: `Thứ Sáu, 30/10/2026`. Bìa: `30 · 10 · 2026`.
- Địa điểm: Quán Đèn Dầu — `222 Đ. 2 Tháng 9, Hòa Cường, Đà Nẵng 550000` (18:00); Karaoke Sao Mai — `311 Lê Thanh Nghị, Hòa Cường, Đà Nẵng` (21:00); 23:00 bắt Grab về.
- Màu (CSS variables): nền `#fffaf5`/`#ffe6dd`/`#fdd5cb`; bìa `#ffd6cc`→`#fbb9b0`, viền `#c98a74`; rose gold `#b76e5f`,`#fbd3c4`,`#c27e6b`,`#f3c0ae`; chữ `#7a4b42`; nhấn `#e07d78`; giấy `#fffefb`→`#fbf3ec`; cánh hoa `#fbb9b0`,`#ffd9c7`,`#f5c2b5`.
- Font: Dancing Script (600,700) cho chữ viết tay, Playfair Display (500,700), Be Vietnam Pro (400,500,600) — Google Fonts (API css2 tự kèm bảng chữ tiếng Việt), `display=swap`. **Không** dùng Great Vibes.
- Ưu tiên điện thoại 360–430px; kích thước sách `--w: min(340px, 86vw, 58vh)`, `--h: calc(var(--w) * 1.45)`.
- Lật trang: quanh gáy trái, `rotationY` 0 → -180 trong 1.1s `power2.inOut`, trang lật mờ (`autoAlpha` 0) từ 0.7s trong 0.35s; bóng trang dưới 0.35 → 0.
- **Nội dung một trang chỉ hiện khi trang đó đã lật xong và đứng yên** (`active`), hoặc khi nó đang là trang bị lật đi (`leaving`). Trang lộ ra trong lúc lật là giấy trắng.
- Animation vào trang dùng `gsap.fromTo` (không dùng `gsap.from` — bản thử cho thấy `from` chồng với tween opacity khác làm chữ bị kẹt mờ).
- iframe bản đồ **không bao giờ** nằm trong khối 3D; luôn ở lớp phẳng `position: fixed` ngoài sách.
- Nút troll: né tối đa **4** lần; nhãn `Không 😢` → `Không thể không đi 😏`; lựa chọn ghi Sheet chính xác là `Có` hoặc `Không thể không đi`.
- Biến môi trường: `VITE_RSVP_URL` (URL Web App Apps Script), `VITE_SITE_URL` (tuỳ chọn, URL trang; mặc định lấy `https://${VERCEL_PROJECT_PRODUCTION_URL}` khi build trên Vercel).
- `prefers-reduced-motion: reduce`: lật trang thành mờ chéo 0.3s không xoay; tắt cánh hoa, vệt sáng, đung đưa; nội dung vẫn đầy đủ.
- Không thêm nhạc nền, trang quản trị, đăng nhập.

## Review Focus

1. **Gửi RSVP thất bại** (mất mạng, thiếu `VITE_RSVP_URL`, Apps Script trả HTML lỗi thay vì JSON, `ok !== true`) → hiện lỗi "Gửi chưa được 😥 Kiểm tra mạng rồi bấm lại nha!", **không** hiện màn cảm ơn, **không** lưu localStorage, nút bấm lại được và trạng thái troll được giữ. Test: Task 3 (`submitRsvp` từng loại lỗi), Task 6 (e2e route trả 500).
2. **Bấm gửi hai lần** (chạm đúp "Có", hoặc bấm "Không thể không đi" trong 900ms chờ tự gửi) → chỉ **một** request. Test: Task 6 (e2e đếm request).
3. **Tên bất thường**: toàn khoảng trắng → coi như trống; dài > 40 ký tự → cắt 40; bắt đầu bằng `=`,`+`,`-`,`@` → Apps Script ghi nguyên văn (thêm `'` phía trước) để Sheet không chạy công thức. Test: Task 3 (`normalizeName`), checklist thủ công ở Task 7 (`=1+1`).
4. **Múi giờ / sau giờ tiệc**: máy khách ở múi giờ khác vẫn đếm đúng tới 18:00 giờ VN; từ 18:00 30/10 trở đi hiện "Tiệc đang diễn ra! 🎉" thay vì số âm. Test: Task 2 (`getCountdown`).
5. **Lật dồn dập và đổi kích thước**: vuốt/nhấn phím liên tục khi đang lật → bỏ qua; xoay điện thoại trên trang Địa điểm → bản đồ canh lại đúng ô; rời trang Địa điểm trong <1s → bản đồ không hiện ra ở trang khác. Test: Task 2 (`canFlip`), Task 5 (e2e resize + rời trang nhanh).

---

## File Structure

```
package.json, vite.config.js, playwright.config.js, index.html, .gitignore
public/og.png                      # ảnh xem trước link (Task 7)
src/main.jsx                       # mount <App/>
src/App.jsx                        # ghép Petals + Book + danh sách trang
src/content.js                     # TOÀN BỘ chữ/dữ liệu (chủ nhân sửa file này)
src/styles.css                     # biến màu, font, giấy, sách, trang
src/lib/countdown.js               # getCountdown
src/lib/maps.js                    # mapEmbedUrl, directionsUrl
src/lib/flip.js                    # canFlip, swipeDirection
src/lib/troll.js                   # máy trạng thái nút Không + randomDodgePosition
src/lib/rsvp.js                    # normalizeName, submitRsvp, saveRsvp, loadRsvp
src/lib/motion.js                  # prefersReducedMotion
src/lib/confetti.js                # burstConfetti
src/lib/Rich.jsx                   # hiển thị **đậm** trong chuỗi content
src/components/Book.jsx            # cuốn sách, lật trang, vuốt/phím/nút, nav
src/components/Petals.jsx          # cánh hoa nền
src/components/MapOverlay.jsx      # iframe bản đồ lớp phẳng
src/components/pages/Cover.jsx, Greeting.jsx, Reason.jsx, Invite.jsx,
                     Schedule.jsx, Places.jsx, Rsvp.jsx
src/components/pages/usePageReveal.js  # hook chung: ẩn/hiện nội dung theo active/leaving
tests/unit/*.test.js(x)            # Vitest
tests/e2e/*.spec.js                # Playwright, viewport 390x844
apps-script/Code.gs                # backend ghi Sheet
docs/HUONG-DAN.md                  # hướng dẫn tiếng Việt: Sheet, Vercel, checklist
```

---

### Task 1: Khung dự án, nội dung, giao diện bìa

**Files:**
- Create: `package.json`, `vite.config.js`, `playwright.config.js`, `index.html`, `.gitignore`, `src/main.jsx`, `src/App.jsx`, `src/content.js`, `src/styles.css`, `src/lib/Rich.jsx`, `src/lib/motion.js`, `src/components/Petals.jsx`, `src/components/pages/Cover.jsx`
- Test: `tests/unit/content.test.js`, `tests/unit/Rich.test.jsx`, `tests/e2e/cover.spec.js`

**Interfaces:**
- Produces:
  - `content` (named export, `src/content.js`). Hai dòng đầu file là chỗ chủ nhân sửa: `const hostName = '[Tên]'` và `const compliment = 'đẹp trai' // hoặc 'xinh gái'`; các chuỗi khác dùng template literal với hai hằng này. Hình dạng:
    ```js
    {
      hostName, age: 23, coverTitle: 'Happy Birthday', coverDate: '30 · 10 · 2026',
      dateLabel: 'Thứ Sáu, 30/10/2026', partyStartISO: '2026-10-30T18:00:00+07:00',
      openHint: 'Chạm để mở', swipeHint: 'VUỐT ĐỂ LẬT TRANG ›',
      greeting: { hey: string, line: string /* "{hostName} sắp lên\nlevel 23 rồi nè!" */, levelFrom: 'LEVEL 22', levelTo: 'LEVEL 23', levelUp: '✨ LEVEL UP! ✨' },
      reason: { title: 'Lý do', paragraphs: string[] /* có **đậm** */ },
      invite: { title: 'Lời mời', lead: 'Trân trọng kính mời toàn thể', teams: ['Team Java ☕','Team AI 🤖','Team Dệt May 🧵'], body: string, countdownUnits: ['NGÀY','GIỜ','PHÚT','GIÂY'], started: 'Tiệc đang diễn ra! 🎉' },
      schedule: { title: 'Lịch trình', items: [{ time, icon, title, note }] /* 3 mục */ },
      places: { title: 'Địa điểm', directions: '📍 Chỉ đường', loading: '📍 Đang mở bản đồ…', items: [{ name, time, icon, address, mapQuery }] /* 2 mục */ },
      rsvp: { title: 'Bạn có đến không?', namePlaceholder: 'Tên của bạn là…', yes: 'Có 🥳', no: 'Không 😢', noTrolled: 'Không thể không đi 😏', needName: 'Nhập tên trước đã nha 😉', sendError: 'Gửi chưa được 😥 Kiểm tra mạng rồi bấm lại nha!', thanksTitle: 'Tuyệt!', thanksLine: 'Hẹn gặp {name}\ntối thứ Sáu nha!', recorded: 'Đã ghi nhận: {choice}' },
      og: { title: string, description: string },
    }
    ```
    Chữ lấy đúng từ spec mục 4 (Văn bản) và bản thử; lịch trình: `18:00 🍽️ Tập trung tại Quán Đèn Dầu / Đến trễ phạt 1 ly!`, `21:00 🎤 Qua Karaoke Sao Mai / Ai hát dở cũng phải hát.`, `23:00 🚕 Bắt Grab về nhà / Mai còn đi làm (hoặc không 😌)`. `mapQuery`: `'Quán Đèn Dầu, 222 Đ. 2 Tháng 9, Hòa Cường, Đà Nẵng'` và `'Karaoke Sao Mai, 311 Lê Thanh Nghị, Hòa Cường, Đà Nẵng'`.
  - `<Rich text={string} />` → hiển thị chuỗi, đoạn `**x**` thành `<b>x</b>`, `\n` thành `<br/>`.
  - `prefersReducedMotion(): boolean`.
  - `<Cover />` — mặt trước bìa (không có logic lật); có `data-testid="cover"`.
  - `<Petals />` — 22 phần tử `.petal` rơi (không render khi reduced motion).
  - CSS class dùng chung cho các task sau: `.paper`, `.script`, `.serif`, `.rg` (chữ rose gold), `.book`, `.page`, `.face.front`, `.face.back`, `.shade`, `.pt` (tiêu đề trang), `.center`, `.pn` (số trang).

- [ ] **Step 1: Khởi tạo**
  `git init`; `npm create vite@latest . -- --template react` (giữ file hiện có); cài `gsap @gsap/react`, dev: `vitest jsdom @testing-library/react @testing-library/jest-dom @playwright/test`; `npx playwright install chromium`. Scripts: `dev`, `build`, `preview`, `test` (`vitest run`), `e2e` (`playwright test`). `vite.config.js` có `test: { environment: 'jsdom', include: ['tests/unit/**/*.test.{js,jsx}'] }`. `playwright.config.js`: `testDir: 'tests/e2e'`, `use: { baseURL: 'http://localhost:4173', viewport: { width: 390, height: 844 }, hasTouch: true }`, `webServer: { command: 'npm run build && npm run preview -- --port 4173', port: 4173, env: { VITE_RSVP_URL: 'https://rsvp.test/exec' } }`. `.gitignore`: `node_modules`, `dist`, `.superpowers/`, `test-results`, `playwright-report`, `.env*`.

- [ ] **Step 2: Viết test thất bại**
  `tests/unit/content.test.js`:
  ```js
  test('dữ liệu tiệc đúng spec', () => {
    expect(content.partyStartISO).toBe('2026-10-30T18:00:00+07:00')
    expect(content.dateLabel).toBe('Thứ Sáu, 30/10/2026')
    expect(content.schedule.items.map(i => i.time)).toEqual(['18:00', '21:00', '23:00'])
    expect(content.places.items.map(p => p.address)).toEqual([
      '222 Đ. 2 Tháng 9, Hòa Cường, Đà Nẵng 550000', '311 Lê Thanh Nghị, Hòa Cường, Đà Nẵng'])
    expect(content.invite.teams).toEqual(['Team Java ☕', 'Team AI 🤖', 'Team Dệt May 🧵'])
    expect(content.reason.paragraphs.join(' ')).toContain('release phiên bản 23.0')
    expect(JSON.stringify(content)).not.toContain('đẹp trai/xinh gái')
  })
  ```
  `tests/unit/Rich.test.jsx`: `render(<Rich text={'a **b** c\nd'} />)` → có `<b>b</b>`, có một `<br>`, textContent `'a b cd'`.
  `tests/e2e/cover.spec.js`: mở `/` → thấy `Happy Birthday`, `23`, `30 · 10 · 2026`, `Chạm để mở`; `getByTestId('cover')` hiển thị trong viewport; phần tử điều hướng `[data-testid="nav"]` có opacity 0 (chưa mở).

- [ ] **Step 3: Chạy test, xác nhận thất bại** — `npm test` và `npm run e2e` → FAIL (module/không thấy chữ).

- [ ] **Step 4: Cài đặt** `content.js`, `Rich.jsx`, `motion.js`, `styles.css` (biến màu + font + `.paper` + `.rg` + `.book::before` mép giấy xếp chồng như bản thử), `index.html` (link Google Fonts, `<html lang="vi">`, viewport meta), `Cover.jsx` (vệt sáng lặp 2.4s, repeatDelay 1.2s), `Petals.jsx`, `App.jsx` tạm render `<Petals/>` + sách chỉ có bìa + nav ẩn (`data-testid="nav"`, opacity 0) + gợi ý "Chạm để mở" nhấp nháy.

- [ ] **Step 5: Chạy test, xác nhận đạt** — `npm test && npm run e2e` → PASS.

- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: scaffold, nội dung, bìa thiệp"`

---

### Task 2: Logic thuần — đếm ngược, bản đồ, lật trang, nút troll

**Files:**
- Create: `src/lib/countdown.js`, `src/lib/maps.js`, `src/lib/flip.js`, `src/lib/troll.js`
- Test: `tests/unit/countdown.test.js`, `tests/unit/maps.test.js`, `tests/unit/flip.test.js`, `tests/unit/troll.test.js`

**Interfaces:**
- Produces:
  - `getCountdown(nowMs: number, targetMs: number) → { days, hours, minutes, seconds: number, started: boolean }` — `started` khi `nowMs >= targetMs`, khi đó các số = 0.
  - `mapEmbedUrl(query: string) → string` = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`
  - `directionsUrl(query: string) → string` = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`
  - `canFlip(index: number, dir: 1 | -1, total: number) → boolean` — tiến khi `index < total - 1`; lùi khi `index > 1` (không quay về bìa).
  - `swipeDirection(dx: number, threshold = 40) → 1 | -1 | 0` — `dx < -threshold` → 1 (trang sau), `dx > threshold` → -1.
  - `MAX_DODGES = 4`; `initialTroll() → { dodges: 0, trolled: false }`
  - `trollOnHover(state) → { state, action: 'dodge' | 'none' }` — 'dodge' (và `dodges+1`) khi `dodges < 4`.
  - `trollOnClick(state, hasName: boolean) → { state, action: 'dodge' | 'askName' | 'reveal' | 'submit' }` — `dodges < 4` → 'dodge'; rồi `!hasName` → 'askName' (state giữ nguyên, `trolled` vẫn false); `!trolled` → 'reveal' (`trolled: true`); đã trolled → 'submit'.
  - `trollLabel(state, text) → text.noTrolled | text.no` (truyền `content.rsvp`).
  - `randomDodgePosition(area: {width,height}, btn: {width,height}, avoid: {x,y,width,height}, current: {x,y}, rand = Math.random) → {x, y}` — toạ độ góc trên-trái trong `area` (0 ≤ x ≤ area.width-btn.width, tương tự y), không chồng `avoid` (lề 8px), cách `current` ≥ 60px; thử tối đa 40 lần rồi trả lần thử cuối (vẫn trong area).

- [ ] **Step 1: Viết test thất bại**
  ```js
  const T = Date.parse('2026-10-30T18:00:00+07:00')
  test('đếm ngược đúng giờ VN', () => {
    expect(getCountdown(Date.parse('2026-10-29T17:00:00+07:00'), T)).toEqual({ days: 1, hours: 1, minutes: 0, seconds: 0, started: false })
    expect(getCountdown(Date.parse('2026-10-30T10:59:59Z'), T)).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 1, started: false }) // 17:59:59 VN
  })
  test('sau giờ tiệc', () => {
    expect(getCountdown(T, T)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, started: true })
    expect(getCountdown(T + 3600e3, T).started).toBe(true)
  })
  test('url bản đồ', () => {
    expect(mapEmbedUrl('Quán Đèn Dầu, 222')).toBe('https://maps.google.com/maps?q=Qu%C3%A1n%20%C4%90%C3%A8n%20D%E1%BA%A7u%2C%20222&z=16&output=embed')
    expect(directionsUrl('A B')).toBe('https://www.google.com/maps/dir/?api=1&destination=A%20B')
  })
  test('canFlip', () => {
    expect(canFlip(0, 1, 7)).toBe(true); expect(canFlip(6, 1, 7)).toBe(false)
    expect(canFlip(1, -1, 7)).toBe(false); expect(canFlip(2, -1, 7)).toBe(true)
  })
  test('swipeDirection', () => { expect(swipeDirection(-41)).toBe(1); expect(swipeDirection(41)).toBe(-1); expect(swipeDirection(-40)).toBe(0) })
  test('nút Không: né 4 lần rồi đòi tên rồi lộ chữ rồi gửi', () => {
    let s = initialTroll(), r
    for (let i = 0; i < 4; i++) { r = trollOnClick(s, false); expect(r.action).toBe('dodge'); s = r.state }
    expect(trollOnHover(s).action).toBe('none')
    r = trollOnClick(s, false); expect(r.action).toBe('askName'); expect(trollLabel(r.state, content.rsvp)).toBe('Không 😢')
    r = trollOnClick(r.state, true); expect(r.action).toBe('reveal'); expect(trollLabel(r.state, content.rsvp)).toBe('Không thể không đi 😏')
    expect(trollOnClick(r.state, true).action).toBe('submit')
  })
  test('hover và click cùng đếm vào 4 lần né', () => {
    let s = initialTroll()
    s = trollOnHover(s).state; s = trollOnHover(s).state; s = trollOnClick(s, true).state; s = trollOnHover(s).state
    expect(s.dodges).toBe(4); expect(trollOnClick(s, true).action).toBe('reveal')
  })
  test('randomDodgePosition nằm trong vùng, không đè nút Có', () => {
    const area = { width: 290, height: 150 }, btn = { width: 110, height: 42 }, avoid = { x: 20, y: 40, width: 90, height: 42 }
    for (let i = 0; i < 200; i++) {
      const p = randomDodgePosition(area, btn, avoid, { x: 160, y: 40 })
      expect(p.x).toBeGreaterThanOrEqual(0); expect(p.x).toBeLessThanOrEqual(180)
      expect(p.y).toBeGreaterThanOrEqual(0); expect(p.y).toBeLessThanOrEqual(108)
    }
  })
  ```
- [ ] **Step 2: Chạy** `npm test` → FAIL (chưa có module).
- [ ] **Step 3: Cài đặt** 4 file theo Interfaces.
- [ ] **Step 4: Chạy** `npm test` → PASS.
- [ ] **Step 5: Commit** — `git commit -am "feat: logic đếm ngược, bản đồ, lật trang, nút troll"` (nhớ `git add` file mới).

---

### Task 3: Gửi RSVP + Apps Script

**Files:**
- Create: `src/lib/rsvp.js`, `apps-script/Code.gs`
- Test: `tests/unit/rsvp.test.js`

**Interfaces:**
- Produces:
  - `normalizeName(raw: string) → string` — trim, gộp khoảng trắng liên tiếp, cắt 40 ký tự.
  - `class RsvpError extends Error`
  - `submitRsvp({ name, choice }, { url = import.meta.env.VITE_RSVP_URL, fetchImpl = fetch } = {}) → Promise<void>` — `POST url`, header `Content-Type: text/plain;charset=utf-8` (tránh preflight CORS của Apps Script), body `JSON.stringify({ name, choice })`. Resolve **chỉ khi** `res.ok` và JSON parse được và `json.ok === true`; mọi trường hợp khác (không có url, fetch ném lỗi, HTTP lỗi, không phải JSON, `ok` khác true) → ném `RsvpError`.
  - `RSVP_KEY = 'bday23-rsvp'`; `saveRsvp({ name, choice })`, `loadRsvp() → { name, choice } | null` — bọc try/catch (localStorage có thể bị chặn trong webview).
  - Apps Script `doPost(e)`: parse JSON; `name` = trim, cắt 40, bắt buộc; `choice` ∈ `['Có', 'Không thể không đi']`; nếu `name` bắt đầu bằng `= + - @` thì thêm `'` phía trước; `LockService.getScriptLock()` rồi `appendRow([new Date(), name, choice])` vào sheet đầu tiên (tạo dòng tiêu đề `Thời gian | Tên | Lựa chọn` nếu sheet trống); trả `ContentService` JSON `{ ok: true }`, lỗi trả `{ ok: false, error }`. Thêm `doGet` trả `{ ok: true, ping: 'bday23' }` để kiểm tra deploy.

- [ ] **Step 1: Viết test thất bại**
  ```js
  const okRes = () => Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }))
  test('normalizeName', () => {
    expect(normalizeName('   ')).toBe('')
    expect(normalizeName('  An   Nguyễn ')).toBe('An Nguyễn')
    expect(normalizeName('x'.repeat(50))).toHaveLength(40)
  })
  test('gửi đúng định dạng', async () => {
    const f = vi.fn(okRes)
    await submitRsvp({ name: 'An', choice: 'Không thể không đi' }, { url: 'https://rsvp.test/exec', fetchImpl: f })
    const [url, init] = f.mock.calls[0]
    expect(url).toBe('https://rsvp.test/exec'); expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('text/plain;charset=utf-8')
    expect(JSON.parse(init.body)).toEqual({ name: 'An', choice: 'Không thể không đi' })
  })
  test.each([
    ['không có url', { url: '' , fetchImpl: vi.fn(okRes) }],
    ['mất mạng', { url: 'u', fetchImpl: () => Promise.reject(new TypeError('Failed to fetch')) }],
    ['HTTP 500', { url: 'u', fetchImpl: () => Promise.resolve(new Response('x', { status: 500 })) }],
    ['trả HTML', { url: 'u', fetchImpl: () => Promise.resolve(new Response('<html>', { status: 200 })) }],
    ['ok false', { url: 'u', fetchImpl: () => Promise.resolve(new Response('{"ok":false}', { status: 200 })) }],
  ])('lỗi: %s → RsvpError', async (_, opts) => {
    await expect(submitRsvp({ name: 'An', choice: 'Có' }, opts)).rejects.toBeInstanceOf(RsvpError)
  })
  test('lưu/đọc localStorage, chịu được storage hỏng', () => {
    saveRsvp({ name: 'An', choice: 'Có' }); expect(loadRsvp()).toEqual({ name: 'An', choice: 'Có' })
    localStorage.setItem(RSVP_KEY, '{hỏng'); expect(loadRsvp()).toBeNull()
  })
  ```
- [ ] **Step 2: Chạy** `npm test` → FAIL.
- [ ] **Step 3: Cài đặt** `rsvp.js` và `apps-script/Code.gs` theo Interfaces.
- [ ] **Step 4: Chạy** `npm test` → PASS.
- [ ] **Step 5: Commit** — `git add src/lib/rsvp.js apps-script tests/unit/rsvp.test.js && git commit -m "feat: gửi RSVP và Apps Script ghi Google Sheets"`

---

### Task 4: Cuốn sách lật trang

**Files:**
- Create: `src/components/Book.jsx`, `src/components/pages/usePageReveal.js`
- Modify: `src/App.jsx`, `src/styles.css`
- Test: `tests/e2e/book.spec.js`

**Interfaces:**
- Consumes: `canFlip`, `swipeDirection` (Task 2); `prefersReducedMotion`, `<Cover/>`, `content` (Task 1).
- Produces:
  - `<Book pages={Array<{ key: string, Component: React.ComponentType<PageProps> }>} />` — trang 0 luôn là bìa. Mỗi trang render `<div class="page" data-page={key}>` gồm `.face.front.paper` (chứa `<Component/>` và `.shade`) và `.face.back.paper`.
  - `PageProps = { active: boolean, leaving: boolean }` — `active` = trang này đã lật xong và đứng yên; `leaving` = trang này đang bị lật đi hoặc đang nằm dưới khi lật lùi. Book đặt `settled = null` khi bắt đầu lật, đặt index mới trong `onComplete`.
  - `usePageReveal(ref, { active, leaving }, enter?: (el) => void)` — `ref` trỏ vào phần tử gốc của trang, phần tử này có thuộc tính `data-reveal`. Khi không `active` và không `leaving`: đặt opacity 0 cho mọi con trực tiếp của `ref`; khi `active` chuyển false→true: tween opacity 1 (0.35s, stagger 0.06), `fromTo` các phần tử `.a` `{y:14, opacity:0}` → `{y:0, opacity:1}` (stagger 0.12, 0.6s), rồi gọi `enter(el)`.
  - Sự kiện toàn cục `window.dispatchEvent(new CustomEvent('book:flipstart'))` khi bắt đầu lật (MapOverlay ở Task 5 nghe để ẩn ngay).
  - `data-testid`: `book`, `nav`, `prev`, `next`, `dots`; trang hiện tại gắn `data-active="true"` trên `.page`.
  - Hành vi: chạm/click bìa (pointerup, |dx| ≤ 40) → mở; vuốt/kéo ngang trên sách (bỏ qua nếu bắt đầu trên `input,button,a,iframe`); `ArrowRight`/`ArrowLeft` (bỏ qua khi focus ở input); bỏ qua mọi lệnh khi đang lật. Desktop: sách nghiêng theo chuột trước khi mở (`rotationY ±18`, `rotationX ±13`); thiết bị không hover: đung đưa yoyo 2.6s. Khi mở: thẳng sách, ẩn gợi ý, hiện nav sau 1s. Reduced motion: chuyển trang bằng mờ chéo 0.3s.

- [ ] **Step 1: Viết test e2e thất bại** (`tests/e2e/book.spec.js`; App tạm dùng 6 trang giả `Stub` hiển thị `<p class="a">Trang {key}</p>` qua `usePageReveal`):
  ```js
  test('chạm bìa mở thiệp, nav hiện', async ({ page }) => {
    await page.goto('/'); await page.getByTestId('cover').tap()
    await expect(page.locator('[data-page="greet"][data-active="true"]')).toBeVisible({ timeout: 3000 })
    await expect(page.getByTestId('nav')).toHaveCSS('opacity', '1', { timeout: 3000 })
  })
  test('trang dưới là giấy trắng khi đang lật', async ({ page }) => {
    await page.goto('/'); await page.getByTestId('cover').tap()
    await page.locator('[data-page="greet"][data-active="true"]').waitFor()
    await page.getByTestId('next').click()
    await page.waitForTimeout(400)
    const op = await page.locator('[data-page="reason"] [data-reveal] > *').first().evaluate(e => getComputedStyle(e).opacity)
    expect(op).toBe('0')
    await expect(page.locator('[data-page="reason"][data-active="true"]')).toBeVisible({ timeout: 3000 })
  })
  test('vuốt, phím, và bỏ qua lệnh dồn khi đang lật', async ({ page }) => {
    await page.goto('/'); await page.getByTestId('cover').tap()
    await page.locator('[data-page="greet"][data-active="true"]').waitFor()
    for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight') // dồn trong lúc lật
    await expect(page.locator('[data-page="reason"][data-active="true"]')).toBeVisible({ timeout: 3000 })
    const box = await page.getByTestId('book').boundingBox()
    await page.mouse.move(box.x + box.width * .8, box.y + box.height / 2); await page.mouse.down()
    await page.mouse.move(box.x + box.width * .2, box.y + box.height / 2, { steps: 5 }); await page.mouse.up()
    await expect(page.locator('[data-page="invite"][data-active="true"]')).toBeVisible({ timeout: 3000 })
    await page.keyboard.press('ArrowLeft')
    await expect(page.locator('[data-page="reason"][data-active="true"]')).toBeVisible({ timeout: 3000 })
    await expect(page.getByTestId('prev')).toBeEnabled()
  })
  ```
- [ ] **Step 2: Chạy** `npm run e2e -- book` → FAIL.
- [ ] **Step 3: Cài đặt** `Book.jsx`, `usePageReveal.js`, CSS sách/trang/nav (theo bản thử), App dùng trang giả. Thông số lật theo Global Constraints.
- [ ] **Step 4: Chạy** `npm run e2e` → PASS (cả `cover.spec.js`).
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: cuốn sách lật trang 3D"`

---

### Task 5: Các trang nội dung + bản đồ

**Files:**
- Create: `src/components/pages/Greeting.jsx`, `Reason.jsx`, `Invite.jsx`, `Schedule.jsx`, `Places.jsx`, `src/components/MapOverlay.jsx`
- Modify: `src/App.jsx` (thay trang giả bằng trang thật, thứ tự `greet, reason, invite, schedule, places, rsvp` — `rsvp` tạm là trang giả tới Task 6), `src/styles.css`
- Test: `tests/e2e/pages.spec.js`

**Interfaces:**
- Consumes: `PageProps`, `usePageReveal` (Task 4); `getCountdown`, `mapEmbedUrl`, `directionsUrl` (Task 2); `content`, `<Rich/>` (Task 1); sự kiện `book:flipstart`.
- Produces:
  - Mỗi trang là `(props: PageProps) => JSX`, animation `enter` đúng spec mục 5.4 (thông số như bản thử: XP 1.4s `power2.in` rồi đổi `LEVEL 23` và bật `LEVEL UP` `back.out(3)`; số 23 đếm 0→23 1.4s `power3.out`; chip `back.out(2.5)` stagger 0.12; đường lịch trình `scaleY` 0→1 1.2s, mốc `x:24→0` stagger 0.35). Mỗi trang có `.pn` hiển thị số trang (`2 / 6` … ; trang Lời chào hiển thị `content.swipeHint`).
  - Invite: đồng hồ cập nhật mỗi giây (`setInterval`, dọn khi unmount), `data-testid="countdown"`; khi `started` thay 4 ô bằng `content.invite.started`.
  - `<MapOverlay targets={RefObject<HTMLElement>[]} srcs={string[]} visible={boolean} />` — render qua portal vào `document.body` các `<iframe class="mapframe" title={place.name}>` `position: fixed`, không `loading="lazy"`; khi `visible` true: đợi 1s (huỷ được) rồi canh theo `getBoundingClientRect()` của từng target và fade-in 0.4s, bật pointer-events; khi `visible` false hoặc nhận `book:flipstart`: huỷ hẹn giờ, ẩn ngay (opacity 0, pointer-events none); `resize`/`orientationchange` → canh lại khi đang hiện.
  - Places: ô giữ chỗ `.mapbox` (chữ `content.places.loading`), nút `<a class="go" target="_blank" rel="noopener" href={directionsUrl(mapQuery)}>`; `<MapOverlay visible={active} …/>`.

- [ ] **Step 1: Viết test e2e thất bại** (`tests/e2e/pages.spec.js`, helper `goTo(page, key)` bấm `next` tới khi `[data-page=key][data-active=true]`):
  ```js
  test('nội dung các trang', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-10-29T17:00:00+07:00') })
    await page.goto('/'); await page.getByTestId('cover').tap()
    await expect(page.getByText('LEVEL 23')).toBeVisible({ timeout: 4000 })
    await goTo(page, 'reason'); await expect(page.locator('[data-page="reason"]')).toContainText('23', { timeout: 3000 })
    await goTo(page, 'invite'); await expect(page.getByTestId('countdown')).toContainText('1')  // 1 ngày 1 giờ
    for (const t of ['Team Java ☕', 'Team AI 🤖', 'Team Dệt May 🧵']) await expect(page.getByText(t)).toBeVisible()
    await goTo(page, 'schedule'); for (const t of ['18:00', '21:00', '23:00']) await expect(page.locator('[data-page="schedule"]').getByText(t, { exact: false })).toBeVisible()
  })
  test('sau giờ tiệc hiện "Tiệc đang diễn ra"', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-10-30T19:00:00+07:00') })
    await page.goto('/'); await page.getByTestId('cover').tap(); await goTo(page, 'invite')
    await expect(page.getByText('Tiệc đang diễn ra! 🎉')).toBeVisible()
  })
  test('bản đồ hiện đúng chỗ, ẩn khi rời trang, canh lại khi xoay', async ({ page }) => {
    await page.goto('/'); await page.getByTestId('cover').tap(); await goTo(page, 'places')
    const f = page.locator('iframe.mapframe')
    await expect(f).toHaveCount(2)
    await expect(f.first()).toHaveCSS('opacity', '1', { timeout: 3000 })
    const box = await page.locator('.mapbox').first().boundingBox(), fb = await f.first().boundingBox()
    expect(Math.abs(box.x - fb.x)).toBeLessThan(2); expect(Math.abs(box.y - fb.y)).toBeLessThan(2)
    await expect(page.getByRole('link', { name: '📍 Chỉ đường' }).first()).toHaveAttribute('href', /maps\/dir\/\?api=1&destination=Qu%C3%A1n/)
    await page.setViewportSize({ width: 430, height: 700 }); await page.waitForTimeout(300)
    const box2 = await page.locator('.mapbox').first().boundingBox(), fb2 = await f.first().boundingBox()
    expect(Math.abs(box2.x - fb2.x)).toBeLessThan(2)
    await page.getByTestId('next').click()
    await expect(f.first()).toHaveCSS('opacity', '0')
  })
  test('rời trang Địa điểm trong <1s thì bản đồ không hiện', async ({ page }) => {
    await page.goto('/'); await page.getByTestId('cover').tap(); await goTo(page, 'places')
    await page.getByTestId('prev').click(); await page.waitForTimeout(1500)
    await expect(page.locator('iframe.mapframe').first()).toHaveCSS('opacity', '0')
  })
  ```
- [ ] **Step 2: Chạy** `npm run e2e -- pages` → FAIL.
- [ ] **Step 3: Cài đặt** các trang + `MapOverlay` theo Interfaces.
- [ ] **Step 4: Chạy** `npm test && npm run e2e` → PASS.
- [ ] **Step 5: Kiểm tra bằng mắt** — chụp màn hình từng trang (Playwright `page.screenshot`, viewport 390x844) và so với bản thử; chữ tiếng Việt có dấu hiển thị đúng font Dancing Script.
- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: các trang nội dung và bản đồ"`

---

### Task 6: Trang xác nhận + nút troll + confetti

**Files:**
- Create: `src/components/pages/Rsvp.jsx`, `src/lib/confetti.js`
- Modify: `src/App.jsx` (trang `rsvp` thật), `src/styles.css`
- Test: `tests/e2e/rsvp.spec.js`

**Interfaces:**
- Consumes: `initialTroll`, `trollOnHover`, `trollOnClick`, `trollLabel`, `randomDodgePosition`, `MAX_DODGES` (Task 2); `normalizeName`, `submitRsvp`, `saveRsvp`, `loadRsvp`, `RsvpError` (Task 3); `PageProps`, `usePageReveal` (Task 4).
- Produces:
  - `burstConfetti(colors = ['#e07d78','#f3c0ae','#fbb9b0','#ffd9c7','#d9a08c','#fff','#b76e5f'], count = 90): void` — 90 mảnh fixed từ giữa màn hình, tự xoá khi xong; reduced motion → không làm gì.
  - `Rsvp(props: PageProps)`: ô tên (`maxLength 40`, placeholder từ content), lỗi dưới ô (`role="alert"`), vùng nút cao 150px chứa `<button id="yes">` và `<button id="no">`. Nút Không: `pointerenter` với `pointerType === 'mouse'` → `trollOnHover`; `click` → `trollOnClick(state, normalizeName(value) !== '')`; action `dodge` → tween tới `randomDodgePosition` (0.35s `back.out(2)`, xoay ngẫu nhiên ±8°, lần cuối về 0°); `askName` → hiện `needName` + rung ô tên + focus; `reveal` → đổi nhãn (elastic), mờ nút Có, sau 900ms gửi `'Không thể không đi'`; `submit` → gửi ngay `'Không thể không đi'`. Nút Có → gửi `'Có'` (thiếu tên → `askName`).
  - Gửi: cờ `sending` chặn mọi lần gửi trùng; thành công → `saveRsvp`, ẩn form, hiện cảm ơn (`thanksTitle`, `thanksLine` thay `{name}`, `recorded` thay `{choice}`), `burstConfetti()`; thất bại → hiện `sendError` (`role="alert"`), giữ nguyên tên và trạng thái troll, mở lại nút.
  - Mở trang khi `loadRsvp()` có dữ liệu → hiện thẳng màn cảm ơn.

- [ ] **Step 1: Viết test e2e thất bại** (mỗi test `page.route('https://rsvp.test/exec', …)` ghi lại request; helper `goTo` dùng chung từ Task 5 — tách ra `tests/e2e/helpers.js`, thêm `openRsvp(page)` = `goto('/')` → chạm bìa → `goTo(page, 'rsvp')`):
  ```js
  test('Có → gửi đúng, cảm ơn, nhớ khi mở lại', async ({ page }) => {
    const bodies = []; await page.route('https://rsvp.test/exec', r => { bodies.push(r.request().postData()); r.fulfill({ status: 200, body: '{"ok":true}' }) })
    await openRsvp(page)
    await page.getByRole('button', { name: 'Có 🥳' }).click()
    await expect(page.getByRole('alert')).toHaveText('Nhập tên trước đã nha 😉'); expect(bodies).toHaveLength(0)
    await page.getByPlaceholder('Tên của bạn là…').fill('  An  ')
    await page.getByRole('button', { name: 'Có 🥳' }).dblclick()
    await expect(page.getByText('Hẹn gặp An')).toBeVisible()
    expect(bodies.map(JSON.parse)).toEqual([{ name: 'An', choice: 'Có' }])
    await page.reload(); await openRsvp(page); await expect(page.getByText('Hẹn gặp An')).toBeVisible()
  })
  test('Không: né 4 lần, chưa tên vẫn giữ chữ Không, có tên mới lộ chữ', async ({ page }) => {
    const bodies = []; await page.route('https://rsvp.test/exec', r => { bodies.push(r.request().postData()); r.fulfill({ status: 200, body: '{"ok":true}' }) })
    await openRsvp(page)
    const no = page.locator('#no')
    for (let i = 0; i < 4; i++) { const b = await no.boundingBox(); await no.tap(); await page.waitForTimeout(450); const a = await no.boundingBox(); expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(30) }
    const yes = await page.getByRole('button', { name: 'Có 🥳' }).boundingBox(), nb = await no.boundingBox()
    expect(nb.x + nb.width <= yes.x || nb.x >= yes.x + yes.width || nb.y + nb.height <= yes.y || nb.y >= yes.y + yes.height).toBe(true)
    await no.tap(); await expect(no).toHaveText('Không 😢'); await expect(page.getByRole('alert')).toHaveText('Nhập tên trước đã nha 😉')
    await page.getByPlaceholder('Tên của bạn là…').fill('Bình')
    await no.tap(); await expect(no).toHaveText('Không thể không đi 😏')
    await no.tap() // bấm thêm trong lúc chờ 900ms
    await expect(page.getByText('Hẹn gặp Bình')).toBeVisible()
    expect(bodies.map(JSON.parse)).toEqual([{ name: 'Bình', choice: 'Không thể không đi' }])
  })
  test('gửi lỗi: báo lỗi, không cảm ơn, bấm lại được', async ({ page }) => {
    let fail = true; await page.route('https://rsvp.test/exec', r => fail ? r.fulfill({ status: 500, body: 'x' }) : r.fulfill({ status: 200, body: '{"ok":true}' }))
    await openRsvp(page); await page.getByPlaceholder('Tên của bạn là…').fill('Chi')
    await page.getByRole('button', { name: 'Có 🥳' }).click()
    await expect(page.getByRole('alert')).toHaveText('Gửi chưa được 😥 Kiểm tra mạng rồi bấm lại nha!')
    await expect(page.getByText('Hẹn gặp Chi')).toHaveCount(0)
    expect(await page.evaluate(() => localStorage.getItem('bday23-rsvp'))).toBeNull()
    fail = false; await page.getByRole('button', { name: 'Có 🥳' }).click()
    await expect(page.getByText('Hẹn gặp Chi')).toBeVisible()
  })
  test('desktop: rê chuột làm nút né', async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } }); await openRsvp(page)
    const no = page.locator('#no'); const b = await no.boundingBox()
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(450)
    const a = await no.boundingBox(); expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(30)
  })
  ```
- [ ] **Step 2: Chạy** `npm run e2e -- rsvp` → FAIL.
- [ ] **Step 3: Cài đặt** `Rsvp.jsx`, `confetti.js` theo Interfaces.
- [ ] **Step 4: Chạy** `npm test && npm run e2e` → PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: xác nhận tham gia với nút troll"`

---

### Task 7: Ảnh xem trước link, reduced motion, hướng dẫn bàn giao

**Files:**
- Create: `scripts/og.mjs`, `public/og.png`, `docs/HUONG-DAN.md`, `README.md`
- Modify: `index.html`, `vite.config.js`
- Test: `tests/e2e/meta.spec.js`

**Interfaces:**
- Consumes: `content.og` (Task 1).
- Produces:
  - `index.html`: `<title>`, `meta description`, `og:title`, `og:description`, `og:type=website`, `og:image=__SITE_URL__/og.png` (1200×630), `twitter:card=summary_large_image`, `theme-color #ffe6dd`. Plugin nhỏ trong `vite.config.js` (`transformIndexHtml`) thay `__SITE_URL__` bằng `process.env.VITE_SITE_URL` hoặc `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`, nếu không có thì bỏ tiền tố (đường dẫn tương đối), và thay title/description từ `content.og`.
  - `scripts/og.mjs` (`npm run og`): build + preview, Playwright chụp `/` ở viewport 1200×630 (đợi font và 1.5s) → `public/og.png`.
  - `docs/HUONG-DAN.md` (tiếng Việt, cho chủ nhân, không biết code cũng làm được): (1) sửa `hostName`/`compliment` ở đầu `src/content.js`; (2) tạo Google Sheet → Tiện ích mở rộng → Apps Script → dán `apps-script/Code.gs` → Triển khai → Ứng dụng web (Thực thi với tư cách: Tôi; Ai có quyền truy cập: Bất kỳ ai) → cấp quyền → copy URL; mở URL thấy `{"ok":true,"ping":"bday23"}`; (3) đẩy code lên GitHub → Vercel Import → thêm biến `VITE_RSVP_URL` → Deploy; (4) **checklist trước khi gửi link**: mở link trên điện thoại; lật hết các trang; bản đồ hiện, nút Chỉ đường mở app; gửi thử 1 "Có" và 1 "Không thể không đi" → thấy 2 dòng trong Sheet; thử tên `=1+1` → Sheet ghi nguyên chữ `=1+1`; dán link vào Zalo/Messenger thấy ảnh bìa; xoá các dòng thử trong Sheet và localStorage (hoặc mở tab ẩn danh) trước khi gửi.
  - `README.md`: lệnh `npm run dev|test|e2e|build|og`, trỏ tới `docs/HUONG-DAN.md`.

- [ ] **Step 1: Viết test e2e thất bại** (`tests/e2e/meta.spec.js`):
  ```js
  test('meta xem trước link', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og\.png$/)
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', content.og.title)
    expect((await page.request.get('/og.png')).status()).toBe(200)
  })
  test('reduced motion: vẫn lật và đọc được nội dung', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 }, hasTouch: true })
    const page = await ctx.newPage(); await page.goto('/')
    await expect(page.locator('.petal')).toHaveCount(0)
    await page.getByTestId('cover').tap()
    await expect(page.locator('[data-page="greet"][data-active="true"]')).toBeVisible({ timeout: 1500 })
    await page.getByTestId('next').click()
    await expect(page.locator('[data-page="reason"][data-active="true"]')).toBeVisible({ timeout: 1500 })
  })
  ```
- [ ] **Step 2: Chạy** `npm run e2e -- meta` → FAIL.
- [ ] **Step 3: Cài đặt** meta + plugin + `scripts/og.mjs`; chạy `npm run og` tạo `public/og.png`; viết `docs/HUONG-DAN.md` và `README.md`; bổ sung nhánh reduced motion còn thiếu trong Book/Petals/Cover nếu test chỉ ra.
- [ ] **Step 4: Chạy toàn bộ** `npm test && npm run e2e && npm run build` → tất cả PASS, build không cảnh báo lỗi.
- [ ] **Step 5: Mở `public/og.png` xem bằng mắt** — thấy bìa thiệp trên nền kem đào, không bị cắt.
- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: ảnh xem trước link, reduced motion, hướng dẫn bàn giao"`
