import { useRef } from 'react'
import { Petals } from './components/Petals.jsx'
import { Book } from './components/Book.jsx'
import { usePageReveal } from './components/pages/usePageReveal.js'
import { Greeting } from './components/pages/Greeting.jsx'
import { Reason } from './components/pages/Reason.jsx'
import { Invite } from './components/pages/Invite.jsx'
import { Schedule } from './components/pages/Schedule.jsx'
import { Places } from './components/pages/Places.jsx'

function RsvpStub(props) {
  const ref = useRef(null)
  usePageReveal(ref, props)
  return <div data-reveal ref={ref}><p className="a">rsvp</p></div>
}

const PAGES = [
  { key: 'greet', Component: Greeting },
  { key: 'reason', Component: Reason },
  { key: 'invite', Component: Invite },
  { key: 'schedule', Component: Schedule },
  { key: 'places', Component: Places },
  { key: 'rsvp', Component: RsvpStub },
]

export default function App() {
  return (
    <>
      <Petals />
      <Book pages={PAGES} />
    </>
  )
}
