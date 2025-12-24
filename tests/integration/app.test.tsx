import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from '@/App'

describe('App Integration', () => {
  it('should render the application without errors', () => {
    const { container } = render(<App />)
    expect(container).toBeInTheDocument()
  })

  it('should have Tailwind CSS classes applied', () => {
    const { container } = render(<App />)
    const main = container.querySelector('main')
    expect(main).toHaveClass('min-h-screen')
  })

  it('should render Patient Management Page', () => {
    render(<App />)
    expect(screen.getByText(/patient management system/i)).toBeInTheDocument()
  })
})

