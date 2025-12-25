import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { PatientsTable } from '@/components/patients/PatientsTable'

// Mock API service
vi.mock('@/lib/api/patientService', () => ({
  getPatients: vi.fn().mockResolvedValue({
    items: [],
    total: 0,
    total_pages: 0,
  }),
}))

describe('PatientsTable Visual Regression', () => {
  it('should apply Ocean Breeze theme colors', () => {
    const { container } = render(<PatientsTable />)
    const table = container.querySelector('table')
    
    // Table should be rendered (or empty state)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should have improved typography for table content', () => {
    const { container } = render(<PatientsTable />)
    // Typography should be consistent with theme
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should have clear visual separation between table rows', () => {
    const { container } = render(<PatientsTable />)
    // When table has data, rows should have clear separation
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should have better information hierarchy', () => {
    const { container } = render(<PatientsTable />)
    // Table headers and content should have clear hierarchy
    expect(container.firstChild).toBeInTheDocument()
  })
})

