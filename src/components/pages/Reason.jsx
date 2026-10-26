import { useRef } from 'react'
import gsap from 'gsap'
import { content } from '../../content.js'
import { Rich } from '../../lib/Rich.jsx'
import { usePageReveal } from './usePageReveal.js'

const t = content.reason

export function Reason(props) {
  const ref = useRef(null), num = useRef(null)
  usePageReveal(ref, props, () => {
    const o = { v: 0 }
    gsap.to(o, { v: content.age, duration: 1.4, ease: 'power3.out', onUpdate: () => { num.current.textContent = Math.round(o.v) } })
  })
  return (
    <div data-reveal ref={ref} className="reason">
      <h3 className="pt a">{t.title}</h3>
      <div className="center">
        <div className="serif rg n23" data-testid="n23" ref={num}>{content.age}</div>
        {t.paragraphs.map((p, i) => <p key={i} className="a"><Rich text={p} /></p>)}
      </div>
      <div className="pn">2 / 6</div>
    </div>
  )
}
