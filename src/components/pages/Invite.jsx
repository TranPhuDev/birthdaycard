import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { content } from '../../content.js'
import { Rich } from '../../lib/Rich.jsx'
import { getCountdown } from '../../lib/countdown.js'
import { usePageReveal } from './usePageReveal.js'

const t = content.invite
const TARGET = Date.parse(content.partyStartISO)

function Countdown() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const c = getCountdown(now, TARGET)
  if (c.started) return <p className="started" data-testid="countdown">{t.started}</p>
  const values = [c.days, c.hours, c.minutes, c.seconds]
  return (
    <div className="cd" data-testid="countdown">
      {values.map((v, i) => <div key={i}><b>{v}</b><small>{t.countdownUnits[i]}</small></div>)}
    </div>
  )
}

export function Invite(props) {
  const ref = useRef(null)
  usePageReveal(ref, props, el => {
    gsap.fromTo(el.querySelectorAll('.chip'), { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.12, duration: 0.5, ease: 'back.out(2.5)', delay: 0.2 })
  })
  return (
    <div data-reveal ref={ref}>
      <h3 className="pt a">{t.title}</h3>
      <div className="center">
        <p className="a small">{t.lead}</p>
        <div className="chips">{t.teams.map(team => <span key={team} className="chip">{team}</span>)}</div>
        <p className="a small"><Rich text={t.body} /></p>
        <p className="a serif when">{content.dateLabel}</p>
        <div className="a"><Countdown /></div>
      </div>
      <div className="pn">3 / 6</div>
    </div>
  )
}
