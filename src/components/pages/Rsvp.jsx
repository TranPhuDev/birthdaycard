import { useRef, useState } from 'react'
import gsap from 'gsap'
import { content } from '../../content.js'
import { Rich } from '../../lib/Rich.jsx'
import { initialTroll, trollOnHover, trollOnClick, trollLabel, randomDodgePosition, MAX_DODGES } from '../../lib/troll.js'
import { normalizeName, submitRsvp, saveRsvp, loadRsvp } from '../../lib/rsvp.js'
import { burstConfetti } from '../../lib/confetti.js'
import { usePageReveal } from './usePageReveal.js'

const t = content.rsvp
const TROLL_CHOICE = 'Không thể không đi'
const REVEAL_SUBMIT_DELAY = 900

export function Rsvp(props) {
  const ref = useRef(null), areaRef = useRef(null), yesRef = useRef(null), noRef = useRef(null), nameRef = useRef(null)
  const trollRef = useRef(initialTroll()), sending = useRef(false), revealTimer = useRef(null)
  const [troll, setTroll] = useState(trollRef.current)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(loadRsvp)
  usePageReveal(ref, props)

  const askName = () => {
    setError(t.needName)
    gsap.fromTo(nameRef.current, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,.3)' })
    nameRef.current.focus()
  }

  const send = async choice => {
    if (sending.current) return
    sending.current = true
    setError('')
    const n = normalizeName(name)
    try {
      await submitRsvp({ name: n, choice })
      saveRsvp({ name: n, choice })
      setDone({ name: n, choice })
      burstConfetti()
    } catch {
      setError(t.sendError)
      gsap.to(yesRef.current, { opacity: 1, scale: 1, duration: 0.3 })
    } finally {
      sending.current = false
    }
  }

  const dodge = last => {
    const A = areaRef.current.getBoundingClientRect(), B = noRef.current.getBoundingClientRect(), Y = yesRef.current.getBoundingClientRect()
    const cur = { x: B.left - A.left, y: B.top - A.top }
    const base = { x: cur.x - gsap.getProperty(noRef.current, 'x'), y: cur.y - gsap.getProperty(noRef.current, 'y') }
    const p = randomDodgePosition({ width: A.width, height: A.height }, { width: B.width, height: B.height },
      { x: Y.left - A.left, y: Y.top - A.top, width: Y.width, height: Y.height }, cur)
    gsap.to(noRef.current, { x: p.x - base.x, y: p.y - base.y, rotation: (Math.random() - 0.5) * 16, duration: 0.35, ease: 'back.out(2)' })
    if (last) gsap.to(noRef.current, { rotation: 0, duration: 0.3, delay: 0.35 })
  }

  const apply = ({ state, action }) => {
    trollRef.current = state
    setTroll(state)
    if (action === 'dodge') dodge(state.dodges === MAX_DODGES)
    else if (action === 'askName') askName()
    else if (action === 'reveal') {
      gsap.fromTo(noRef.current, { scale: 0.7 }, { scale: 1.1, duration: 0.7, ease: 'elastic.out(1,.4)' })
      gsap.to(yesRef.current, { opacity: 0, scale: 0.6, duration: 0.3 })
      revealTimer.current = setTimeout(() => send(TROLL_CHOICE), REVEAL_SUBMIT_DELAY)
    } else if (action === 'submit') {
      clearTimeout(revealTimer.current)
      send(TROLL_CHOICE)
    }
  }

  const hasName = () => normalizeName(name) !== ''
  const onNoEnter = e => { if (e.pointerType === 'mouse') apply(trollOnHover(trollRef.current)) }
  const onNoClick = () => apply(trollOnClick(trollRef.current, hasName()))
  const onYes = () => (hasName() ? send('Có') : askName())

  return (
    <div data-reveal ref={ref} className="rsvp">
      <h3 className="pt a">{t.title}</h3>
      {done ? (
        <div className="center thanks">
          <div className="big">🎉</div>
          <p className="script thanks-title">{t.thanksTitle}</p>
          <p><Rich text={t.thanksLine.replace('{name}', done.name)} /></p>
          <p className="recorded">{t.recorded.replace('{choice}', done.choice)}</p>
        </div>
      ) : (
        <div className="form">
          <input ref={nameRef} className="a" placeholder={t.namePlaceholder} maxLength={40} value={name}
            onChange={e => { setName(e.target.value); setError('') }} />
          <div className="err" role="alert">{error}</div>
          <div className="area" ref={areaRef}>
            <button className="btn" id="yes" ref={yesRef} onClick={onYes}>{t.yes}</button>
            <button className="btn" id="no" ref={noRef} onPointerEnter={onNoEnter} onClick={onNoClick}>{trollLabel(troll, t)}</button>
          </div>
        </div>
      )}
      <div className="pn">6 / 6</div>
    </div>
  )
}
