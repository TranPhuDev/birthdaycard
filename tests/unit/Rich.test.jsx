import { render } from '@testing-library/react'
import { Rich } from '../../src/lib/Rich.jsx'

test('Rich: **đậm** và xuống dòng', () => {
  const { container } = render(<Rich text={'a **b** c\nd'} />)
  expect(container.querySelector('b')).toHaveTextContent('b')
  expect(container.querySelectorAll('br')).toHaveLength(1)
  expect(container.textContent).toBe('a b cd')
})
