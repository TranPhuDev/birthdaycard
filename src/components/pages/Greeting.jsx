import { useRef } from 'react'
import gsap from 'gsap'
import { content } from '../../content.js'
import { Rich } from '../../lib/Rich.jsx'
import { usePageReveal } from './usePageReveal.js'

const t = content.greeting

export function Greeting(props) {
  const ref = useRef(null), bar = useRef(null), level = useRef(null), up = useRef(null)
  usePageReveal(ref, props, () => {
    level.current.textContent = t.levelFrom
    gsap.timeline({ delay: 0.4 })
      .fromTo(bar.current, { width: '0%' }, { width: '100%', duration: 1.4, ease: 'power2.in' })
      .add(() => { level.current.textContent = t.levelTo })
      .fromTo(up.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(3)' })
  })
  return (
    <div data-reveal ref={ref} className="greet">
      <div className="center">
        <p className="a hey">{t.hey}</p>
        <p className="a script big"><Rich text={t.line} /></p>
        <div className="xp a"><i ref={bar} /></div>
        <div className="lv" ref={level}>{t.levelFrom}</div>
        <div className="lvup" ref={up}>{t.levelUp}</div>
      </div>
      <div className="pn">{content.swipeHint}</div>
    </div>
  )
}
