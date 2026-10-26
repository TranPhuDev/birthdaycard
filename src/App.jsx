import { useRef } from 'react'
import { Petals } from './components/Petals.jsx'
import { Book } from './components/Book.jsx'
import { usePageReveal } from './components/pages/usePageReveal.js'

const stub = key => function StubPage(props) {
  const ref = useRef(null)
  usePageReveal(ref, props)
  return <div data-reveal ref={ref}><p className="a">Trang {key}</p></div>
}

const PAGES = ['greet', 'reason', 'invite', 'schedule', 'places', 'rsvp'].map(key => ({ key, Component: stub(key) }))

export default function App() {
  return (
    <>
      <Petals />
      <Book pages={PAGES} />
    </>
  )
}
