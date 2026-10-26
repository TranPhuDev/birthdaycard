// Trang 0 là bìa: mở rồi thì không quay về bìa nữa.
export function canFlip(index, dir, total) {
  return dir > 0 ? index < total - 1 : index > 1
}

export function swipeDirection(dx, threshold = 40) {
  if (dx < -threshold) return 1
  if (dx > threshold) return -1
  return 0
}
