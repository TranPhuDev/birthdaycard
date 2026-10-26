import { Petals } from './components/Petals.jsx'
import { Cover } from './components/pages/Cover.jsx'
import { content } from './content.js'

export default function App() {
  return (
    <>
      <Petals />
      <div className="wrap">
        <div className="book">
          <div className="page"><div className="face front"><Cover /></div></div>
        </div>
      </div>
      <div className="hint">{content.openHint}</div>
      <div className="nav" data-testid="nav" />
    </>
  )
}
