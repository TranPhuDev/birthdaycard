// Dán file này vào Google Sheet → Tiện ích mở rộng → Apps Script.
// Triển khai → Ứng dụng web (Thực thi: Tôi · Quyền truy cập: Bất kỳ ai).

var CHOICES = ['Có', 'Không thể không đi'];
var HEADER = ['Thời gian', 'Tên', 'Lựa chọn'];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var name = String(data.name || '').trim().slice(0, 40);
    var choice = String(data.choice || '');
    if (!name) return reply({ ok: false, error: 'Thiếu tên' });
    if (CHOICES.indexOf(choice) < 0) return reply({ ok: false, error: 'Lựa chọn không hợp lệ' });
    // Chặn Sheet hiểu tên thành công thức (vd. "=1+1")
    if (/^[=+\-@]/.test(name)) name = "'" + name;

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
      if (sheet.getLastRow() === 0) sheet.appendRow(HEADER);
      sheet.appendRow([new Date(), name, choice]);
    } finally {
      lock.releaseLock();
    }
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

// Mở URL Web App trên trình duyệt để kiểm tra đã deploy đúng chưa.
function doGet() {
  return reply({ ok: true, ping: 'bday23' });
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
