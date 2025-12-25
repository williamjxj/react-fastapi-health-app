import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { PatientsTable } from '@/components/patients/PatientsTable'

// Mock delayed API response
const mockGetPatients = vi.fn()
vi.mock('@/lib/api/patientService', () => ({
  getPatients: (...args: any[]) => mockGetPatients(...args),
}))

describe('Loading State Timing', () => {
  beforeEach(() => {
    mockGetPatients.mockClear()
  })

  it('should display loading state within 200ms', async () => {
    // Mock a delayed response
    mockGetPatients.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        items: [],
        total: 0,
        total_pages: 0,
      }), 100))
    )

    render(<PatientsTable />)

    // Loading state should appear quickly
    await waitFor(() => {
      const loadingIndicator = screen.getByText(/loading patients/i)
      expect(loadingIndicator).toBeInTheDocument()
    }, { timeout: 300 })
  })

  it('should show loading indicator immediately', () => {
    mockGetPatients.mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    )

    const { container } = render(<PatientsTable />)
    
    // Should show loading state immediately
    const loadingText = screen.getByText(/loading patients/i)
    expect(loadingText).toBeInTheDocument()
  })

  it('should display skeleton loader during loading', () => {
    mockGetPatients.mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    )

    const { container } = render(<PatientsTable />)
    
    // Should show skeleton loaders
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})

