import { mapEmbedUrl, directionsUrl } from '../../src/lib/maps.js'

test('url bản đồ', () => {
  expect(mapEmbedUrl('Quán Đèn Dầu, 222')).toBe('https://maps.google.com/maps?q=Qu%C3%A1n%20%C4%90%C3%A8n%20D%E1%BA%A7u%2C%20222&z=16&output=embed')
  expect(directionsUrl('A B')).toBe('https://www.google.com/maps/dir/?api=1&destination=A%20B')
})
