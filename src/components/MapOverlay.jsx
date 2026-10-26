import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'

// iframe bản đồ không vẽ được bên trong khối 3D của cuốn sách, nên đặt ở lớp phẳng
// position: fixed, canh đúng ô giữ chỗ, chỉ hiện khi trang đã đứng yên.
const SHOW_DELAY = 1

export function MapOverlay({ targets, srcs, titles, visible }) {
  const frames = useRef([])
  const shown = useRef(false)
  // Chỉ tải bản đồ khi tới trang Địa điểm lần đầu, để không giành mạng/CPU lúc mở thiệp.
  const [loaded, setLoaded] = useState(false)
  if (visible && !loaded) setLoaded(true)

  useEffect(() => {
    const els = frames.current
    let call = null
    // Ô giữ chỗ bị trang cắt mất (vd. màn ngang) thì giấu iframe, không để lơ lửng ngoài thiệp.
    const place = () => targets.forEach((t, i) => {
      const el = t.current
      if (!el) return
      const r = el.getBoundingClientRect(), face = el.closest('.face').getBoundingClientRect()
      const inside = r.top >= face.top - 1 && r.bottom <= face.bottom + 1 && r.left >= face.left - 1 && r.right <= face.right + 1
      Object.assign(els[i].style, {
        left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`,
        visibility: inside ? 'visible' : 'hidden',
      })
    })
    const hide = () => {
      call?.kill()
      shown.current = false
      gsap.killTweensOf(els)
      gsap.set(els, { opacity: 0, pointerEvents: 'none' })
    }
    if (visible) {
      call = gsap.delayedCall(SHOW_DELAY, () => {
        place()
        shown.current = true
        gsap.to(els, { opacity: 1, duration: 0.4, pointerEvents: 'auto' })
      })
    } else hide()
    const onResize = () => shown.current && place()
    addEventListener('book:flipstart', hide)
    addEventListener('resize', onResize)
    addEventListener('orientationchange', onResize)
    return () => {
      call?.kill()
      removeEventListener('book:flipstart', hide)
      removeEventListener('resize', onResize)
      removeEventListener('orientationchange', onResize)
    }
  }, [visible])

  return createPortal(
    srcs.map((src, i) => (
      <iframe key={src} className="mapframe" title={titles[i]} src={loaded ? src : undefined} ref={el => (frames.current[i] = el)} />
    )),
    document.body,
  )
}
