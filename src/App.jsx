import { Petals } from './components/Petals.jsx'
import { Book } from './components/Book.jsx'
import { Greeting } from './components/pages/Greeting.jsx'
import { Reason } from './components/pages/Reason.jsx'
import { Invite } from './components/pages/Invite.jsx'
import { Schedule } from './components/pages/Schedule.jsx'
import { Places } from './components/pages/Places.jsx'
import { Rsvp } from './components/pages/Rsvp.jsx'

const PAGES = [
  { key: 'greet', Component: Greeting },
  { key: 'reason', Component: Reason },
  { key: 'invite', Component: Invite },
  { key: 'schedule', Component: Schedule },
  { key: 'places', Component: Places },
  { key: 'rsvp', Component: Rsvp },
]

export default function App() {
  return (
    <>
      <Petals />
      <Book pages={PAGES} />
    </>
  )
}
