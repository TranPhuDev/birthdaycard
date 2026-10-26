export function getCountdown(nowMs, targetMs) {
  const left = Math.floor((targetMs - nowMs) / 1000)
  if (left <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true }
  return {
    days: Math.floor(left / 86400),
    hours: Math.floor((left % 86400) / 3600),
    minutes: Math.floor((left % 3600) / 60),
    seconds: left % 60,
    started: false,
  }
}
