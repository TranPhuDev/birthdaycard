import gsap from 'gsap'
import { prefersReducedMotion } from './motion.js'

const COLORS = ['#e07d78', '#f3c0ae', '#fbb9b0', '#ffd9c7', '#d9a08c', '#fff', '#b76e5f']

export function burstConfetti(colors = COLORS, count = 90) {
  if (prefersReducedMotion()) return
  for (let i = 0; i < count; i++) {
    const d = document.createElement('div')
    d.className = 'confetti'
    Object.assign(d.style, { background: colors[i % colors.length], left: `${innerWidth / 2}px`, top: `${innerHeight / 2}px` })
    if (i % 3 === 0) Object.assign(d.style, { borderRadius: '50%', height: '8px' })
    document.body.appendChild(d)
    const a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 260
    gsap.timeline({ onComplete: () => d.remove() })
      .to(d, { x: Math.cos(a) * v, y: Math.sin(a) * v - 120, rotation: Math.random() * 720, duration: 0.9, ease: 'power3.out' })
      .to(d, { y: `+=${innerHeight * 0.7}`, rotationX: 900, opacity: 0, duration: 2.4, ease: 'power1.in' })
  }
}
