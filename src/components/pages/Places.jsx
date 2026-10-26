import { useRef } from 'react'
import { content } from '../../content.js'
import { mapEmbedUrl, directionsUrl } from '../../lib/maps.js'
import { MapOverlay } from '../MapOverlay.jsx'
import { usePageReveal } from './usePageReveal.js'

const t = content.places

export function Places(props) {
  const ref = useRef(null)
  const boxes = [useRef(null), useRef(null)]
  usePageReveal(ref, props)
  return (
    <div data-reveal ref={ref}>
      <h3 className="pt">{t.title}</h3>
      {t.items.map((p, i) => (
        <div key={p.name} className="place a">
          <b>{p.icon} {p.name} · {p.time}</b>
          <small>{p.address}</small>
          <div className="mapbox" ref={boxes[i]}>{t.loading}</div>
          <a className="go" target="_blank" rel="noopener" href={directionsUrl(p.mapQuery)}>{t.directions}</a>
        </div>
      ))}
      <div className="pn">5 / 6</div>
      <MapOverlay
        targets={boxes}
        srcs={t.items.map(p => mapEmbedUrl(p.mapQuery))}
        titles={t.items.map(p => p.name)}
        visible={props.active}
      />
    </div>
  )
}
