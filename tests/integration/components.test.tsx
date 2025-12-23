import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('shadcn/ui Components', () => {
  it('should be able to import shadcn/ui components', () => {
    expect(Button).toBeDefined()
  })

  it('should render shadcn/ui Button component', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should apply Tailwind CSS classes to Button', () => {
    const { container } = render(<Button>Test Button</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('inline-flex')
  })
})

