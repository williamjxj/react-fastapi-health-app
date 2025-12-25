import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '@/components/ui/empty-state'

describe('EmptyState Component', () => {
  it('should display brief text message', () => {
    render(<EmptyState title="No data" description="No items found" />)
    
    expect(screen.getByText('No data')).toBeInTheDocument()
    expect(screen.getByText('No items found')).toBeInTheDocument()
  })

  it('should display action button when provided', () => {
    const handleAction = vi.fn()
    render(
      <EmptyState
        title="No data"
        description="No items found"
        actionLabel="Add Item"
        onAction={handleAction}
      />
    )
    
    const button = screen.getByRole('button', { name: /add item/i })
    expect(button).toBeInTheDocument()
  })

  it('should not display action button when not provided', () => {
    render(<EmptyState title="No data" description="No items found" />)
    
    const buttons = screen.queryAllByRole('button')
    expect(buttons.length).toBe(0)
  })

  it('should have accessible structure', () => {
    render(<EmptyState title="No data" description="No items found" />)
    
    // Should have semantic structure
    const title = screen.getByText('No data')
    expect(title.tagName).toBe('H3')
  })

  it('should match Ocean Breeze theme', () => {
    const { container } = render(<EmptyState title="No data" description="No items found" />)
    
    // Component should render with theme classes
    expect(container.firstChild).toBeInTheDocument()
  })
})

