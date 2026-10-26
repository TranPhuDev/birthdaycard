import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Cover } from './pages/Cover.jsx'
import { canFlip, swipeDirection } from '../lib/flip.js'
import { prefersReducedMotion } from '../lib/motion.js'
import { content } from '../content.js'

const FLIP = { duration: 1.1, ease: 'power2.inOut', fadeAt: 0.7, fade: 0.35, shade: 0.35 }

export function Book({ pages }) {
  const total = pages.length + 1 // + bìa
  const wrapRef = useRef(null), bookRef = useRef(null), hintRef = useRef(null), navRef = useRef(null)
  const pageEls = useRef([])
  const cur = useRef(0), busy = useRef(false), opened = useRef(false), sway = useRef(null), startX = useRef(null)
  const [index, setIndex] = useState(0)
  const [settled, setSettled] = useState(0)
  const [leaving, setLeaving] = useState(null)
  const reduced = prefersReducedMotion()

  const { contextSafe } = useGSAP(() => {
    pageEls.current.forEach((p, i) => gsap.set(p, { zIndex: total - i }))
    if (reduced) return
    gsap.set(bookRef.current, { rotationX: 8, rotationY: -12 })
    gsap.to(hintRef.current, { opacity: 0.35, duration: 0.9, yoyo: true, repeat: -1 })
    if (!matchMedia('(hover: hover)').matches) {
      sway.current = gsap.to(bookRef.current, { rotationY: 12, rotationX: 4, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    }
  }, { scope: wrapRef })

  const open = contextSafe(() => {
    opened.current = true
    sway.current?.kill()
    gsap.killTweensOf(hintRef.current)
    gsap.to(hintRef.current, { opacity: 0, duration: 0.3 })
    gsap.to(bookRef.current, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power2.out' })
    gsap.to(navRef.current, { opacity: 1, duration: 0.6, delay: reduced ? 0 : 1 })
  })

  const flip = contextSafe(dir => {
    const from = cur.current
    if (busy.current || !canFlip(from, dir, total)) return
    busy.current = true
    window.dispatchEvent(new CustomEvent('book:flipstart'))
    if (!opened.current) open()
    setSettled(null)
    setLeaving(from)
    const done = () => {
      cur.current = from + dir
      busy.current = false
      setIndex(cur.current); setLeaving(null); setSettled(cur.current)
    }
    const tl = gsap.timeline({ onComplete: done })
    if (dir > 0) {
      const p = pageEls.current[from]
      const under = pageEls.current[from + 1].querySelector('.shade')
      if (reduced) tl.to(p, { autoAlpha: 0, duration: 0.3 })
      else tl.to(p, { rotationY: -180, duration: FLIP.duration, ease: FLIP.ease })
        .to(p, { autoAlpha: 0, duration: FLIP.fade, ease: 'power1.in' }, FLIP.fadeAt)
        .fromTo(under, { opacity: FLIP.shade }, { opacity: 0, duration: 0.9 }, 0)
    } else {
      const p = pageEls.current[from - 1]
      if (reduced) {
        gsap.set(p, { rotationY: 0 })
        tl.fromTo(p, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
      } else tl.fromTo(p, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0)
        .to(p, { rotationY: 0, duration: FLIP.duration, ease: FLIP.ease }, 0)
        .to(pageEls.current[from].querySelector('.shade'), { opacity: FLIP.shade, duration: FLIP.duration }, 0)
    }
  })

  // Nghiêng theo chuột trước khi mở (desktop)
  useEffect(() => {
    if (reduced || !matchMedia('(hover: hover)').matches) return
    const onMove = contextSafe(e => {
      if (opened.current) return
      gsap.to(bookRef.current, {
        rotationY: (e.clientX / innerWidth - 0.5) * 36, rotationX: -(e.clientY / innerHeight - 0.5) * 26,
        duration: 0.6, ease: 'power2.out',
      })
    })
    addEventListener('mousemove', onMove)
    return () => removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const onKey = e => {
      if (e.target.tagName === 'INPUT') return
      if (e.key === 'ArrowRight') flip(1)
      if (e.key === 'ArrowLeft') flip(-1)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  const onPointerDown = e => {
    startX.current = e.target.closest('input,button,a,iframe') ? null : e.clientX
  }
  const onPointerUp = e => {
    if (startX.current === null) return
    const dir = swipeDirection(e.clientX - startX.current)
    startX.current = null
    if (dir) flip(dir)
    else if (!opened.current) flip(1)
  }

  return (
    <>
      <div className="wrap" ref={wrapRef}>
        <div className="book" data-testid="book" ref={bookRef} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          <div className="page" data-page="cover" data-active={settled === 0} ref={el => (pageEls.current[0] = el)}>
            <div className="face front"><Cover /></div>
            <div className="face back paper" />
          </div>
          {pages.map(({ key, Component }, i) => (
            <div key={key} className="page" data-page={key} data-active={settled === i + 1} ref={el => (pageEls.current[i + 1] = el)}>
              <div className="face front paper">
                <Component active={settled === i + 1} leaving={leaving === i + 1} />
                <div className="shade" />
              </div>
              <div className="face back paper" />
            </div>
          ))}
        </div>
      </div>
      <div className="hint" ref={hintRef}>{content.openHint}</div>
      <div className="nav" data-testid="nav" ref={navRef}>
        <button data-testid="prev" aria-label="Trang trước" disabled={index <= 1} onClick={() => flip(-1)}>‹</button>
        <div className="dots" data-testid="dots">
          {pages.map((p, i) => <i key={p.key} className={index === i + 1 ? 'on' : ''} />)}
        </div>
        <button data-testid="next" aria-label="Trang sau" disabled={index >= total - 1} onClick={() => flip(1)}>›</button>
      </div>
    </>
  )
}
