import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from '@/App'

describe('App', () => {
  it('should render the app component without errors', () => {
    const { container } = render(<App />)
    expect(container).toBeInTheDocument()
  })
})

