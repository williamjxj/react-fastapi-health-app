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
    const element = container.querySelector('div')
    expect(element).toHaveClass('min-h-screen')
  })

  it('should render example components', () => {
    const { container } = render(<App />)
    // Verify the component structure exists
    expect(container.querySelector('section')).toBeInTheDocument()
  })
})

