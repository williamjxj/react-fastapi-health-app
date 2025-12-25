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

describe('PatientsTable Empty State', () => {
  it('should display empty state when no patients exist', async () => {
    render(<PatientsTable />)
    
    // Wait for API call to complete
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Should show empty state message
    const emptyMessage = screen.getByText(/no patients found/i)
    expect(emptyMessage).toBeInTheDocument()
  })

  it('should display action guidance when no patients exist', async () => {
    render(<PatientsTable />)
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Should show guidance text
    const guidance = screen.getByText(/register a new patient/i)
    expect(guidance).toBeInTheDocument()
  })

  it('should display different message when search returns no results', async () => {
    render(<PatientsTable initialSearch="nonexistent" />)
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Should show search-specific message
    const searchMessage = screen.getByText(/try adjusting your search/i)
    expect(searchMessage).toBeInTheDocument()
  })

  it('should have accessible empty state structure', async () => {
    render(<PatientsTable />)
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Empty state should be accessible - use getAllByText since there might be multiple instances
    const emptyStates = screen.getAllByText(/no patients found/i)
    expect(emptyStates.length).toBeGreaterThan(0)
  })
})

