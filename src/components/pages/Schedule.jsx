import { useRef } from 'react'
import gsap from 'gsap'
import { content } from '../../content.js'
import { usePageReveal } from './usePageReveal.js'

const t = content.schedule

export function Schedule(props) {
  const ref = useRef(null)
  usePageReveal(ref, props, el => {
    gsap.fromTo(el.querySelector('.line'), { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: 'power2.inOut' })
    gsap.fromTo(el.querySelectorAll('.it'), { x: 24, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.35, duration: 0.6, ease: 'power2.out', delay: 0.2 })
  })
  return (
    <div data-reveal ref={ref}>
      <h3 className="pt">{t.title}</h3>
      <div className="tl">
        <div className="line" />
        {t.items.map(it => (
          <div key={it.time} className="it">
            <div className="time">{it.time} {it.icon}</div>
            <div className="what">{it.title}</div>
            <div className="note">{it.note}</div>
          </div>
        ))}
      </div>
      <div className="pn">4 / 6</div>
    </div>
  )
}
