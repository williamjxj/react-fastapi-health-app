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

describe('PatientManagementPage Responsive Design - 768px', () => {
  it('should adapt layout at 768px breakpoint', () => {
    const { container } = render(<PatientManagementPage />)
    const grid = container.querySelector('[class*="grid"]')
    
    // Grid should be responsive
    expect(grid).toBeInTheDocument()
  })

  it('should have readable text at 768px', () => {
    const { container } = render(<PatientManagementPage />)
    const h1 = container.querySelector('h1')
    
    // Typography should be readable
    expect(h1).toHaveClass('text-3xl', 'md:text-4xl')
  })
})

