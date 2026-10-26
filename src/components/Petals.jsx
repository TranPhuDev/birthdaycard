import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { prefersReducedMotion } from '../lib/motion.js'

const COLORS = ['#fbb9b0', '#ffd9c7', '#f5c2b5']
const COUNT = 22

export function Petals() {
  const root = useRef(null)
  const reduced = prefersReducedMotion()
  useGSAP(() => {
    gsap.utils.toArray('.petal', root.current).forEach(p => {
      gsap.set(p, { x: Math.random() * innerWidth, rotation: Math.random() * 360, scale: 0.6 + Math.random() * 0.8 })
      gsap.to(p, { y: innerHeight + 40, x: '+=80', rotation: '+=420', duration: 8 + Math.random() * 7,
        delay: -Math.random() * 15, repeat: -1, ease: 'none' })
    })
  }, { scope: root })
  if (reduced) return null
  return (
    <div ref={root} aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => <div key={i} className="petal" style={{ background: COLORS[i % 3] }} />)}
    </div>
  )
}
