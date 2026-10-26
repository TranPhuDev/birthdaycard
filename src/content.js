// ✏️ Sửa 2 dòng này là đủ: tên trên thiệp và lời tự khen
const hostName = '[Tên]'
const compliment = 'đẹp trai' // hoặc 'xinh gái'

// Toàn bộ chữ và dữ liệu hiển thị trên thiệp nằm ở đây.
// **chữ** = in đậm, \n = xuống dòng.
export const content = {
  hostName,
  age: 23,
  coverTitle: 'Happy Birthday',
  coverDate: '30 · 10 · 2026',
  dateLabel: 'Thứ Sáu, 30/10/2026',
  partyStartISO: '2026-10-30T18:00:00+07:00',
  openHint: 'Chạm để mở',
  swipeHint: 'VUỐT ĐỂ LẬT TRANG ›',

  greeting: {
    hey: 'Ê! Đúng rồi, là bạn đó 👀',
    line: `${hostName} sắp lên\nlevel 23 rồi nè!`,
    levelFrom: 'LEVEL 22',
    levelTo: 'LEVEL 23',
    levelUp: '✨ LEVEL UP! ✨',
  },

  reason: {
    title: 'Lý do',
    paragraphs: [
      'Một năm qua code cũng nhiều, bug cũng lắm, deadline thì không đếm xuể…',
      `Nên 30/10 này ${hostName} chính thức **release phiên bản 23.0** — ổn định hơn, ${compliment} hơn, và đặc biệt là **không có bug** (chắc vậy 😅).`,
      'Một sự kiện trọng đại như vậy thì không thể thiếu bạn được!',
    ],
  },

  invite: {
    title: 'Lời mời',
    lead: 'Trân trọng kính mời toàn thể',
    teams: ['Team Java ☕', 'Team AI 🤖', 'Team Dệt May 🧵'],
    body: `đến ăn uống, hát hò và cùng ${hostName}\n“merge” thêm một tuổi mới.`,
    countdownUnits: ['NGÀY', 'GIỜ', 'PHÚT', 'GIÂY'],
    started: 'Tiệc đang diễn ra! 🎉',
  },

  schedule: {
    title: 'Lịch trình',
    items: [
      { time: '18:00', icon: '🍽️', title: 'Tập trung tại Quán Đèn Dầu', note: 'Đến trễ phạt 1 ly!' },
      { time: '21:00', icon: '🎤', title: 'Qua Karaoke Sao Mai', note: 'Ai hát dở cũng phải hát.' },
      { time: '23:00', icon: '🚕', title: 'Bắt Grab về nhà', note: 'Mai còn đi làm (hoặc không 😌)' },
    ],
  },

  places: {
    title: 'Địa điểm',
    directions: '📍 Chỉ đường',
    loading: '📍 Đang mở bản đồ…',
    items: [
      {
        name: 'Quán Đèn Dầu', time: '18:00', icon: '🍽️',
        address: '222 Đ. 2 Tháng 9, Hòa Cường, Đà Nẵng 550000',
        mapQuery: 'Quán Đèn Dầu, 222 Đ. 2 Tháng 9, Hòa Cường, Đà Nẵng',
      },
      {
        name: 'Karaoke Sao Mai', time: '21:00', icon: '🎤',
        address: '311 Lê Thanh Nghị, Hòa Cường, Đà Nẵng',
        mapQuery: 'Karaoke Sao Mai, 311 Lê Thanh Nghị, Hòa Cường, Đà Nẵng',
      },
    ],
  },

  rsvp: {
    title: 'Bạn có đến không?',
    namePlaceholder: 'Tên của bạn là…',
    yes: 'Có 🥳',
    no: 'Không 😢',
    noTrolled: 'Không thể không đi 😏',
    needName: 'Nhập tên trước đã nha 😉',
    sendError: 'Gửi chưa được 😥 Kiểm tra mạng rồi bấm lại nha!',
    thanksTitle: 'Tuyệt!',
    thanksLine: 'Hẹn gặp {name}\ntối thứ Sáu nha!',
    recorded: 'Đã ghi nhận: {choice}',
  },

  og: {
    title: `Thiệp mời sinh nhật 23 tuổi của ${hostName} 🎂`,
    description: 'Thứ Sáu 30/10/2026 · 18:00 · Quán Đèn Dầu, Đà Nẵng. Mở thiệp đi nè!',
  },
}
