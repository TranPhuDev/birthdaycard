import { Fragment } from 'react'

// Hiển thị chuỗi từ content.js: **x** → <b>x</b>, \n → <br/>
export function Rich({ text }) {
  return text.split('\n').map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line.split(/\*\*(.+?)\*\*/g).map((part, j) => (j % 2 ? <b key={j}>{part}</b> : part))}
    </Fragment>
  ))
}
