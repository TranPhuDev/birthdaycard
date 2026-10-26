import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

// Nội dung trang chỉ hiện khi trang đã lật xong (active) hoặc đang bị lật đi (leaving).
// ref trỏ vào phần tử gốc có data-reveal; mọi con trực tiếp của nó được ẩn/hiện.
export function usePageReveal(ref, { active, leaving }, enter) {
  const wasActive = useRef(false)
  useGSAP(() => {
    const el = ref.current
    const kids = [...el.children]
    if (active && !wasActive.current) {
      gsap.to(kids, { opacity: 1, duration: 0.35, stagger: 0.06, overwrite: true })
      const a = el.querySelectorAll('.a')
      if (a.length) gsap.fromTo(a, { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'power2.out' })
      enter?.(el)
    } else if (!active && !leaving) {
      gsap.set(kids, { opacity: 0, overwrite: true })
    }
    wasActive.current = active
  }, { dependencies: [active, leaving] })
}
