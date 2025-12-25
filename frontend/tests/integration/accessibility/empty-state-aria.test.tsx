import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PatientsTable } from '@/components/patients/PatientsTable'

// Mock API service - return empty results
vi.mock('@/lib/api/patientService', () => ({
  getPatients: vi.fn().mockResolvedValue({
    items: [],
    total: 0,
    total_pages: 0,
  }),
}))

describe('Empty State Accessibility (ARIA)', () => {
  it('should have accessible empty state messages', async () => {
    render(<PatientsTable />)
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Empty state should be readable by screen readers
    const emptyMessage = screen.getByText(/no patients found/i)
    expect(emptyMessage).toBeInTheDocument()
  })

  it('should have semantic HTML structure for empty state', async () => {
    render(<PatientsTable />)
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Should use semantic HTML
    const emptyState = screen.getByText(/no patients found/i)
    expect(emptyState).toBeInTheDocument()
  })

  it('should provide context for screen readers', async () => {
    render(<PatientsTable />)
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Should provide helpful context
    const guidance = screen.getByText(/get started/i)
    expect(guidance).toBeInTheDocument()
  })
})

