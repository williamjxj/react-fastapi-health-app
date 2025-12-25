import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { PatientManagementPage } from '@/components/patients/PatientManagementPage'

// Mock child components
vi.mock('@/components/patients/PatientRegistrationForm', () => ({
  PatientRegistrationForm: () => <div>Form</div>,
}))

vi.mock('@/components/patients/PatientSearchForm', () => ({
  PatientSearchForm: () => <div>Search</div>,
}))

vi.mock('@/components/patients/PatientsTable', () => ({
  PatientsTable: () => <div>Table</div>,
}))

describe('PatientManagementPage Responsive Design - 1920px', () => {
  it('should use optimal layout at 1920px+', () => {
    const { container } = render(<PatientManagementPage />)
    const grid = container.querySelector('[class*="grid"]')
    
    // Should maintain two-column layout with optimal spacing
    expect(grid).toHaveClass('lg:grid-cols-2')
  })

  it('should have appropriate use of screen space at 1920px', () => {
    const { container } = render(<PatientManagementPage />)
    const containerDiv = container.querySelector('[class*="max-w"]')
    
    // Should have max-width to prevent excessive width
    expect(containerDiv).toHaveClass('max-w-7xl', 'mx-auto')
  })
})

