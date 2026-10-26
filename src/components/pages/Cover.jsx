import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { content } from '../../content.js'
import { prefersReducedMotion } from '../../lib/motion.js'

export function Cover() {
  const shine = useRef(null)
  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo(shine.current, { backgroundPosition: '150% 0' },
      { backgroundPosition: '-50% 0', duration: 2.4, repeat: -1, repeatDelay: 1.2, ease: 'power1.inOut' })
  })
  return (
    <div className="cover-face" data-testid="cover">
      <span className="script rg hb">{content.coverTitle}</span>
      <span className="serif rg num">{content.age}</span>
      <span className="date">{content.coverDate}</span>
      <div className="shine" ref={shine} />
    </div>
  )
}
