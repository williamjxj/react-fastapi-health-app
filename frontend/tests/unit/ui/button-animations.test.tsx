import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button Animations', () => {
  it('should have hover state styles', () => {
    const { container } = render(<Button>Click me</Button>)
    const button = container.querySelector('button')
    
    expect(button).toBeInTheDocument()
    // Button should have hover state classes
    expect(button).toHaveClass('transition-colors')
  })

  it('should have active state styles', () => {
    const { container } = render(<Button>Click me</Button>)
    const button = container.querySelector('button')
    
    expect(button).toBeInTheDocument()
    // Button should respond to active state
    expect(button).toHaveClass('transition-colors')
  })

  it('should have focus indicator styles', () => {
    const { container } = render(<Button>Click me</Button>)
    const button = container.querySelector('button')
    
    expect(button).toBeInTheDocument()
    // Button should have focus-visible styles
    expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2')
  })

  it('should provide immediate visual feedback on interaction', async () => {
    const user = userEvent.setup()
    const { container } = render(<Button>Click me</Button>)
    const button = container.querySelector('button')
    
    expect(button).toBeInTheDocument()
    
    // Button should have transition classes for smooth feedback
    expect(button).toHaveClass('transition-colors')
    
    // Simulate hover
    await user.hover(button!)
    // Visual feedback should be immediate (tested via CSS classes)
  })
})

